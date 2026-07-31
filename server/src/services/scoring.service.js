const Prediction = require('../models/Prediction');
const User = require('../models/User');

function calculatePredictionPoints(prediction, match) {
  let points = 0;

  if (prediction.winner.toString() === match.winner?.toString()) {
    points += 5;
  }

  if (prediction.scoreline === match.resultDetails?.scoreline) {
    points += 3;
  }

  if (
    prediction.firstMapWinner.toString() ===
    match.resultDetails?.firstMapWinner?.toString()
  ) {
    points += 2;
  }

  if (
    prediction.topFragger &&
    match.resultDetails?.topFragger &&
    prediction.topFragger.toLowerCase() === match.resultDetails.topFragger.toLowerCase()
  ) {
    points += 2;
  }

  return points;
}

async function scoreMatchPredictions(match) {
  const predictions = await Prediction.find({ match: match._id });
  const updates = predictions.map(async (prediction) => {
    const points = calculatePredictionPoints(prediction, match);

    prediction.pointsAwarded = points;
    prediction.status = 'scored';
    await prediction.save();

    const userPredictions = await Prediction.find({
      user: prediction.user,
      status: 'scored',
    });
    const totalPoints = userPredictions.reduce(
      (sum, item) => sum + item.pointsAwarded,
      0,
    );
    const correctWinners = userPredictions.filter((item) => item.pointsAwarded >= 5).length;
    const accuracy = userPredictions.length
      ? Math.round((correctWinners / userPredictions.length) * 100)
      : 0;
    const user = await User.findById(prediction.user).select('predictionStats.streak');
    const streak = points >= 5 ? (user?.predictionStats?.streak || 0) + 1 : 0;

    await User.findByIdAndUpdate(prediction.user, {
      $set: {
        'predictionStats.totalPoints': totalPoints,
        'predictionStats.accuracy': accuracy,
        'predictionStats.streak': streak,
      },
    });
  });

  await Promise.all(updates);

  return {
    scored: predictions.length,
  };
}

module.exports = {
  calculatePredictionPoints,
  scoreMatchPredictions,
};
