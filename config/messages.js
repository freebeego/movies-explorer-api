module.exports = {
  rateLimit: {
    errorMessage: 'Too many requests, please try again later.',
  },
  http: {
    clientError: {
      conflictError: {
        userAlreadyExists: 'Пользователь с таким email уже существует.',
      },
      notFoundError: {
        movieNotExist: 'Фильм с указанным id не существует.',
        resourceNotFound: 'Запрашиваемый ресурс не найден',
      },
      forbiddenError: {
        justOwnerCanDeleteMovie: 'Удалять можно только свои фильмы.',
      },
      unauthorizedError: {
        authorizationRequired: 'Необходима авторизация',
        incorrectEmailOrPass: 'Неправильный email или пароль',
      },
    },
    serverError: {
      internalServerError: 'На сервере произошла ошибка',
    },
  },
  validation: {
    incorrectUrl: 'Given incorrect URL.',
    incorrectEmail: 'Given incorrect email.',
  },
};
