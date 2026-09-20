import * as db from '../db/queries.js';

export async function productList(req, res) {
  const products = await db.selectAllProducts();
  res.render('product-list', { products });
}

// productDetail — GET one product's full details
// productCreateGet — GET the "new product" form
// productCreatePost — POST handler to insert a new product
// productUpdateGet — GET the "edit product" form, pre-filled
// productUpdatePost — POST handler to update a product
// productDeleteGet — GET a delete confirmation page
// productDeletePost — POST handler to actually delete
