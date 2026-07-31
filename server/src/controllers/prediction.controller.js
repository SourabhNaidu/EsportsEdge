const Match = require('../models/Match');
const Prediction = require('../models/Prediction');
const { predictionSchema } = require('../schemas/prediction.schema');

function zodMessages(error) {
  return error.issues.map((issue) => issue.message);
}

function isLocked(match) {
  return match.status !== 'upcoming' || new Date(match.startsAt) <= new Date();
}

async function createPrediction(req, res) {
  const parsed = predictionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid prediction details',
      errors: zodMessages(parsed.error),
    });
  }

  const match = await Match.findById(parsed.data.match);

  if (!match) {
    return res.status(404).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  if (isLocked(match)) {
    return res.status(409).json({
      status: 'error',
      message: 'Predictions are locked for this match',
    });
  }

  const teamIds = [match.teamA.toString(), match.teamB.toString()];

  if (
    !teamIds.includes(parsed.data.winner) ||
    !teamIds.includes(parsed.data.firstMapWinner)
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Prediction teams must belong to this match',
    });
  }

  const existingPrediction = await Prediction.findOne({
    user: req.user._id,
    match: match._id,
  });

  if (existingPrediction) {
    return res.status(409).json({
      status: 'error',
      message: 'You already predicted this match',
    });
  }

  const prediction = await Prediction.create({
    ...parsed.data,
    user: req.user._id,
  });

  await prediction.populate(['match', 'winner', 'firstMapWinner']);

  return res.status(201).json({
    status: 'success',
    message: 'Prediction saved',
    item: prediction,
  });
}

async function getMyPredictionForMatch(req, res) {
  const prediction = await Prediction.findOne({
    user: req.user._id,
    match: req.params.matchId,
  }).populate(['match', 'winner', 'firstMapWinner']);

  return res.json({
    status: 'success',
    item: prediction,
  });
}

async function getPredictionPercentages(req, res) {
  const match = await Match.findById(req.params.matchId);

  if (!match) {
    return res.status(404).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  const totals = await Prediction.aggregate([
    { $match: { match: match._id } },
    { $group: { _id: '$winner', count: { $sum: 1 } } },
  ]);
  const totalCount = totals.reduce((sum, item) => sum + item.count, 0);
  const percentages = totals.reduce((map, item) => {
    map[item._id.toString()] = totalCount
      ? Math.round((item.count / totalCount) * 100)
      : 0;
    return map;
  }, {});

  return res.json({
    status: 'success',
    totalCount,
    percentages,
  });
}

module.exports = {
  createPrediction,
  getMyPredictionForMatch,
  getPredictionPercentages,
};

