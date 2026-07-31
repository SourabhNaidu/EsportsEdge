const { calculatePredictionPoints } = require('../src/services/scoring.service');
const { buildMatchAnalytics } = require('../src/controllers/analytics.controller');

describe('scoring service', () => {
  it('awards points for winner, scoreline, first map, and top fragger', () => {
    const teamA = '507f1f77bcf86cd799439011';
    const teamB = '507f1f77bcf86cd799439012';
    const prediction = {
      winner: { toString: () => teamA },
      scoreline: '2-1',
      firstMapWinner: { toString: () => teamB },
      topFragger: 'aspas',
    };
    const match = {
      winner: { toString: () => teamA },
      resultDetails: {
        scoreline: '2-1',
        firstMapWinner: { toString: () => teamB },
        topFragger: 'Aspas',
      },
    };

    expect(calculatePredictionPoints(prediction, match)).toBe(12);
  });

  it('does not award winner points for an incorrect winner', () => {
    const teamA = '507f1f77bcf86cd799439011';
    const teamB = '507f1f77bcf86cd799439012';
    const prediction = {
      winner: { toString: () => teamB },
      scoreline: '2-1',
      firstMapWinner: { toString: () => teamB },
      topFragger: 'aspas',
    };
    const match = {
      winner: { toString: () => teamA },
      resultDetails: {
        scoreline: '2-0',
        firstMapWinner: { toString: () => teamA },
        topFragger: 'something',
      },
    };

    expect(calculatePredictionPoints(prediction, match)).toBe(0);
  });
});

describe('match analytics', () => {
  it('builds rule-based momentum analytics from recent form', () => {
    const analytics = buildMatchAnalytics({
      teamA: {
        name: 'Paper Rex',
        recentForm: ['W', 'W', 'L', 'W'],
      },
      teamB: {
        name: 'Fnatic',
        recentForm: ['L', 'W', 'L', 'L'],
      },
    });

    expect(analytics.momentumScore).toBeGreaterThan(50);
    expect(analytics.explanation).toContain('Paper Rex');
  });
});
