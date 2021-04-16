const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const { createUserValidator, loginValidator } = require('../middlewares/prevalidation/user');
const auth = require('../middlewares/auth');
const { createUser, login, logout } = require('../controllers/users');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);
router.post('/signout', auth, logout);

router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);

module.exports = router;
