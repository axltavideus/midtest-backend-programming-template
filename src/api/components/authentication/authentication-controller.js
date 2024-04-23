const { errorResponder, errorTypes } = require('../../../core/errors');
const limiter = require('express-rate-limit');
const logger = require('../../../core/logger')('app');
const authenticationServices = require('./authentication-service');

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      var loginAttempt =+1;
      if (loginAttempt > 4) {
        response.loginAttempt;
        logger.info('login attempt: ',loginAttempt);
        throw errorResponder(
          errorTypes.FORBIDDEN_ERROR,
          'Too many failed login attempts.'
        );
      }

      logger.info('login attempt: ');
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    loginAttempt = 0;
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
