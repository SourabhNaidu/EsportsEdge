const express = require('express');
const { getDatabaseStatus } = require('../config/db');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'EsportsEdge API',
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
  });
});

module.exports = router;

