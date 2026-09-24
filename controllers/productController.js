import * as db from '../db/queries.js';
import { body, validationResult, matchedData } from 'express-validator';

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

async function getFormOptions() {
  const categories = await db.selectAllCategories();
  const suppliers = await db.selectAllSuppliers();
  return { categories, suppliers };
}

export async function productCreateGet(req, res) {
  const options = await getFormOptions();
  res.render('product-form', { product: null, ...options });
}

const validateProduct = [
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required.')
    .isLength({ min: 1, max: 30 })
    .withMessage('SKU must be between 1 and 30 characters.')
    .custom(async (sku, { req }) => {
      const existing = await db.selectProductBySKU(sku);
      if (existing && existing.product_id !== Number(req.params.id)) {
        throw new Error('A product with this SKU already exists.');
      }
    }),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 1, max: 150 })
    .withMessage('Name must be between 1 and 150 characters.'),
  body('description').optional({ values: 'falsy' }).trim(),
  body('category_id')
    .notEmpty()
    .withMessage('Category ID is required.')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a valid selection'),
  body('supplier_id')
    .notEmpty()
    .withMessage('Supplier ID is required.')
    .isInt({ min: 1 })
    .withMessage('Supplier ID must be a valid selection'),
  body('price')
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ min: 0.0, max: 99999999.99 })
    .withMessage('Price must be a positive number with up to 2 decimal places'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required.')
    .isInt({ min: 0 })
    .withMessage('Quantity must be an integer greater than or equal to 0.'),
  body('reorder_level')
    .notEmpty()
    .withMessage('Reorder level is required.')
    .isInt({ min: 0 })
    .withMessage(
      'Reorder level must be an integer greater than or equal to 0.',
    ),
];

export const productCreatePost = [
  validateProduct,
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const options = await getFormOptions();

      return res.status(400).render('product-form', {
        product: req.body,
        errors: validationErrors.array(),
        ...options,
      });
    }

    const {
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
      reorder_level,
    } = matchedData(req);

    /* 
      Backup check: the custom async validator above already checks for a duplicate sku,
      but there's a small window between that check and this insert where another request could sneak in the same sku first.
      The sql UNIQUE constraint on products.sku guarantees no duplicate ever get thru, even if that race condition happens.
    */
    try {
      await db.insertProduct(
        sku,
        name,
        description,
        category_id,
        supplier_id,
        price,
        quantity,
        reorder_level,
      );
      res.redirect('/products');
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).render('product-form', {
          product: req.body,
          errors: [{ msg: 'A product with this SKU already exists.' }],
          ...options,
        });
      }
      throw error;
    }
  },
];

export async function productUpdateGet(req, res) {
  const product = await db.selectProduct(req.params.id);
  const options = await getFormOptions();

  if (!product) {
    return res.status(404).render('404');
  }

  res.render('product-form', { product, ...options });
}

export const productUpdatePost = [
  validateProduct,
  async (req, res) => {
    const validationErrors = validationResult(req);
    const { id } = req.params;

    if (!validationErrors.isEmpty()) {
      const options = await getFormOptions();
      return res.status(400).render('product-form', {
        product: { ...req.body, product_id: id },
        errors: validationErrors.array(),
        ...options,
      });
    }

    const {
      sku,
      name,
      description,
      category_id,
      supplier_id,
      price,
      quantity,
      reorder_level,
    } = matchedData(req);

    // Back up check for sku (explained above in productCreatePost)
    try {
      await db.updateProduct(
        sku,
        name,
        description,
        category_id,
        supplier_id,
        price,
        quantity,
        reorder_level,
        id,
      );

      res.redirect(`/products/${id}`);
    } catch (error) {
      if (error.code === '23505') {
        const options = await getFormOptions();
        return res.status(400).render('product-form', {
          product: { ...req.body, product_id: id },
          errors: [{ msg: 'A product with this SKU already exists.' }],
          ...options,
        });
      }

      throw error;
    }
  },
];

// productDeleteGet — GET a delete confirmation page
// productDeletePost — POST handler to actually delete
