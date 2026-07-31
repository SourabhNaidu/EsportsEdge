const request = require('supertest');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('admin routes', () => {
  it('requires authentication before admin data can be managed', async () => {
    const response = await request(app).get('/api/admin/teams');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token is required');
  });
});

