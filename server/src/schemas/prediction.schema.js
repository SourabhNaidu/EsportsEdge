const { z } = require('zod');

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Expected a valid MongoDB ObjectId');

const predictionSchema = z.object({
  match: objectId,
  winner: objectId,
  scoreline: z.enum(['1-0', '2-0', '2-1', '3-0', '3-1', '3-2']),
  topFragger: z.string().trim().max(40).optional(),
  firstMapWinner: objectId,
});

module.exports = {
  predictionSchema,
};

