require('dotenv').config()

import express from 'express';

const config = require('config');

const app = express();

const PORT = config.get('PORT');

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
