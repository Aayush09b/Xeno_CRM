const express = require('express');
const router = express.Router();

const deliveryController = require('../controllers/deliveryController');

router.post('/delivery-receipt', deliveryController.receiveDeliveryReceipt);
router.post('/retry-receipt', deliveryController.retryFailedReceipt);



module.exports = router;