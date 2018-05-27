import Place from '../models/place.model';
import { map } from 'ramda'; 
import { dispatch as jobUploadImage } from '../jobs/place.jobs';
import APIError from '../services/error';
import HTTPStatus from 'http-status';
import upload from '../config/multer';

// MIDDLEWARES

export function uploadImage() {
  return upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]);
}

export async function policyPlace(req, res, next) {
  try {
    if (req.place && req.place.user.toString() !== req.user._id.toString()) {
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
    next();
  } catch (err) {
    return next(err);
  }
}

export async function find(req, res, next) {
  try {
    req.place = await Place.findByIdOrSlug(req.params.id).populate('user');

    if (!req.place) next(new APIError('Not Found Place!', HTTPStatus.NOT_FOUND, true));

    next();
  } catch (err) {
    return next(err);
  }
}

// CONTROLLER FUNCTIONS

export async function create(req, res, next) {
  try {
    const place = await Place.createPlace(req.body, req.user._id);

    jobUploadImage({ files: req.files, place });

    return res
      .status(HTTPStatus.CREATED)
      .json(place);
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

export async function index(req, res, next) {
  try {
    const { page } = req.query;
    const { user } = req;

    let places = await Place.find({}).populate('favorites');

    places = places.map(async (item) => {
      const isFavorite = await item.isFavorited(user && user._id);
      const likes = await item.likes(user && user._id);
      const favorites = await item.favoriteBy(user && user._id);
      return ({
        ...item.toJSON(),
        isFavorite,
        likes,
        favorites
      });
    });

    res.status(HTTPStatus.OK).json(await Promise.all(places));
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

