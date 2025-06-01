// controllers/deliveryController.js
const Campaign = require('../models/Campaign');
const axios = require('axios');

// Batch configuration
const BATCH_INTERVAL_MS = 2000; // Process every 2 seconds
const MAX_BATCH_SIZE = 5; // Max receipts per batch

// Batch state
let currentBatch = [];
let batchTimeout = null;

// Process individual receipt API
exports.receiveDeliveryReceipt = async (req, res) => {
  try {
    const { campaignId, customerId, status, error,message } = req.body;
    
    // Validate required fields
    if (!campaignId || !customerId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Add to current batch
    currentBatch.push({ campaignId, customerId, status, error,message });
    
    // Start batch timeout if not already running
    if (!batchTimeout) {
      batchTimeout = setTimeout(processCurrentBatch, BATCH_INTERVAL_MS);
    }
    
    // Process immediately if batch size reached
    if (currentBatch.length >= MAX_BATCH_SIZE) {
      clearTimeout(batchTimeout);
      await processCurrentBatch();
    }
    
    res.status(202).json({ message: 'Receipt accepted for batch processing' });
  } catch (err) {
    console.error('Error processing delivery receipt:', err);
    res.status(500).json({ message: 'Error processing delivery receipt' });
  }
};

// Process the current batch of receipts
async function processCurrentBatch() {
  if (currentBatch.length === 0) {
    batchTimeout = null;
    return;
  }
  
  // Get the batch to process and reset current batch
  const batchToProcess = [...currentBatch];
  currentBatch = [];
  batchTimeout = null;
  
  try {
    // Group receipts by campaign
    const receiptsByCampaign = {};
    batchToProcess.forEach(receipt => {
      if (!receiptsByCampaign[receipt.campaignId]) {
        receiptsByCampaign[receipt.campaignId] = [];
      }
      receiptsByCampaign[receipt.campaignId].push(receipt);
    });
    
    // Process each campaign's receipts
    for (const [campaignId, receipts] of Object.entries(receiptsByCampaign)) {
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) continue;
        
        // Create map of existing logs
        const logMap = new Map();
        campaign.logs.forEach(log => {
          logMap.set(log.customer.toString(), log);
        });
        
        let sentCountDelta = 0;
        
        // Process each receipt
        for (const receipt of receipts) {
          const customerIdStr = receipt.customerId.toString();
          const existingLog = logMap.get(customerIdStr);
          
          if (existingLog) {
            // Update existing log if status changed
            if (existingLog.status !== receipt.status) {
              existingLog.status = receipt.status;
              existingLog.error = receipt.error || null;
              existingLog.message = receipt.message;
              existingLog.updatedAt = new Date();
              
              if (receipt.status === 'sent') sentCountDelta++;
            }
          } else {
            // Add new log
            campaign.logs.push({
              customer: receipt.customerId,
              status: receipt.status,
              error: receipt.error || null,
              message: receipt.message
            });
            if (receipt.status === 'sent') sentCountDelta++;
          }
        }
        
        // Update campaign stats
        if (sentCountDelta > 0) {
          campaign.sentCount += sentCountDelta;
        }
        
        // Update overall status
        const hasFailures = campaign.logs.some(log => log.status === 'failed');
        campaign.status = hasFailures ? 'failed' : 'sent';
        
        await campaign.save();
      } catch (err) {
        console.error(`Error updating campaign ${campaignId}:`, err);
      }
    }
  } catch (err) {
    console.error('Error processing receipt batch:', err);
  }
  
  // Schedule next processing if new receipts arrived
  if (currentBatch.length > 0) {
    batchTimeout = setTimeout(processCurrentBatch, BATCH_INTERVAL_MS);
  }
}






// Retry batch config
const RETRY_BATCH_INTERVAL_MS = 2000;
const MAX_RETRY_BATCH_SIZE = 5;

// Batch state
let retryBatch = [];
let retryBatchTimeout = null;

exports.retryFailedReceipt = async (req, res) => {
  try {
    const { campaignId, customerId, status, error, message } = req.body;

    if (!campaignId || !customerId || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    retryBatch.push({ campaignId, customerId, status, error, message });

    // Start timer if not already running
    if (!retryBatchTimeout) {
      retryBatchTimeout = setTimeout(processRetryBatch, RETRY_BATCH_INTERVAL_MS);
    }

    // Immediate process if batch full
    if (retryBatch.length >= MAX_RETRY_BATCH_SIZE) {
      clearTimeout(retryBatchTimeout);
      await processRetryBatch();
    }

    res.status(202).json({ message: 'Retry receipt queued for batch processing' });
  } catch (err) {
    console.error('Error in retryFailedReceipt:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Batch processor
async function processRetryBatch() {
  if (retryBatch.length === 0) {
    retryBatchTimeout = null;
    return;
  }

  const batchToProcess = [...retryBatch];
  retryBatch = [];
  retryBatchTimeout = null;

  try {
    const receiptsByCampaign = {};
    batchToProcess.forEach(receipt => {
      if (!receiptsByCampaign[receipt.campaignId]) {
        receiptsByCampaign[receipt.campaignId] = [];
      }
      receiptsByCampaign[receipt.campaignId].push(receipt);
    });

    for (const [campaignId, receipts] of Object.entries(receiptsByCampaign)) {
      try {
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) continue;

        const logMap = new Map();
        campaign.logs.forEach(log => {
          logMap.set(log.customer.toString(), log);
        });

        let sentCountDelta = 0;

        for (const receipt of receipts) {
          const customerIdStr = receipt.customerId.toString();
          const existingLog = logMap.get(customerIdStr);

          if (existingLog) {
            existingLog.status = receipt.status;
            existingLog.error = receipt.error || null;
            existingLog.message = receipt.message;
            existingLog.updatedAt = new Date();

            if (receipt.status === 'sent') {
              sentCountDelta++;
            }
          }
        }

        if (sentCountDelta > 0) {
          campaign.sentCount += sentCountDelta;
        }

        const hasFailures = campaign.logs.some(log => log.status === 'failed');
        campaign.status = hasFailures ? 'failed' : 'sent';

        await campaign.save();
      } catch (err) {
        console.error(`Error processing campaign ${campaignId}:`, err);
      }
    }
  } catch (err) {
    console.error('Error processing retry receipt batch:', err);
  }

  if (retryBatch.length > 0) {
    retryBatchTimeout = setTimeout(processRetryBatch, RETRY_BATCH_INTERVAL_MS);
  }
}
