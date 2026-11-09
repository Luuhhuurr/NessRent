const test = require('node:test');
const assert = require('node:assert/strict');

const { requireRole } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../utils/response');

const runMiddleware = (middleware, req) => {
  let forwarded = null;
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  middleware(req, res, (err) => {
    forwarded = err;
  });
  return { forwarded, res };
};

test('requireRole lets an admin through', () => {
  const { forwarded, res } = runMiddleware(requireRole('admin'), {
    user: { id: 1, role: 'admin' },
  });

  assert.ok(!forwarded);
  assert.equal(res.statusCode, null);
});

test('requireRole rejects a signed-in user without the role', () => {
  const { forwarded } = runMiddleware(requireRole('admin'), {
    user: { id: 2, role: 'user' },
  });

  assert.ok(forwarded);
  assert.equal(forwarded.statusCode, 403);
});

test('requireRole rejects an anonymous request with 401', () => {
  const { forwarded } = runMiddleware(requireRole('admin'), {});

  assert.ok(forwarded);
  assert.equal(forwarded.statusCode, 401);
});

test('sendSuccess wraps the payload in the standard envelope', () => {
  const { res } = runMiddleware((req, r) => sendSuccess(r, { message: 'ok', data: { id: 1 } }), {});

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { success: true, message: 'ok', data: { id: 1 } });
});

test('sendError omits the errors field when there is none', () => {
  const { res } = runMiddleware(
    (req, r) => sendError(r, { message: 'Gagal', status: 400 }),
    {}
  );

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, { success: false, message: 'Gagal' });
});

test('sendError includes the field errors when they are given', () => {
  const { res } = runMiddleware(
    (req, r) => sendError(r, { message: 'Gagal', status: 422, errors: { email: 'tidak valid' } }),
    {}
  );

  assert.deepEqual(res.body.errors, { email: 'tidak valid' });
});
