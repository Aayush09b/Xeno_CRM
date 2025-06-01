const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segmentController');
const auth = require('../middlewares/auth');

router.post('/', auth, segmentController.createSegment);
router.get('/', auth, segmentController.getSegments);
router.get('/:id', auth, segmentController.getSegment);
router.post('/preview', auth, segmentController.previewSegment);
router.delete('/:id', auth, segmentController.deleteSegment);
router.get('/:id/customers', auth, segmentController.getSegmentCustomers);

module.exports = router;