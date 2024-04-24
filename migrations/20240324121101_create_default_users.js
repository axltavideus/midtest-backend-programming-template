const logger = require('../src/core/logger')('api');
const { User } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const name = 'Administrator';
const email = 'admin@example.com';
const password = '123456';
const loginAttempt = 0;
const accNumber = 1234567;
const balance = 1000000;
const accType = 'savings';

logger.info('Creating default users');

(async () => {
  try {
    const numUsers = await User.countDocuments({
      name,
      email,
    });

    if (numUsers > 0) {
      throw new Error(`User ${email} already exists`);
    }

    const hashedPassword = await hashPassword(password);
    await User.create({
      name,
      email,
      password: hashedPassword,
      loginAttempt,
      accNumber,
      balance,
      accType,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
