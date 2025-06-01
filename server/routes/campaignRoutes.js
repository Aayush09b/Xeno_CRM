const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignContoller');
const auth = require('../middlewares/auth');

router.post('/', auth, campaignController.createCampaign);
router.get('/', auth, campaignController.getCampaigns);
router.get('/:id', auth, campaignController.getCampaign);



module.exports = router;
