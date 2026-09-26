import * as db from '../db/queries.js';
import { body, validationResult, matchedData } from 'express-validator';

export async function supplierList(req, res) {
  const suppliers = await db.selectAllSuppliers();
  res.render('supplier-list', { suppliers });
}

export async function supplierDetail(req, res) {
  const { supplier, products } = await db.selectSupplierAndProducts(
    req.params.id,
  );

  if (!supplier) {
    return res.status(404).render('404');
  }

  res.render('supplier-detail', { supplier, products });
}

export function supplierCreateGet(req, res) {
  res.render('supplier-form', { supplier: null });
}

const validateSupplier = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 1, max: 150 })
    .withMessage('Name must be between 1 and 150 characters.'),
  body('email')
    .optional({ values: 'falsy' })
    .trim()
    .isEmail()
    .withMessage('Must be a valid email.')
    .isLength({ max: 150 })
    .withMessage('Email cannot exceed characters.'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters.'),
  body('address')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address cannot exceed 255 characters.'),
  body('delivery_time_days')
    .optional({ values: 'falsy' })
    .isInt({ min: 0 })
    .withMessage('Delivery time must be an integer greater than or equal to 0'),
];

export const supplierCreatePost = [
  validateSupplier,

  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).render('supplier-form', {
        supplier: req.body,
        errors: validationErrors.array(),
      });
    }

    const { name, email, phone, address, delivery_time_days } =
      matchedData(req);

    await db.insertSupplier(name, email, phone, address, delivery_time_days);

    res.redirect('/suppliers');
  },
];
