const {
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES,
  PASS_SALT,
} = process.env;

const bcryptjs = require('bcryptjs');
const jwtAuth = require('jsonwebtoken');

const { userAlreadyExists } = require('../config/messages').http.clientError.conflictError;

const { jwt, pass } = require('../config/devConfig');

const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

const makeJWT = (user) => (
  jwtAuth.sign(
    { _id: user._id },
    NODE_ENV === 'production' ? JWT_SECRET : jwt.secretKey,
    { expiresIn: NODE_ENV === 'production' ? (Number(JWT_EXPIRES) / 1000) : jwt.expiresIn },
  )
);

const setJWTCookie = (res, token) => (
  res
    .cookie('jwt', `Bearer ${token}`, {
      maxAge: NODE_ENV === 'production' ? Number(JWT_EXPIRES) : jwt.expiresIn,
      httpOnly: true,
    })
);

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res
        .status(200)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) throw new ConflictError(userAlreadyExists);
      return User.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
          new: true,
          runValidators: true,
        },
      );
    })
    .then((user) => {
      res
        .status(200)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) throw new ConflictError(userAlreadyExists);
      return bcryptjs.hash(password, NODE_ENV === 'production' ? Number(PASS_SALT) : pass.salt);
    })
    .then((passHash) => User.create({
      name,
      email,
      password: passHash,
    }))
    .then((user) => {
      setJWTCookie(res, makeJWT(user))
        .status(200)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      setJWTCookie(res, makeJWT(user))
        .status(200)
        .send({
          name: user.name,
          email: user.email,
        });
    })
    .catch(next);
};

const logout = (req, res) => {
  res
    .clearCookie('jwt', { path: '/' })
    .status(200)
    .send({});
};

module.exports = {
  getMe,
  updateProfile,
  createUser,
  login,
  logout,
};
