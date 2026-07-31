const mongoose = require('mongoose');
const User = require('../models/User');

const demoLeaderboard = [
  { username: 'vandalVision', totalPoints: 1240, accuracy: 68, streak: 5 },
  { username: 'clutchIndex', totalPoints: 1090, accuracy: 64, streak: 4 },
  { username: 'ecoHunter', totalPoints: 980, accuracy: 61, streak: 3 },
  { username: 'spikeRead', totalPoints: 925, accuracy: 59, streak: 2 },
];

async function getLeaderboard(req, res) {
  if (mongoose.connection.readyState !== 1) {
    return res.json({
      status: 'success',
      source: 'demo',
      items: demoLeaderboard,
    });
  }

  const users = await User.find()
    .sort({ 'predictionStats.totalPoints': -1, 'predictionStats.accuracy': -1 })
    .limit(25)
    .select('username predictionStats');

  return res.json({
    status: 'success',
    source: 'database',
    items: users.map((user) => ({
      username: user.username,
      totalPoints: user.predictionStats.totalPoints,
      accuracy: user.predictionStats.accuracy,
      streak: user.predictionStats.streak,
    })),
  });
}

module.exports = {
  getLeaderboard,
};

