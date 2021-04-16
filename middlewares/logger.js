const winston = require('winston');
const expressWinston = require('express-winston');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: './logs/request.log' }),
  ],
  format: winston.format.json(),
});

const expressErrorTransports = [new winston.transports.File({ filename: './logs/error.log' })];
if (process.env.NODE_ENV !== 'production') {
  expressErrorTransports.push(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
        winston.format.colorize(),
      ),
    }),
  );
}

const errorLogger = expressWinston.errorLogger({
  transports: expressErrorTransports,
  format: winston.format.json(),
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.json(),
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.simple(),
        winston.format.colorize(),
      ),
    }),
  );
}

module.exports = {
  requestLogger,
  errorLogger,
  logger,
};
