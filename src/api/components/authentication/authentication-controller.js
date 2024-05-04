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
    // Check for existing user and failed login count:
    const users = await authenticationRepository.getUserByEmail(email); 
    let loginAttempt = 0;

    if (users) {
      loginAttempt = users.loginAttempt || 0; // Initialize loginAttempt from user document or set to 0 if not found
    }

    // Check login credentials:
    const loginSuccess = await authenticationServices.checkLoginCredentials(email, password);

    if (!loginSuccess) {
      loginAttempt++; // Increment loginAttempt on failure

      // Update user document with new login attempt count:
      await User.updateOne({ email }, { $set: { loginAttempt } });

      if (loginAttempt > 4 && loginAttempt !== 5) {
        logger.info('User '+ users.email +' mencoba login, namun mendapat error 403 karena telah melebihi limit attempt');
        
        //Timeout user
        await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000));
        await User.updateOne({ email }, { $set: { loginAttempt: 0 } });
        logger.info('User '+ users.email +' bisa mencoba login kembali karena sudah lebih dari 30 menit sejak pengenaan limit. Attempt di-reset kembali ke 0.');
        
        //Reset loginAttempt after 30 minutes
        loginAttempt = 0;
        
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts',
        ); 
      }
      if (loginAttempt === 5) {
        logger.info('User '+ users.email +' gagal login. Attempt = '+loginAttempt+'. Limit Reached');
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many failed login attempts,'+ email + 'login attempts: ' + loginAttempt + ', tunggu 30 menit',
        );
      } else {
        logger.info('User '+ users.email +' gagal login. Attempt: '+ loginAttempt);
        throw errorResponder(
          errorTypes.INVALID_CREDENTIALS, 
          'Wrong email or password, '+ email + 'login attempts: ' + loginAttempt
        );
      }
    }
      
    // Reset login attempt on success:
    await User.updateOne({ email }, { $set: { loginAttempt: 0 } });

    loginAttempt = 0;
    logger.info('User '+ users.email +' berhasil login. ');
    logger.info('User '+ users.email +' logout. ');
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}


module.exports = {
  login,
};
