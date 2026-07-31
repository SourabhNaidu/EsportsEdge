const express = require('express');
const { getMatchAnalytics } = require('../controllers/analytics.controller');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/matches/:matchId', asyncHandler(getMatchAnalytics));

module.exports = router;

