import * as db from '../db/queries.js';

export async function supplierList(req, res) {
  const suppliers = await db.selectAllSuppliers();
  res.render('supplier-list', { suppliers });
}
