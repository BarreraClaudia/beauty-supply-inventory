import { Router } from 'express';
import * as supplierController from '../controllers/supplierController.js';

const supplierRouter = Router();

supplierRouter.get('/', supplierController.supplierList);

export default supplierRouter;
