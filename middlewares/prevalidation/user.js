const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const emailValidator = (email, helpers) => (validator.isEmail(email) ? email : helpers.message('Given isn\'t correct email.'));

const createUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().custom(emailValidator, 'Email validation.'),
    password: Joi.string().required().min(2).max(30),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(emailValidator, 'Email validation.'),
    password: Joi.string().required().min(2).max(30),
  }),
});

const updateProfileValidator = celebrate({
  body: Joi.object().min(1).max(2).keys({
    email: Joi.string().custom(emailValidator, 'Email validation.'),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  createUserValidator,
  loginValidator,
  updateProfileValidator,
};
