

const axios = require('axios');

// Simple API caller for vendor controller
exports.callDeliveryReceiptAPI = async (receiptData) => {
  try {
    await axios.post(`${process.env.BACKEND_URL}/api/delivery/delivery-receipt`, receiptData);
    return true;
  } catch (err) {
    console.error('Delivery receipt API error:', err);
    throw err;
  }
};

exports.callDeliveryRetryReceiptAPI = async (receiptData) => {
  try {
    await axios.post(`${process.env.BACKEND_URL}/api/delivery/retry-receipt`, receiptData);
    return true;
  } catch (err) {
    console.error('Delivery receipt API error:', err);
    throw err;
  }
};