import * as db from '../db/queries.js';

export async function categoryList(req, res) {
  const categories = await db.selectAllCategories();
  res.render('category-list', { categories });
}

export async function categoryProducts(req, res) {
  const { category, products } = await db.selectCategoryAndProducts(
    req.params.id,
  );

  if (!category) {
    return res.status(404).render('404');
  }

  res.render('category-products', { category, products });
}

export function categoryCreateGet(req, res) {
  res.render('category-form', { category: null });
}

export async function categoryCreatePost(req, res) {
  // TODO: data validation

  const { name, description } = req.body;
  await db.insertCategory(name, description);
  res.redirect('/categories');
}

export async function categoryUpdateGet(req, res) {
  const category = await db.selectCategory(req.params.id);

  if (!category) {
    return res.status(404).render('404');
  }

  res.render('category-form', { category });
}

export async function categoryUpdatePost(req, res) {
  const { name, description } = req.body;
  const { id } = req.params;
  await db.updateCategory(name, description, id);
  res.redirect('/categories');
}

export async function categoryDeleteGet(req, res) {
  const { category, products } = await db.selectCategoryAndProducts(
    req.params.id,
  );

  if (!category) {
    return res.status(404).render('404');
  }

  res.render('category-delete', { category, products });
}

export async function categoryDeletePost(req, res) {
  try {
    await db.deleteCategory(req.params.id);
    res.redirect('/categories');
  } catch (error) {
    res
      .status(400)
      .send('Cannot delete category if it still has products in it.');
  }
}
