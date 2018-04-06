'use strict'

module.exports = {
  PORT: process.env.PORT || 3001,
  API_ROUTE: '/api',
  RAVEN_ID: '',
  MONGO_URL: 'mongodb://localhost/places-dev',
  CLOUDINARY_API_KEY: proccess.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: proccess.env.CLOUDINARY_API_SECRET,
  CLOUDINARY_ENVIROMENT: proccess.env.ENVIROMENT
}
