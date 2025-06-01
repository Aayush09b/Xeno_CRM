const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignContoller');
const auth = require('../middlewares/auth');

// router.post('/', auth, campaignController.createCampaign);
// router.get('/', auth, campaignController.getCampaigns);
// router.get('/:id', auth, campaignController.getCampaign);


/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Create a new campaign
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - message
 *               - segment
 *             properties:
 *               name:
 *                 type: string
 *                 example: Summer Sale Campaign
 *               message:
 *                 type: string
 *                 example: "Enjoy 30% off on all items!"
 *               segment:
 *                 type: string
 *                 description: Segment ID
 *     responses:
 *       201:
 *         description: Campaign created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, campaignController.createCampaign);

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Get all campaigns for the logged-in user
 *     tags: [Campaigns]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of campaigns
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, campaignController.getCampaigns);

/**
 * @swagger
 * /api/campaigns/{id}:
 *   get:
 *     summary: Get a campaign by its ID
 *     tags: [Campaigns]
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
 *         description: Campaign data retrieved
 *       404:
 *         description: Campaign not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', auth, campaignController.getCampaign);

module.exports = router;
