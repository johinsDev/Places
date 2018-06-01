require('dotenv').config();
import express from 'express';
import kue from 'kue';
import routes from './src/routes';
import constants from './src/config/constants';
import middlewaresConfig from './src/services/middlewares';
import './src/config/database';

const app = express();
const PORT = constants.PORT;

// @TODO: Plural routes lla
// mailers
// forgotPassword
// activeUser
// acl
// AUTH2
// subscription
// state machine
// rate limiting
// plan and feautures
// testimonials
// route public and private
// session
// Validations
// translation app and models
// Events and listeners
// notifications cache 
// addressable
// categories
// pages
// tags
// menus
// excel upload
// payment gateway
// algolia search
// advanced query
// pagination
// location system

middlewaresConfig(app);
app.use('/api', routes);
kue.app.listen( 3000 );
app.listen(PORT, err => {
  if (err) {
    console.log('Cannot run');
  } else {
    console.log(
      `
        Yep this is working 🍺
        App listen on port: ${PORT} 🍕
        Env: ${process.env.NODE_ENV} 🦄
      `
    );
  }
});

export default app;
