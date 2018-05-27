import Favorite from '../models/favorite.model';
import capitalize from '../utils/capitalize';
import APIError from '../services/error';
import HTTPStatus from 'http-status';

export async function find(req, res, next) {
  try {
    const { model, id } = req.params;

    const Schema = require('../models/' + model + '.model');

    req[model] = await Schema.default.findByIdOrSlug(id);

    if (!req[model]) next(new APIError(`Not Found ${model.toUpperCase()}!`, HTTPStatus.NOT_FOUND, true));

    next();
  } catch (err) {
    return next(err);
  }
}

// CONTROLLER FUNCTIONS

export async function create(req, res, next) {
  try {
    // await req.user.toggleFavorite(req.place);

    return res.json(await req.place.favoritesCount());
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
