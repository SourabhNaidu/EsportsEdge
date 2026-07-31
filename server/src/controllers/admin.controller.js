const Agent = require('../models/Agent');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const ValorantMap = require('../models/ValorantMap');
const { publishMatchCompleted } = require('../services/rabbitmq.service');
const { scoreMatchPredictions } = require('../services/scoring.service');
const {
  agentSchema,
  mapSchema,
  matchSchema,
  matchResultSchema,
  playerSchema,
  teamSchema,
  tournamentSchema,
} = require('../schemas/admin.schema');

function zodMessages(error) {
  return error.issues.map((issue) => issue.message);
}

function createResourceController(Model, schema, options = {}) {
  return {
    list: async (req, res) => {
      const query = Model.find().sort(options.sort || { createdAt: -1 });

      if (options.populate) {
        options.populate.forEach((field) => query.populate(field));
      }

      const items = await query;

      return res.json({
        status: 'success',
        count: items.length,
        items,
      });
    },

    create: async (req, res) => {
      const parsed = schema.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid admin data',
          errors: zodMessages(parsed.error),
        });
      }

      const payload = options.normalize ? options.normalize(parsed.data) : parsed.data;
      const item = await Model.create(payload);

      if (options.populate) {
        await item.populate(options.populate);
      }

      return res.status(201).json({
        status: 'success',
        item,
      });
    },
  };
}

const teams = createResourceController(Team, teamSchema, {
  sort: { name: 1 },
  normalize: (data) => ({
    ...data,
    shortName: data.shortName.toUpperCase(),
    recentForm: data.recentForm || [],
  }),
});

const players = createResourceController(Player, playerSchema, {
  sort: { handle: 1 },
  populate: ['team'],
  normalize: (data) => ({
    ...data,
    team: data.team || null,
  }),
});

const tournaments = createResourceController(Tournament, tournamentSchema, {
  sort: { startDate: -1 },
});

const maps = createResourceController(ValorantMap, mapSchema, {
  sort: { name: 1 },
});

const agents = createResourceController(Agent, agentSchema, {
  sort: { name: 1 },
});

const matches = createResourceController(Match, matchSchema, {
  sort: { startsAt: 1 },
  populate: ['tournament', 'teamA', 'teamB', 'winner'],
});

async function completeMatch(req, res) {
  const parsed = matchResultSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid match result',
      errors: zodMessages(parsed.error),
    });
  }

  const match = await Match.findById(req.params.id);

  if (!match) {
    return res.status(404).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  const teamIds = [match.teamA.toString(), match.teamB.toString()];

  if (
    !teamIds.includes(parsed.data.winner) ||
    !teamIds.includes(parsed.data.firstMapWinner)
  ) {
    return res.status(400).json({
      status: 'error',
      message: 'Result teams must belong to this match',
    });
  }

  match.status = 'completed';
  match.winner = parsed.data.winner;
  match.score = parsed.data.score;
  match.resultDetails = {
    scoreline: parsed.data.scoreline,
    firstMapWinner: parsed.data.firstMapWinner,
    topFragger: parsed.data.topFragger || '',
  };
  await match.save();

  let scoring = { scored: 0, queued: true };
  let queued = false;
  const io = req.app.get('io');

  try {
    queued = await publishMatchCompleted({
      matchId: match._id.toString(),
      completedAt: new Date().toISOString(),
    });
    scoring = { scored: 0, queued: true };
  } catch (error) {
    console.warn(`RabbitMQ unavailable, scoring inline: ${error.message}`);
    scoring = await scoreMatchPredictions(match);

    if (io) {
      io.emit('match:completed', { matchId: match._id.toString(), scoring });
      io.emit('leaderboard:updated', { matchId: match._id.toString() });
    }
  }

  await match.populate(['tournament', 'teamA', 'teamB', 'winner']);

  return res.json({
    status: 'success',
    message: queued
      ? 'Match completed and queued for RabbitMQ scoring'
      : 'Match completed and predictions scored',
    scoring,
    item: match,
  });
}

module.exports = {
  teams,
  players,
  tournaments,
  maps,
  agents,
  matches,
  completeMatch,
};
