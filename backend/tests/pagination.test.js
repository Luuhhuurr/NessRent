const test = require('node:test');
const assert = require('node:assert/strict');

const { parsePagination, DEFAULT_LIMIT, MAX_LIMIT } = require('../utils/pagination');

test('parsePagination defaults to the first page with the default limit', () => {
  assert.deepEqual(parsePagination(), { page: 1, limit: DEFAULT_LIMIT, offset: 0 });
  assert.deepEqual(parsePagination({}), { page: 1, limit: DEFAULT_LIMIT, offset: 0 });
});

test('parsePagination computes the offset from page and limit', () => {
  assert.deepEqual(parsePagination({ page: '3', limit: '20' }), {
    page: 3,
    limit: 20,
    offset: 40,
  });
});

test('parsePagination clamps a page below one', () => {
  assert.equal(parsePagination({ page: '0' }).page, 1);
  assert.equal(parsePagination({ page: '-5' }).page, 1);
  assert.equal(parsePagination({ page: 'abc' }).page, 1);
});

test('parsePagination clamps the limit into the 1..100 range', () => {
  assert.equal(parsePagination({ limit: '0' }).limit, 1);
  assert.equal(parsePagination({ limit: '-10' }).limit, 1);
  assert.equal(parsePagination({ limit: '1000000' }).limit, MAX_LIMIT);
  assert.equal(parsePagination({ limit: 'not-a-number' }).limit, DEFAULT_LIMIT);
});
