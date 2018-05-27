import passport from 'passport';
import HTTPStatus from 'http-status';
import APIError from '../services/error';

import User from '../models/user.model';
import Place from '../models/place.model';

export async function policyPlace(req, res, next) {
  try {
    if (req.params.user_id.toString() !== req.user._id.toString()) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    next();
  } catch (err) {
    return next(err);
  }
}

export async function create(req, res, next) {
  try {
    const user = await User.createUser(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

export async function login(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      return next(new APIError(info.message, HTTPStatus.UNAUTHORIZED, true));
    }

    res.status(HTTPStatus.OK).json(user.toAuthJSON());
  })(req, res, next)
}

export async function places(req, res, next) {
  try {
    const places = await req.user.places;
    res.status(HTTPStatus.OK).json(places);
  } catch(e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}
