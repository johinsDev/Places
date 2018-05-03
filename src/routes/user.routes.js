import { Router } from 'express';

import * as UserController from '../controllers/user.controller';
import { authJwt } from '../services/auth';

const routes = new Router();

routes.get(
  '/:user_id/places',
  authJwt,
  UserController.policyPlace,
  UserController.places
);

routes.post(
  '/signup',
  UserController.create
);

routes.post(
  '/signin',
  UserController.login
);

export default routes;
