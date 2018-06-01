import Comment from '../models/comment.model';
import APIError from '../services/error';
import HTTPStatus from 'http-status';

export async function create(req, res, next) {
  try {
    const { model } = req.params;
    await req.user.addComment(req[model], req.body);

    return res.sendStatus(HTTPStatus.OK);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
