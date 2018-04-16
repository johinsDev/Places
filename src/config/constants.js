'use strict'

module.exports = {
  PORT: process.env.PORT || 3001,
  API_ROUTE: '/api',
  RAVEN_ID: '',
  MONGO_URL: 'mongodb://localhost/places-dev',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME
}
