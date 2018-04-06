import Place from '../models/place.model';
import APIError from '../services/error';
import HTTPStatus from 'http-status';

export async function find(req, res, next) {
  try {
    req.place = await Place.findById(req.params.id);

    if (!req.place) {
      next(new APIError('Not Found Place!', HTTPStatus.NOT_FOUND, true));
    }

    next();
  } catch (err) {
    return next(err);
  }
}

export async function create(req, res, next) {
  try {
    return res
      .status(HTTPStatus.CREATED)
      .json(await Place.create(req.body));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function index(req, res, next) {
  try {
    const { page } = req.query;
    res.status(HTTPStatus.OK).json(await Place.list({ page }));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    return res.status(HTTPStatus.OK).json(req.place);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const place = await req.place.update(req.body);
    return res.status(HTTPStatus.OK).json(place);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await req.place.remove();
    return res.sendStatus(HTTPStatus.OK);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
