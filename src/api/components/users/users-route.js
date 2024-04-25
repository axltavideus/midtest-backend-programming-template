const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsersPagination);

  //Get users with accounts
  route.get('/accounts', authenticationMiddleware, usersControllers.getAccountPage);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Create user Account
  route.post(
    '/accounts',
    authenticationMiddleware,
    celebrate(usersValidator.createUserAccount),
    usersControllers.createUserAccount
  );

    // Create transfers between Account
    route.post(
      '/transfers/:id',
      authenticationMiddleware,
      celebrate(usersValidator.transfer),
      usersControllers.createTransfer
    );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Update user
  route.put(
    '/accounts/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUserAccount),
    usersControllers.updateUserAccount
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Delete user with accNumber
  route.delete('/accounts/:id', authenticationMiddleware, usersControllers.deleteUser);

  // Change password
  route.post(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate(usersValidator.changePassword),
    usersControllers.changePassword
  );
};
