const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const auth = require('../middlewares/auth');

// router.post('/', auth, segmentController.createSegment);
// router.get('/', auth, segmentController.getSegments);
// router.get('/:id', auth, segmentController.getSegment);
// router.post('/preview', auth, segmentController.previewSegment);
// router.delete('/:id', auth, segmentController.deleteSegment);
// router.get('/:id/customers', auth, segmentController.getSegmentCustomers);


/**
 * @swagger
 * /api/segments:
 *   post:
 *     summary: Create a new segment
 *     tags: [Segments]
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
 *               - rules
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     operator:
 *                       type: string
 *                     value:
 *                       type: string
 *               logic:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Segment created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', auth, segmentController.createSegment);

/**
 * @swagger
 * /api/segments:
 *   get:
 *     summary: Get all segments for the logged-in user
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of segments
 *       401:
 *         description: Unauthorized
 */
router.get('/', auth, segmentController.getSegments);

/**
 * @swagger
 * /api/segments/{id}:
 *   get:
 *     summary: Get a specific segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Segment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Segment data
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id', auth, segmentController.getSegment);

/**
 * @swagger
 * /api/segments/preview:
 *   post:
 *     summary: Preview segment results based on rules
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                     operator:
 *                       type: string
 *                     value:
 *                       type: string
 *               logic:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Preview data returned
 *       401:
 *         description: Unauthorized
 */
router.post('/preview', auth, segmentController.previewSegment);

/**
 * @swagger
 * /api/segments/{id}:
 *   delete:
 *     summary: Delete a segment by ID
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Segment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Segment deleted
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', auth, segmentController.deleteSegment);

/**
 * @swagger
 * /api/segments/{id}/customers:
 *   get:
 *     summary: Get customers associated with a segment
 *     tags: [Segments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Segment ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of customers in the segment
 *       404:
 *         description: Segment not found
 *       401:
 *         description: Unauthorized
 */
router.get('/:id/customers', auth, segmentController.getSegmentCustomers);


module.exports = router;