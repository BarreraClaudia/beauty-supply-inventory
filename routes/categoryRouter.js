import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryList);

categoryRouter.get('/create', categoryController.categoryCreateGet);
categoryRouter.post('/create', categoryController.categoryCreatePost);

categoryRouter.param('id', (req, res, next, id) => {
  // checks if req param is NOT a positive integer
  if (!/^\d+$/.test(id)) {
    return res.status(404).render('404');
  }
  next();
});

categoryRouter.get('/:id', categoryController.categoryProducts);

categoryRouter.get('/:id/update', categoryController.categoryUpdateGet);
categoryRouter.post('/:id/update', categoryController.categoryUpdatePost);

categoryRouter.get('/:id/delete', categoryController.categoryDeleteGet);
categoryRouter.post('/:id/delete', categoryController.categoryDeletePost);

export default categoryRouter;
