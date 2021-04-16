const moviesRouter = require('express').Router();

const { createMovieValidator, movieIdValidator } = require('../middlewares/prevalidation/movie');

const {
  getMyMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMyMovies);
moviesRouter.post('/', createMovieValidator, createMovie);
moviesRouter.delete('/:id', movieIdValidator, deleteMovie);

module.exports = moviesRouter;
