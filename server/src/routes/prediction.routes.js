const express = require('express');
const {
  createPrediction,
  getMyPredictionForMatch,
  getPredictionPercentages,
} = require('../controllers/prediction.controller');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/matches/:matchId/percentages', asyncHandler(getPredictionPercentages));
router.get('/matches/:matchId/me', requireAuth, asyncHandler(getMyPredictionForMatch));
router.post('/', requireAuth, asyncHandler(createPrediction));

module.exports = router;

