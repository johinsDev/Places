require('dotenv').config();
import config from './src/Core/Config';
import express from 'express';
import routes from './src/routes';

const app = express();
const PORT = config.get('app.PORT');
app.use(config.get('app.API_ROUTE'), routes);

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
