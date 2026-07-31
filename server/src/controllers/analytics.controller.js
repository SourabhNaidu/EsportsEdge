const Match = require('../models/Match');
const demoMatches = require('../data/demoMatches');

function formScore(form = []) {
  if (!form.length) {
    return 50;
  }

  const wins = form.filter((result) => result === 'W').length;
  return Math.round((wins / form.length) * 100);
}

function buildMatchAnalytics(match) {
  const teamAForm = formScore(match.teamA?.recentForm);
  const teamBForm = formScore(match.teamB?.recentForm);
  const momentumScore = Math.round((teamAForm + (100 - teamBForm)) / 2);
  const gap = Math.abs(teamAForm - teamBForm);
  const upsetLevel = gap <= 10 ? 'Medium' : gap <= 20 ? 'Low' : 'High';

  return {
    momentumScore,
    mapAdvantage: teamAForm >= teamBForm ? '+8%' : '-6%',
    upsetAlert: upsetLevel,
    teamAForm,
    teamBForm,
    explanation:
      teamAForm >= teamBForm
        ? `${match.teamA?.name || 'Team A'} enter with stronger recent form.`
        : `${match.teamB?.name || 'Team B'} have the better recent form trend.`,
  };
}

async function getMatchAnalytics(req, res) {
  const demoMatch = demoMatches.find((match) => match._id === req.params.matchId);

  if (demoMatch) {
    return res.json({
      status: 'success',
      source: 'demo',
      analytics: buildMatchAnalytics(demoMatch),
    });
  }

  const match = await Match.findById(req.params.matchId).populate('teamA').populate('teamB');

  if (!match) {
    return res.status(404).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  return res.json({
    status: 'success',
    source: 'database',
    analytics: buildMatchAnalytics(match),
  });
}

module.exports = {
  buildMatchAnalytics,
  getMatchAnalytics,
};

