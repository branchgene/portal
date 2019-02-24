/* eslint consistent-return:0 */

const express = require('express');
const util = require('util');
const path = require('path');
const SwaggerExpress = require('swagger-express-mw');

const log = require('./lib/log');
const errors = require('./middlewares/errors');
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

  const swaggerCreateAsync = util.promisify(SwaggerExpress.create);
  const swaggerExpress = await swaggerCreateAsync({
    appRoot: __dirname,
    configDir: path.join(__dirname, '../config'),
  });
  swaggerExpress.register(app);
  app.use(errors(log));

  // In production we need to pass these values in instead of relying on webpack
  setup(app, {
    outputPath: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
  });

  return app;
}
