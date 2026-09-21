import pool from './pool.js';

/*
-----------
CATEGORIES
-----------
*/

export async function selectAllCategories() {
  const { rows } = await pool.query('SELECT * FROM categories');
  return rows;
}

export async function selectCategory(id) {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE category_id = $1',
    [id],
  );
  return rows[0];
}

export async function selectCategoryByName(name) {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE name = $1',
    [name],
  );
  return rows[0];
}

export async function selectCategoryAndProducts(id) {
  const categoryResult = await pool.query(
    'SELECT * FROM categories WHERE category_id = $1',
    [id],
  );

  const productsResult = await pool.query(
    'SELECT * FROM products WHERE category_id = $1',
    [id],
  );

  return {
    category: categoryResult.rows[0],
    products: productsResult.rows,
  };
}

export async function insertCategory(name, description) {
  await pool.query(
    'INSERT INTO categories (name, description) VALUES ($1, $2)',
    [name, description],
  );
}

export async function updateCategory(name, description, id) {
  await pool.query(
    'UPDATE categories SET name = $1, description = $2 WHERE category_id = $3',
    [name, description, id],
  );
}

export async function deleteCategory(id) {
  await pool.query('DELETE FROM categories WHERE category_id = $1', [id]);
}

/*
-----------
PRODUCTS
-----------
*/

export async function selectAllProducts() {
  const { rows } = await pool.query('SELECT * FROM products');
  return rows;
}

export async function selectProduct(id) {
  const { rows } = await pool.query(
    'SELECT * FROM products WHERE product_id = $1',
    [id],
  );
  return rows[0];
}
