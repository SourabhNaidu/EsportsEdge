const mongoose = require('mongoose');
const Match = require('../models/Match');
const demoMatches = require('../data/demoMatches');

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

function filterDemoMatches(query) {
  const { status, q } = query;
  const normalizedQuery = q?.toLowerCase();

  return demoMatches.filter((match) => {
    const matchesStatus = !status || match.status === status;
    const matchesSearch =
      !normalizedQuery ||
      [match.teamA.name, match.teamB.name, match.tournament.name]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });
}

async function listMatches(req, res) {
  if (!isDatabaseReady()) {
    const items = filterDemoMatches(req.query);

    return res.json({
      status: 'success',
      source: 'demo',
      count: items.length,
      items,
    });
  }

  const { status, q } = req.query;
  const filters = {};

  if (status) {
    filters.status = status;
  }

  const query = Match.find(filters)
    .populate('tournament')
    .populate('teamA')
    .populate('teamB')
    .populate('winner')
    .sort({ startsAt: 1 });

  const matches = await query;
  const items = q
    ? matches.filter((match) =>
        [match.teamA?.name, match.teamB?.name, match.tournament?.name]
          .join(' ')
          .toLowerCase()
          .includes(q.toLowerCase()),
      )
    : matches;

  return res.json({
    status: 'success',
    source: 'database',
    count: items.length,
    items,
  });
}

async function getMatch(req, res) {
  if (!isDatabaseReady()) {
    const item = demoMatches.find((match) => match._id === req.params.id);

    if (!item) {
      return res.status(404).json({
        status: 'error',
        message: 'Match not found',
      });
    }

    return res.json({
      status: 'success',
      source: 'demo',
      item,
    });
  }

  const item = await Match.findById(req.params.id)
    .populate('tournament')
    .populate('teamA')
    .populate('teamB')
    .populate('winner');

  if (!item) {
    return res.status(404).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  return res.json({
    status: 'success',
    source: 'database',
    item,
  });
}

module.exports = {
  listMatches,
  getMatch,
};

