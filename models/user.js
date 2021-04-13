const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Получен некорректный email.',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new UnauthorizedError('Неправильный email или пароль');

      return bcryptjs.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new UnauthorizedError('Неправильный email или пароль');

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
