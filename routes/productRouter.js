import { Router } from 'express';
import * as productController from '../controllers/productController.js';

const productRouter = Router();

productRouter.get('/', productController.productList);

productRouter.get('/create', productController.productCreateGet);
productRouter.post('/create', productController.productCreatePost);

productRouter.param('id', (req, res, next, id) => {
  // checks if req param is NOT a positive integer
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(404).render('404');
  }
  next();
});

productRouter.get('/:id', productController.productDetail);

productRouter.get('/:id/update', productController.productUpdateGet);
productRouter.post('/:id/update', productController.productUpdatePost);

productRouter.get('/:id/delete', productController.productDeleteGet);
productRouter.post('/:id/delete', productController.productDeletePost);

export default productRouter;
