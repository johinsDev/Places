import APIError from '../services/error';
import HTTPStatus from 'http-status';

export function find(specificModel) {
  return async function(req, res, next) {
    try { 
      const { id } = req.params;

      let { model } = req.params;

      model = model || specificModel;

      const Schema = require('../models/' + model + '.model');

      req[model] =
        Schema.default.findByIdOrSlug ?
        await Schema.default.findByIdOrSlug(id) :
        await Schema.default.findById(id);

      if (!req[model]) next(new APIError(`Not Found ${model.toUpperCase()}!`, HTTPStatus.NOT_FOUND, true));

      next();
    } catch (err) {
      return next(err);
    }
  }
}
