const { NODE_ENV, JWT_SECRET } = process.env;

const jwtAuth = require('jsonwebtoken');

const { jwt } = require('../config/devConfig');

const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const cookiesJwt = req.cookies.jwt;
  if (!cookiesJwt || !cookiesJwt.startsWith('Bearer ')) throw new UnauthorizedError('Необходима авторизация');

  const token = cookiesJwt.replace('Bearer ', '');
  let payload;

  try {
    payload = jwtAuth.verify(token, NODE_ENV === 'prod' ? JWT_SECRET : jwt.secretKey);
  } catch (err) {
    throw UnauthorizedError('Необходима авторизация');
  }

  req.user = { _id: payload._id };

  next();
};
