const express = require('express');
const adminController = require('../controllers/admin.controller');
const asyncHandler = require('../middleware/asyncHandler');
const { requireAdmin, requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth, requireAdmin);

const resources = [
  ['teams', adminController.teams],
  ['players', adminController.players],
  ['tournaments', adminController.tournaments],
  ['maps', adminController.maps],
  ['agents', adminController.agents],
  ['matches', adminController.matches],
];

resources.forEach(([path, controller]) => {
  router.get(`/${path}`, asyncHandler(controller.list));
  router.post(`/${path}`, asyncHandler(controller.create));
});

module.exports = router;

