
function errorHandler(log) {
  return function errorHandlerMiddleware(err, req, res, next) {
    if (!err) {
      next();
      return;
    }

    if (!res.statusCode || res.statusCode < 400) {
      res.statusCode = err.statusCode || 500;
    }

    const response = {};
    response.message = err.message || 'An unknown error occurred';
    console.log(err);
    if (res.statusCode >= 500) {
      log.error({ req, err, statusCode: res.statusCode }, '5xx response');
    } else {
      log.warn({ req, err, statusCode: res.statusCode }, '4xx response');
    }

    res.status(res.statusCode).json(response);
  }
}

module.exports = errorHandler;
