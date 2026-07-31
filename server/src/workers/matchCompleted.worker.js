require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('../config/db');
const Match = require('../models/Match');
const { consumeMatchCompleted } = require('../services/rabbitmq.service');
const { scoreMatchPredictions } = require('../services/scoring.service');

async function handleMatchCompleted(payload, io) {
  const match = await Match.findById(payload.matchId);

  if (!match) {
    throw new Error(`Match ${payload.matchId} not found`);
  }

  const scoring = await scoreMatchPredictions(match);

  if (io) {
    io.emit('match:completed', { matchId: match._id.toString(), scoring });
    io.emit('leaderboard:updated', { matchId: match._id.toString() });
  }

  return scoring;
}

async function startMatchCompletedWorker({ io } = {}) {
  await consumeMatchCompleted((payload) => handleMatchCompleted(payload, io));
  console.log('RabbitMQ worker listening for match.completed events.');
}

async function startStandaloneWorker() {
  await connectDB();
  await startMatchCompletedWorker();
}

if (require.main === module) {
  startStandaloneWorker().catch(async (error) => {
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  });
}

module.exports = {
  handleMatchCompleted,
  startMatchCompletedWorker,
};
