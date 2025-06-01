const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  city: String,
  country: String,
  age: Number,
  gender: String,
  createdAt: { type: Date, default: Date.now },
  orders: [{
    orderId: String,
    amount: Number,
    date: Date,
    products: [String]
  }]
});

module.exports = mongoose.model('Customer', customerSchema);