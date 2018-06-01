/**
 * Comment Routes
 */

import { Router } from 'express';

import * as CommentController from '../controllers/comment.controller';
import * as  Middlewares from '../middlewares/Find';

const routes = new Router();

/**
 * CRUD
 */

routes.post(
  '/:model/:id',
  Middlewares.find(),
  CommentController.create
);

export default routes;
