const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlValidator = (url, helpers) => (validator.isURL(url) ? url : helpers.message('Given isn\'t correct URL.'));

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlValidator, 'URL validation.'),
    trailer: Joi.string().required().custom(urlValidator, 'URL validation.'),
    thumbnail: Joi.string().required().custom(urlValidator, 'URL validation.'),
    movieId: Joi.string().required().hex().length(24),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

module.exports = { createMovieValidator, movieValidator };
