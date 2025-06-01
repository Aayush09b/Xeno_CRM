const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middlewares/auth');

router.post('/', auth, customerController.addCustomer);
router.post('/batch', customerController.addCustomers);
router.get('/', auth, customerController.getCustomers);
router.post('/:id/orders', auth, customerController.addOrder);

module.exports = router;