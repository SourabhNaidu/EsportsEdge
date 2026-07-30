const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('returns API and database health information', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('EsportsEdge API');
    expect(response.body.database).toHaveProperty('state');
    expect(response.body.database).toHaveProperty('connected');
  });
});

