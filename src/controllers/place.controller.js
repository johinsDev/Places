import Place from '../models/place.model';
import HTTPStatus from 'http-status';

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
    return res.status(HTTPStatus.OK).json(await Place.find({}));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function show(req, res, next) {
  try {
    const place = await Place.findById(req.params.id);
    return res.status(HTTPStatus.OK).json(place);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const place = await Place.findById(req.params.id);

    Object.keys(req.body).forEach(key => {
      place[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await place.save());
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    await Place.findByIdAndRemove(req.params.id);
    return res.sendStatus(HTTPStatus.OK);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}
