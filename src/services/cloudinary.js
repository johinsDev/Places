import cloudinary from 'cloudinary';
import APIError from '../services/error';
import HTTPStatus from 'http-status';
import { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from '../config/constants';

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

const upload = path => (
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload(path, function(result) {
     if (result.secure_url) return resolve(result.secure_url);
      
      reject(new APIError('Not Upload Image', HTTPStatus.BAD_REQUEST, true));
    });
  })
);

export default upload;
