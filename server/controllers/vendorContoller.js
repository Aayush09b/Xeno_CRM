
const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const segmentController = require('./segmentController');
const { callDeliveryReceiptAPI,callDeliveryRetryReceiptAPI } = require('../utils/deliveryService');

exports.sendCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    const segment = await Segment.findById(campaign.segment);
    const customers = await segmentController.evaluateSegment(segment.rules, segment.logic);
    
    campaign.status = 'sending';
    await campaign.save();
    
    // Simulate sending with delivery receipts
    for (const customer of customers) {
      try {
        // Simulate sending (90% success rate)
        const success = Math.random() > 0.1;
        const status = success ? 'sent' : 'failed';
        const error = success ? null : 'Simulated failure';
        
        // const resolvedMessage = campaign.message.replace(/\${user}/g, customer.name);
        let resolvedMessage = campaign.message;

if (resolvedMessage.includes('${user}')) {
  resolvedMessage = resolvedMessage.replace(/\${user}/g, customer.name);
} else {
  resolvedMessage = `Hi ${customer.name}, ${resolvedMessage}`;
}


        
        // Instead of updating directly, call delivery receipt API
        await callDeliveryReceiptAPI({
          campaignId: campaign._id,
          customerId: customer._id,
          status,
          error,
          message: resolvedMessage
        });
        
      } catch (err) {
        console.error('Error sending delivery receipt:', err);
      }
    }
    
    res.json({ 
      message: 'Campaign sending initiated', 
      note: 'Delivery status will be updated via delivery receipts' 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send campaign' });
  }
};


exports.retryFailed = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate('logs.customer');
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const failedLogs = campaign.logs.filter(log => log.status === 'failed');

    // Set status to "sending"
    campaign.status = 'sending';

    // Retry each failed log
    for (let i = 0; i < campaign.logs.length; i++) {
      const log = campaign.logs[i];

      if (log.status === 'failed') {
        try {
          // const success = Math.random() > 0.2;
          const success=true;
          const status = success ? 'sent' : 'failed';
          const error = success ? null : 'Retry failed';

          // Update the log
          campaign.logs[i].status = status;
          campaign.logs[i].error = error;
          campaign.logs[i].timestamp = new Date();

          
          // Simulate delivery receipt
          await callDeliveryRetryReceiptAPI({
            campaignId: campaign._id,
            customerId: log.customer,
            status,
            error,
            message:log.message
          });
        } catch (err) {
          console.error('Error sending retry delivery receipt:', err);
        }
      }
    }

    // Save updated campaign
    await campaign.save();

    res.json({ 
      message: 'Campaign retry completed', 
      updated: failedLogs.length 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to retry campaign' });
  }
};
