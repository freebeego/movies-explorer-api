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

const handleResourceNotFound = require('./middlewares/handleResourceNotFound');
const handleError = require('./middlewares/handleError');

const router = require('./routes/index');

const { server, db } = require('./config/devConfig');

const {
  PORT = server.port,
  DB_HOST = db.host,
  DB_PORT = db.port,
  DB_NAME = db.name,
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

    app.use(cors(corsConfig), limiter, speedLimiter, helmet());
    app.use(express.json(), cookieParser());
    app.use(requestLogger, router, handleResourceNotFound);
    app.use(errorLogger, errors(), handleError);

    app.listen(PORT, () => logger.info(`App listening on port ${PORT}`));
  })
  .catch((e) => logger.log('error', 'Ошибка: %s', e));
