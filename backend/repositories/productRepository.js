const { pool } = require('../config/database');

// `condition` is a reserved word in MySQL, so it always needs backticks.
const PRODUCT_COLUMNS = `
  id, owner_id, product_name, category, \`condition\`, price,
  description, image_url, status, created_at
`;

const findAll = async ({ category, search, ownerId, limit, offset }) => {
  const conditions = [];
  const params = [];

  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }

  if (search) {
    conditions.push('(product_name LIKE ? OR description LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  if (ownerId !== undefined && ownerId !== null) {
    conditions.push('owner_id = ?');
    params.push(ownerId);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) as total FROM products ${where}`,
    params
  );

  return { rows, total };
};

const findById = async (id) => {
  const [rows] = await pool.query(`SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = ?`, [id]);
  return rows[0] || null;
};

const create = async ({ ownerId, productName, category, condition, price, description, imageUrl }) => {
  const [result] = await pool.query(
    `INSERT INTO products (owner_id, product_name, category, \`condition\`, price, description, image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [ownerId, productName, category || null, condition || 'Baik', price, description || null, imageUrl || null]
  );
  return result.insertId;
};

const update = async (id, fields) => {
  const columns = {
    product_name: 'product_name',
    category: 'category',
    condition: '`condition`',
    price: 'price',
    description: 'description',
    image_url: 'image_url',
    status: 'status',
  };

  const updates = [];
  const values = [];

  for (const [key, column] of Object.entries(columns)) {
    if (fields[key] !== undefined) {
      updates.push(`${column} = ?`);
      values.push(fields[key]);
    }
  }

  if (updates.length === 0) return;

  values.push(id);
  await pool.query(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, values);
};

const remove = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

const countAll = async () => {
  const [[row]] = await pool.query('SELECT COUNT(*) as count FROM products');
  return row.count;
};

const countByCategory = async () => {
  const [rows] = await pool.query(
    'SELECT category, COUNT(*) as count FROM products GROUP BY category ORDER BY count DESC'
  );
  return rows;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  countAll,
  countByCategory,
};
