const { NODE_ENV, JWT_SECRET } = process.env;

const bcryptjs = require('bcryptjs');
const jwtAuth = require('jsonwebtoken');

const { jwt, pass } = require('../config/devConfig');

const ConflictError = require('../errors/ConflictError');

const User = require('../models/user');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    req.body,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.status(200).send(user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) throw new ConflictError('Пользователь с таким email уже существует.');
      return bcryptjs.hash(password, pass.salt);
    })
    .then((passHash) => User.create({
      name,
      email,
      password: passHash,
    }))
    .then((user) => {
      res.status(200).send({ _id: user._id, name: user.name, email: user.email });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwtAuth.sign(
        { _id: user._id },
        NODE_ENV === 'prod' ? JWT_SECRET : jwt.secretKey,
        { expiresIn: jwt.expiresIn },
      );

      res
        .cookie('jwt', `Bearer ${token}`, {
          maxAge: jwt.expiresIn,
          httpOnly: true,
        })
        .status(200)
        .send({ _id: user._id, name: user.name, email: user.email });
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
