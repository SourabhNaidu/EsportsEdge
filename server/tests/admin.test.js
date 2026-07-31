const request = require('supertest');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('admin routes', () => {
  it('requires authentication before admin data can be managed', async () => {
    const response = await request(app).get('/api/admin/teams');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token is required');
  });

  it('requires authentication before completing a match result', async () => {
    const response = await request(app).post('/api/admin/matches/507f1f77bcf86cd799439011/result');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token is required');
  });
});
