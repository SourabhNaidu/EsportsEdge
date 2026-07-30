const request = require('supertest');
const app = require('../src/app');

process.env.JWT_SECRET = 'test-secret';

describe('auth validation', () => {
  it('rejects invalid registration input before touching the database', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'ab',
      email: 'not-an-email',
      password: 'short',
    });

    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.errors).toEqual(expect.any(Array));
  });

  it('protects the profile route when no token is provided', async () => {
    const response = await request(app).get('/api/auth/profile');

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Authentication token is required');
  });
});
