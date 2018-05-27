/**
 * Place Routes
 */

import { Router } from 'express';

import * as PlaceController from '../controllers/place.controller';
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
  PlaceController.find,
  PlaceController.show
);

routes.put(
  '/:id',
  authJwt,
  PlaceController.find,
  PlaceController.policyPlace,
  PlaceController.update
);

routes.delete('/:id',
  authJwt,
  PlaceController.find,
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
