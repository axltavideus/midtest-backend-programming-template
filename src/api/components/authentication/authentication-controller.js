const { errorResponder, errorTypes } = require('../../../core/errors');
const { User } = require('../../../models');
const logger = require('../../../core/logger')('app');
const authenticationServices = require('./authentication-service');
const authenticationRepository = require('./authentication-repository');

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
    // 1. Check for existing user and failed login count:
    const user = await authenticationRepository.getUserByEmail(email); 
    let loginAttempt = 0;

    if (user) {
      loginAttempt = user.loginAttempt || 0; // Initialize loginAttempt from user document or set to 0 if not found
    }

    // 2. Check login credentials:
    const loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

    if (!loginSuccess) {
      loginAttempt++; // Increment loginAttempt on failure

      // 3. Update user document with new login attempt count:
      await User.updateOne({ email }, { $set: { loginAttempt } });

      logger.info('login attempt: '+ loginAttempt);

      if (loginAttempt > 4) {
        throw errorResponder(
          errorTypes.FORBIDDEN_ERROR,
          'Too many failed login attempts.'
        );
      } else {
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS, 
          'Wrong email or password'
        );
      }
    }

    // 4. Reset login attempt on success:
    await User.updateOne({ email }, { $set: { loginAttempt: 0 } });

    loginAttempt = 0;
    logger.info('login reset: '+ loginAttempt);
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  login,
};
