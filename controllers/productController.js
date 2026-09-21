import * as db from '../db/queries.js';

export async function productList(req, res) {
  const products = await db.selectAllProducts();
  res.render('product-list', { products });
}

export async function productDetail(req, res) {
  const product = await db.selectProduct(req.params.id);

  if (!product) {
    return res.status(404).render('404');
  }

  res.render('product-detail', { product });
}

// productCreateGet — GET the "new product" form
// productCreatePost — POST handler to insert a new product
// productUpdateGet — GET the "edit product" form, pre-filled
// productUpdatePost — POST handler to update a product
// productDeleteGet — GET a delete confirmation page
// productDeletePost — POST handler to actually delete
