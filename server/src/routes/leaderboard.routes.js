const express = require('express');
const { getLeaderboard } = require('../controllers/leaderboard.controller');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getLeaderboard));

module.exports = router;

