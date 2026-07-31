require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Agent = require('../models/Agent');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const User = require('../models/User');
const ValorantMap = require('../models/ValorantMap');

const seedPassword = 'Valorant123!';

const teams = [
  { name: 'Paper Rex', shortName: 'PRX', region: 'Pacific', recentForm: ['W', 'W', 'L', 'W', 'W'] },
  { name: 'Fnatic', shortName: 'FNC', region: 'EMEA', recentForm: ['W', 'L', 'W', 'W', 'L'] },
  { name: 'Sentinels', shortName: 'SEN', region: 'Americas', recentForm: ['L', 'W', 'W', 'L', 'W'] },
  { name: 'Gen.G', shortName: 'GENG', region: 'Pacific', recentForm: ['W', 'W', 'W', 'L', 'W'] },
  { name: 'Edward Gaming', shortName: 'EDG', region: 'China', recentForm: ['W', 'L', 'W', 'W', 'W'] },
  { name: 'G2 Esports', shortName: 'G2', region: 'Americas', recentForm: ['W', 'W', 'L', 'W', 'L'] },
  { name: 'NRG', shortName: 'NRG', region: 'Americas', recentForm: ['L', 'W', 'W', 'W', 'W'] },
  { name: 'DRX', shortName: 'DRX', region: 'Pacific', recentForm: ['W', 'L', 'L', 'W', 'W'] },
];

const tournaments = [
  {
    name: 'VCT Champions 2026',
    region: 'Global',
    startDate: new Date('2026-08-02T12:00:00.000Z'),
    endDate: new Date('2026-08-23T18:00:00.000Z'),
    status: 'upcoming',
  },
  {
    name: 'VCT Americas Stage 2',
    region: 'Americas',
    startDate: new Date('2026-08-04T12:00:00.000Z'),
    endDate: new Date('2026-08-18T18:00:00.000Z'),
    status: 'upcoming',
  },
  {
    name: 'VCT Pacific Stage 2',
    region: 'Pacific',
    startDate: new Date('2026-08-05T12:00:00.000Z'),
    endDate: new Date('2026-08-19T18:00:00.000Z'),
    status: 'upcoming',
  },
];

const agents = [
  ['Jett', 'duelist'],
  ['Raze', 'duelist'],
  ['Neon', 'duelist'],
  ['Sova', 'initiator'],
  ['Fade', 'initiator'],
  ['KAY/O', 'initiator'],
  ['Omen', 'controller'],
  ['Viper', 'controller'],
  ['Astra', 'controller'],
  ['Killjoy', 'sentinel'],
  ['Cypher', 'sentinel'],
  ['Chamber', 'sentinel'],
];

const maps = [
  ['Ascent', true],
  ['Bind', true],
  ['Haven', true],
  ['Lotus', true],
  ['Split', true],
  ['Sunset', true],
  ['Icebox', true],
  ['Pearl', false],
  ['Fracture', false],
];

const players = [
  ['something', 'duelist', 'Paper Rex', 1.18],
  ['Jinggg', 'duelist', 'Paper Rex', 1.12],
  ['Boaster', 'igl', 'Fnatic', 1.01],
  ['Alfajer', 'sentinel', 'Fnatic', 1.16],
  ['zekken', 'duelist', 'Sentinels', 1.14],
  ['johnqt', 'igl', 'Sentinels', 1.04],
  ['t3xture', 'duelist', 'Gen.G', 1.17],
  ['Munchkin', 'igl', 'Gen.G', 1.05],
  ['ZmjjKK', 'duelist', 'Edward Gaming', 1.19],
  ['valyn', 'igl', 'G2 Esports', 1.07],
  ['crashies', 'initiator', 'NRG', 1.08],
  ['MaKo', 'controller', 'DRX', 1.13],
];

const leaderboardUsers = [
  ['vandalVision', 'vandal@example.com', 1240, 68, 5],
  ['clutchIndex', 'clutch@example.com', 1090, 64, 4],
  ['ecoHunter', 'eco@example.com', 980, 61, 3],
  ['spikeRead', 'spike@example.com', 925, 59, 2],
  ['sovaMain', 'sova@example.com', 810, 56, 1],
];

const matches = [
  ['VCT Champions 2026', 'Paper Rex', 'Fnatic', '2026-08-02T14:30:00.000Z', 3],
  ['VCT Champions 2026', 'Sentinels', 'Gen.G', '2026-08-03T16:00:00.000Z', 3],
  ['VCT Champions 2026', 'Edward Gaming', 'G2 Esports', '2026-08-04T13:00:00.000Z', 3],
  ['VCT Champions 2026', 'NRG', 'DRX', '2026-08-05T15:30:00.000Z', 3],
  ['VCT Americas Stage 2', 'Sentinels', 'G2 Esports', '2026-08-06T20:00:00.000Z', 3],
  ['VCT Pacific Stage 2', 'Paper Rex', 'Gen.G', '2026-08-07T11:00:00.000Z', 5],
];

async function upsertByName(Model, items) {
  const saved = {};

  for (const item of items) {
    const document = await Model.findOneAndUpdate(
      { name: item.name },
      { $set: item },
      { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
    );
    saved[item.name] = document;
  }

  return saved;
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing. Check your local .env file.');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const teamDocs = await upsertByName(Team, teams);
  const tournamentDocs = await upsertByName(Tournament, tournaments);

  for (const [name, role] of agents) {
    await Agent.findOneAndUpdate(
      { name },
      { $set: { name, role } },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  for (const [name, activePool] of maps) {
    await ValorantMap.findOneAndUpdate(
      { name },
      { $set: { name, activePool } },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  for (const [handle, role, teamName, rating] of players) {
    await Player.findOneAndUpdate(
      { handle },
      {
        $set: {
          handle,
          role,
          rating,
          team: teamDocs[teamName]._id,
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  const passwordHash = await bcrypt.hash(seedPassword, 10);
  for (const [username, email, totalPoints, accuracy, streak] of leaderboardUsers) {
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          username,
          email,
          passwordHash,
          role: 'user',
          predictionStats: { totalPoints, accuracy, streak },
        },
      },
      { upsert: true, setDefaultsOnInsert: true },
    );
  }

  await Match.deleteMany({
    tournament: { $in: Object.values(tournamentDocs).map((item) => item._id) },
  });

  for (const [tournamentName, teamAName, teamBName, startsAt, bestOf] of matches) {
    await Match.create({
      tournament: tournamentDocs[tournamentName]._id,
      teamA: teamDocs[teamAName]._id,
      teamB: teamDocs[teamBName]._id,
      startsAt: new Date(startsAt),
      bestOf,
      status: 'upcoming',
    });
  }

  await mongoose.disconnect();

  console.log('Seeded EsportsEdge database.');
  console.log(`Demo user password: ${seedPassword}`);
  console.log('Admin invite code from .env can create an admin account.');
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
