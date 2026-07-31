const express = require('express');
const { getMatch, listMatches } = require('../controllers/match.controller');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(listMatches));
router.get('/:id', asyncHandler(getMatch));

module.exports = router;

