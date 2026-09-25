import { Router } from 'express';
import * as supplierController from '../controllers/supplierController.js';

const supplierRouter = Router();

supplierRouter.get('/', supplierController.supplierList);

supplierRouter.param('id', (req, res, next, id) => {
  // checks if req param is NOT a positive integer
  if (!/^\d+$/.test(id)) {
    return res.status(404).render('404');
  }
  next();
});

supplierRouter.get('/:id', supplierController.supplierDetail);

export default supplierRouter;
