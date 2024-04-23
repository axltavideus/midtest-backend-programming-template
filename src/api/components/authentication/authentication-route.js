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

  route.post('/login', async (req, res) => {
    const {username, password} = req.body;

    if (!client.connected) {
      await client.connect();
    }
  
    // Check if the account is locked
    client.get(`lockout:${username}`, (err, lockout) => {
      if (lockout) {
        return res.status(429).json({error: 'Account locked'});
      }
  
      // Check the provided credentials
      authenticate(username, password, (err, success) => {
        if (success) {
          // Reset the failed login attempts counter
          client.del(`failed:${username}`);
  
          // Continue with your login logic
        } else {
          // Increment the failed login attempts counter
          client.incr(`failed:${username}`);
  
          // Check if the limit has been reached
          client.get(`failed:${username}`, (err, attempts) => {
            if (attempts >= 5) {
              // Lock the account for 30 minutes
              client.set(`lockout:${username}`, 1, 'EX', 30 * 60);
            }
          });
  
          res.status(401).json({error: 'Invalid credentials'});
        }
      });
    });
  });
};

// route.post(
//   '/login',
//   celebrate(authenticationValidators.login),
//   authenticationControllers.login
// );
