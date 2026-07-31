const demoMatches = [
  {
    _id: 'demo-prx-fnc',
    tournament: {
      _id: 'demo-vct',
      name: 'Valorant Champions Tour',
      region: 'Global',
      status: 'live',
    },
    teamA: {
      _id: 'demo-prx',
      name: 'Paper Rex',
      shortName: 'PRX',
      region: 'Pacific',
      recentForm: ['W', 'W', 'L', 'W', 'W'],
    },
    teamB: {
      _id: 'demo-fnc',
      name: 'Fnatic',
      shortName: 'FNC',
      region: 'EMEA',
      recentForm: ['W', 'L', 'W', 'W', 'L'],
    },
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
    bestOf: 3,
    status: 'upcoming',
    score: { teamA: 0, teamB: 0 },
    insight:
      'PRX lead on early-round conversion, but Fnatic hold the stronger map veto.',
    predictionPercentages: { teamA: 54, teamB: 46 },
  },
  {
    _id: 'demo-sen-gen',
    tournament: {
      _id: 'demo-challengers',
      name: 'Challengers League',
      region: 'Americas',
      status: 'upcoming',
    },
    teamA: {
      _id: 'demo-sen',
      name: 'Sentinels',
      shortName: 'SEN',
      region: 'Americas',
      recentForm: ['L', 'W', 'W', 'L', 'W'],
    },
    teamB: {
      _id: 'demo-gen',
      name: 'Gen.G',
      shortName: 'GEN',
      region: 'Pacific',
      recentForm: ['W', 'W', 'W', 'L', 'W'],
    },
    startsAt: new Date(Date.now() + 1000 * 60 * 60 * 28).toISOString(),
    bestOf: 3,
    status: 'upcoming',
    score: { teamA: 0, teamB: 0 },
    insight:
      'Gen.G edge ahead through defensive pistol rate and recent Haven form.',
    predictionPercentages: { teamA: 49, teamB: 51 },
  },
];

module.exports = demoMatches;

