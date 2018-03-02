require('dotenv').config();
import Config from './src/Core/Config';
import express from 'express';


const app = express();
const config = new Config('./src/config');
const PORT = config.get('app.PORT');

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
