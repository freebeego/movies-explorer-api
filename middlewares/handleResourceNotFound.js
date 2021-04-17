const NotFoundError = require('../errors/NotFoundError');

const { resourceNotFound } = require('../config/messages').http.clientError.notFoundError;

module.exports = (req, res, next) => {
  next(new NotFoundError(resourceNotFound));
};
