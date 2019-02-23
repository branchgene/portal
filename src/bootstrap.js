/* eslint consistent-return:0 */

const express = require('express');
const { resolve } = require('path');
const setup = require('./middlewares/frontendMiddleware');

module.exports.boot = async () => {

  const app = express();
  app.use((req, res, next) => {
    res.set('x-powered-by', 'hudsonalpha');
    next();
  });
  app.set('trust proxy', true);

  // If you need a backend, e.g. an API, add your custom backend-specific middleware here
  // app.use('/api', myApi);

  // In production we need to pass these values in instead of relying on webpack
  setup(app, {
    outputPath: resolve(process.cwd(), 'build'),
    publicPath: '/',
  });

  return app;
}
