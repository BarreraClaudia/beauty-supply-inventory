import * as db from '../db/queries.js';

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
