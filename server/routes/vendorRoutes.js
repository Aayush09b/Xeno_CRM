const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/vendorContoller');
const auth = require('../middlewares/auth');


router.post('/:id/send', auth, campaignController.sendCampaign);
router.post('/:id/retry', auth, campaignController.retryFailed);


module.exports = router;
