/**
 * Place Routes
 */

import { Router } from 'express';

import * as PlaceController from '../controllers/place.controller';

const routes = new Router();

/**
 * CRUD
 */

routes.get('/', PlaceController.index);

routes.get('/:id',
  PlaceController.find,
  PlaceController.show
);

routes.patch(
  '/:id',
  PlaceController.find,
  PlaceController.update
);

routes.delete('/:id',
  PlaceController.find,
  PlaceController.destroy
);

routes.post(
  '/',
  PlaceController.create,
);

export default routes;
