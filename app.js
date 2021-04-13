require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');

const cookieParser = require('cookie-parser');

const corsConfig = require('./config/corsConfig');
const { rateLimitConfig, slowDownConfig } = require('./config/limitConfig');

const { requestLogger, errorLogger, logger } = require('./middlewares/logger');

const auth = require('./middlewares/auth');
const handleResourceNotFound = require('./middlewares/handleResourceNotFound');
const handleError = require('./middlewares/handleError');

const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const { createUserValidator, loginValidator } = require('./middlewares/prevalidation/user');

const { createUser, login, logout } = require('./controllers/users');

const {
  PORT = 3000,
  DB_HOST = 'localhost',
  DB_PORT = 27017,
  DB_NAME = 'bitfilmsdb',
} = process.env;

const limiter = rateLimit(rateLimitConfig);
const speedLimiter = slowDown(slowDownConfig);

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    const app = express();

    app.use(cors(corsConfig));
    app.use(limiter);
    app.use(speedLimiter);
    app.use(helmet());

    app.use(express.json());
    app.use(cookieParser());

    app.use(requestLogger);

    app.post('/signin', loginValidator, login);
    app.post('/signup', createUserValidator, createUser);
    app.get('/signout', auth, logout);

    app.use('/users', auth, usersRouter);
    app.use('/movies', auth, moviesRouter);

    app.use(handleResourceNotFound);

    app.use(errorLogger);
    app.use(errors());

    app.use(handleError);

    app.listen(PORT, () => logger.info(`App listening on port ${PORT}`));
  })
  .catch((e) => logger.log('error', 'Ошибка: %s', e));
