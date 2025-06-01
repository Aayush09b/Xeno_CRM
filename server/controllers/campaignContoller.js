const Campaign = require('../models/Campaign');
const Segment = require('../models/Segment');
const Customer = require('../models/Customer');
const segmentController = require('./segmentController');


// Create a campaign
exports.createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign({
      ...req.body,
      user: req.user.id,
      status: 'draft'
    });
    
    const segment = await Segment.findById(req.body.segment);
    if (!segment) {
      return res.status(404).json({ message: 'Segment not found' });
    }
    
    campaign.totalCount = segment.customerCount;
    await campaign.save();
    
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create campaign' });
  }
};

// Get all campaigns for user
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user.id })
      .populate('segment', 'name');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaigns' });
  }
};


// Get campaign by ID
exports.getCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('segment', 'name')
      .populate('logs.customer', 'name email');
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch campaign' });
  }
};

