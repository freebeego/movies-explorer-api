const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const cookiesJwt = req.cookies.jwt;
  if (!cookiesJwt || !cookiesJwt.startsWith('Bearer ')) throw new UnauthorizedError('Необходима авторизация');

  const token = cookiesJwt.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'prod' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    throw UnauthorizedError('Необходима авторизация');
  }

  req.user = { _id: payload._id };

  next();
};
