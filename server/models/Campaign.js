const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  segment: { type: mongoose.Schema.Types.ObjectId, ref: 'Segment' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['draft', 'sending', 'sent', 'failed'], default: 'draft' },
  sentCount: { type: Number, default: 0 },
  totalCount: { type: Number, default: 0 },
  logs: [{
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    status: { type: String, enum: ['sent', 'failed'], required: true },
    error: String,
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);