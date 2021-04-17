const usersRouter = require('express').Router();

const { updateProfileValidator } = require('../middlewares/prevalidation/user');

const {
  getMe,
  updateProfile,
} = require('../controllers/users');

usersRouter.get('/me', getMe);
usersRouter.patch('/me', updateProfileValidator, updateProfile);

module.exports = usersRouter;
