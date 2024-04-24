const express = require('express');
const redis = require('redis');
const authenticationControllers = require('./authentication-controller');
const authenticationValidators = require('./authentication-validator');
const celebrate = require('../../../core/celebrate-wrappers');

const route = express.Router();

let client;

function connectRedis() {
  client = redis.createClient({ /* your Redis connection options */ });
  client.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });
}

connectRedis(); 

module.exports = (app) => {
  app.use('/authentication', route);

  route.post(
    '/login',
    celebrate(authenticationValidators.login),
    authenticationControllers.login
  );
};


