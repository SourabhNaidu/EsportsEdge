const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Expected a valid MongoDB ObjectId');

const teamSchema = z.object({
  name: z.string().trim().min(2),
  region: z.string().trim().min(2),
  shortName: z.string().trim().min(2).max(6),
  logoUrl: z.string().trim().url().optional().or(z.literal('')),
  recentForm: z.array(z.enum(['W', 'L'])).max(10).optional(),
});

const playerSchema = z.object({
  handle: z.string().trim().min(2),
  realName: z.string().trim().optional(),
  role: z.enum(['duelist', 'initiator', 'controller', 'sentinel', 'flex', 'igl']).optional(),
  team: objectId.optional().or(z.literal('')),
  rating: z.coerce.number().min(0).max(2).optional(),
});

const tournamentSchema = z.object({
  name: z.string().trim().min(2),
  region: z.string().trim().min(2),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(['upcoming', 'live', 'completed']).optional(),
});

const mapSchema = z.object({
  name: z.string().trim().min(2),
  activePool: z.coerce.boolean().optional(),
});

const agentSchema = z.object({
  name: z.string().trim().min(2),
  role: z.enum(['duelist', 'initiator', 'controller', 'sentinel']),
});

const matchSchema = z.object({
  tournament: objectId,
  teamA: objectId,
  teamB: objectId,
  startsAt: z.coerce.date(),
  bestOf: z.coerce.number().pipe(z.union([z.literal(1), z.literal(3), z.literal(5)])).optional(),
  status: z.enum(['upcoming', 'live', 'completed']).optional(),
});

const matchResultSchema = z.object({
  winner: objectId,
  score: z.object({
    teamA: z.coerce.number().min(0),
    teamB: z.coerce.number().min(0),
  }),
  scoreline: z.enum(['1-0', '2-0', '2-1', '3-0', '3-1', '3-2']),
  firstMapWinner: objectId,
  topFragger: z.string().trim().max(40).optional(),
});

module.exports = {
  teamSchema,
  playerSchema,
  tournamentSchema,
  mapSchema,
  agentSchema,
  matchSchema,
  matchResultSchema,
};
