/**
 * Place Routes
 */

import { Router } from 'express';

import * as PlaceController from '../controllers/place.controller';
import * as  Middlewares from '../middlewares/Find';
import { authJwt } from '../services/auth';

const routes = new Router();

/**
 * CRUD
 */

routes.get('/',
  authJwt,
  PlaceController.index
);

routes.get('/:id',
  authJwt,
  Middlewares.find('place'),
  PlaceController.show
);

routes.put(
  '/:id',
  authJwt,
  Middlewares.find('place'),
  PlaceController.policyPlace,
  PlaceController.update
);

routes.delete('/:id',
  authJwt,
  Middlewares.find('place'),
  PlaceController.policyPlace,
  PlaceController.destroy
);

routes.post(
  '/',
  authJwt,
  PlaceController.uploadImage(),
  PlaceController.create,
);

export default routes;
