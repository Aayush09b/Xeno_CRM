

const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
  field: String,
  operator: String,
  value: mongoose.Schema.Types.Mixed,
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    default: 'AND'
  }
});

const segmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  rules: [ruleSchema],
  logic: [String], // <-- Add this line
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  customerCount: { type: Number, default: 0 }
});


module.exports = mongoose.model('Segment', segmentSchema);
