import { Router } from 'express';
import * as categoryController from '../controllers/categoryController.js';

const categoryRouter = Router();

categoryRouter.get('/', categoryController.categoryList);

categoryRouter.get('/create', categoryController.categoryCreateGet);
categoryRouter.post('/create', categoryController.categoryCreatePost);

categoryRouter.get('/:id', categoryController.categoryProducts);

categoryRouter.get('/:id/update', categoryController.categoryUpdateGet);
categoryRouter.post('/:id/update', categoryController.categoryUpdatePost);

categoryRouter.get('/:id/delete', categoryController.categoryDeleteGet);
categoryRouter.post('/:id/delete', categoryController.categoryDeletePost);

export default categoryRouter;
