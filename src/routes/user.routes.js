import { Router } from 'express';

import * as UserController from '../controllers/user.controller';
import { authJwt } from '../services/auth';

const routes = new Router();

routes.post(
  '/signup',
  UserController.create
);

routes.post(
  '/signin',
  UserController.login
);

export default routes;
