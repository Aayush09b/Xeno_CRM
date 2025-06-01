const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/vendorContoller');
const auth = require('../middlewares/auth');


// router.post('/:id/send', auth, campaignController.sendCampaign);
// router.post('/:id/retry', auth, campaignController.retryFailed);


/**
 * @swagger
 * /api/vendor/{id}/send:
 *   post:
 *     summary: Send a campaign message to customers
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Campaign ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Campaign sent successfully
 *       404:
 *         description: Campaign not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/send', auth, campaignController.sendCampaign);


/**
 * @swagger
 * /api/vendor/{id}/retry:
 *   post:
 *     summary: Retry sending a campaign message to customers who previously failed
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Campaign ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retry process started
 *       404:
 *         description: Campaign not found
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/retry', auth, campaignController.retryFailed);


module.exports = router;
