const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

/**
 * Reads `page` / `limit` from a query string and clamps them into a safe
 * range. Without the clamp a client could ask for limit=1000000, which turns
 * a single request into a full table scan.
 */
const parsePagination = (query = {}) => {
  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  return { page, limit, offset: (page - 1) * limit };
};

module.exports = { parsePagination, DEFAULT_LIMIT, MAX_LIMIT };
