const Movie = require('../models/movie');

const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');

const { notFoundError, forbiddenError } = require('../config/messages').http.clientError;

const getMyMovies = (req, res, next) => {
  const id = req.user._id;
  Movie.find({ owner: id })
    .select('-owner')
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => ({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailer,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      nameRU: movie.nameRU,
      nameEN: movie.nameEN,
    }))
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(new NotFoundError(notFoundError.movieNotExist))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(forbiddenError.justOwnerCanDeleteMovie);
      }
      return Movie.findByIdAndRemove(id, { projection: '-owner' });
    })
    .then((deletedMovie) => res.status(200).send(deletedMovie))
    .catch(next);
};

module.exports = {
  getMyMovies,
  createMovie,
  deleteMovie,
};
