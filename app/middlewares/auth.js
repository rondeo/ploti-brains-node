const { get } = require('lodash'),
  logger = require('../logger'),
  sessionManager = require('./session'),
  usersService = require('../services/users'),
  errors = require('../errors');

exports.checkAuth = (req, res, next) => {
  const token = get(req, ['headers', 'authorization']);
  if (!token || !sessionManager.decode(token)) return next(errors.badRequest(res)); // TODO: refactor sending res as param is shitty af
  const decoded = sessionManager.decode(token);
  return usersService
    .findUser(decoded.email)
    .then(u => {
      if (!u) return res.status(401).end();
      req.user = u;
      return next();
    })
    .catch(err => {
      logger.error(err.message);
      return next();
    });
};
