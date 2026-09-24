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

export async function selectProductBySKU(sku) {
  const { rows } = await pool.query('SELECT * FROM products WHERE sku = $1', [
    sku,
  ]);
  return rows[0];
}

export async function insertProduct(
  sku,
  name,
  description,
  category_id,
  supplier_id,
  price,
  quantity,
  reorder_level,
) {
  await pool.query(
    'INSERT INTO products (sku, name, description, category_id, supplier_id, price, quantity, reorder_level) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
      reorder_level,
    ],
  );
}

export async function updateProduct(
  sku,
  name,
  description,
  category_id,
  supplier_id,
  price,
  quantity,
  reorder_level,
  id,
) {
  await pool.query(
    'UPDATE products SET sku = $1, name = $2, description = $3, category_id = $4, supplier_id = $5, price = $6, quantity = $7, reorder_level = $8 WHERE product_id = $9',
    [
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
      reorder_level,
      id,
    ],
  );
}

/*
-----------
SUPPLIERS
-----------
*/

export async function selectAllSuppliers() {
  const { rows } = await pool.query('SELECT * FROM suppliers');
  return rows;
}
