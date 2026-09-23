import { Router } from 'express';
import * as productController from '../controllers/productController.js';

const productRouter = Router();

productRouter.get('/', productController.productList);

productRouter.get('/create', productController.productCreateGet);
productRouter.post('/create', productController.productCreatePost);

productRouter.get('/:id', productController.productDetail);

export default productRouter;
