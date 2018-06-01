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
    const { user = null } = req;

    let places = await Place.find({}).populate('favorites');

    places = places.map(async (item) => {
      const isFavorite = await item.isFavorited(user);
      const likes = await item.likes(user);
      const favorites = await item.favoriteBy(user);
      const comments = await item.commentBy(user);
      return ({
        ...item.toJSON(),
        isFavorite,
        likes,
        favorites,
        comments
      });
    });

    res.status(HTTPStatus.OK).json(await Promise.all(places));
  } catch (err) {
    err.status = HTTPStatus.BAD_REQUEST;
    return next(err);
  }
}

// @TODO: create function call all methods, and create manager for get user in schemas
// query paginate

async function transformToComment(comment, user = null) {
    const isFavorite = await comment.isFavorited(user);
    const likes = await comment.likes(user);
    const favorites = await comment.favoriteBy(user);
    return ({
      ...comment.toJSON(),
      isFavorite,
      likes,
      favorites
    });
}

async function transformToPlace(place, user = null) {
    const isFavorite = await place.isFavorited(user);

    const likes = await place.likes(user);

    const favorites = await place.favoriteBy(user);

    let comments = await place.commentBy(user);

    comments = await Promise.all(comments.map(async (comment) => {
      return await transformToComment(comment, user);
    }));

    return ({
      ...place.toJSON(),
      isFavorite,
      comments,
      likes,
      favorites
    });
}

export async function show(req, res, next) {
  try {
    const { user, place } = req;

    return res.status(HTTPStatus.OK).json(await transformToPlace(place, user));
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

