const request = require('supertest');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('prediction routes', () => {
  it('requires login before creating a prediction', async () => {
    const response = await request(app).post('/api/predictions').send({});

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token is required');
  });

  it('returns demo matches when the database is offline', async () => {
    const response = await request(app).get('/api/matches');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.items.length).toBeGreaterThan(0);
  });
});
