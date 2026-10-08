import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';
import { generateToken } from '../src/utils/jwt.js';

let server;
let baseUrl;

test.before(async () => {
  return new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
});

test('GET /api/health returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
  assert.equal(data.message, 'API is running');
});

test('POST /api/auth/register fails with 400 on invalid input', async () => {
  const res = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: '',
      email: 'not-an-email',
      password: '123',
    }),
  });
  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
});

test('Protected routes reject requests with missing token (401)', async () => {
  const res = await fetch(`${baseUrl}/api/projects`);
  const data = await res.json();
  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test('Protected routes reject requests with invalid token (401)', async () => {
  const res = await fetch(`${baseUrl}/api/projects`, {
    headers: {
      Authorization: 'Bearer invalid.fake.token',
    },
  });
  const data = await res.json();
  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test('Project validation rejects endDate earlier than startDate (400)', async () => {
  const mockToken = generateToken({ userId: 'test-user-uuid', email: 'test@example.com' });

  const res = await fetch(`${baseUrl}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mockToken}`,
    },
    body: JSON.stringify({
      name: 'Invalid Date Project',
      startDate: '2026-10-20',
      endDate: '2026-10-10', // earlier!
    }),
  });

  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
  assert.match(data.message, /earlier than start date/i);
});

test('Task validation rejects missing projectId and invalid enum (400)', async () => {
  const mockToken = generateToken({ userId: 'test-user-uuid', email: 'test@example.com' });

  const res = await fetch(`${baseUrl}/api/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${mockToken}`,
    },
    body: JSON.stringify({
      name: 'Task Without Project',
      priority: 'SUPER_URGENT', // invalid enum
      dueDate: '2026-10-25',
    }),
  });

  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
});
