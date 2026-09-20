import * as db from '../db/queries.js';
import { body, validationResult, matchedData } from 'express-validator';

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

const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 1, max: 100 })
    .withMessage('Name must be between 1 and 100 characters.')
    .custom(async (name) => {
      const existing = await db.selectCategoryByName(name);
      if (existing) {
        throw new Error('A category with this name already exists.');
      }
    }),
  body('description').optional({ values: 'falsy' }).trim(),
];

export const categoryCreatePost = [
  validateCategory,
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      return res.status(400).render('category-form', {
        category: req.body,
        errors: validationErrors.array(),
      });
    }

    const { name, description } = matchedData(req);

    /* 
    Backup check: the custom async validator above already checks for a duplicate name,
    but there's a small window between that check and this insert where another request could sneak in the same name first.
    The sql UNIQUE constraint on categories.name guarantees no duplicate ever get thru, even if that race condition happens.
    */
    try {
      await db.insertCategory(name, description);
      res.redirect('/categories');
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).render('category-form', {
          category: req.body,
          errors: [{ msg: 'A category with this name already exists.' }],
        });
      }
    }
  },
];

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
