import Favorite from '../models/favorite.model';
import HTTPStatus from 'http-status';
import capitalize from '../utils/capitalize';

export async function create(req, res, next) {
  try {
    const { model } = req.params;
    await req.user.toggleFavorite(req[model]);

    return res.sendStatus(HTTPStatus.OK);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
