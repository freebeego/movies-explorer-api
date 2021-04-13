const moviesRouter = require('express').Router();

const { createMovieValidator, movieValidator } = require('../middlewares/prevalidation/movie');

const {
  getMyMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMyMovies);
moviesRouter.post('/', createMovieValidator, createMovie);
moviesRouter.delete('/:id', movieValidator, deleteMovie);

module.exports = moviesRouter;
