import HTTPStatus from 'http-status';
import APIError from '../services/error';

import User from '../models/user.model';

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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username: email }]});

    if (!user) {
      return next(new APIError('This email or username is not registered.', HTTPStatus.UNAUTHORIZED, true));
    } else if (!user.authenticateUser(password)) {
      return next(new APIError('Password not valid.', HTTPStatus.UNAUTHORIZED, true));
    }

    res.status(HTTPStatus.OK).json(user.toAuthJSON());
  } catch(e) {
    e.status = HTTPStatus.BAD_REQUEST;
    return next(e);
  }
}

