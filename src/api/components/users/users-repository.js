const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Get user detail with accNumber
 * @param {string} accNumber - Account Number
 * @returns {Promise}
 */
async function getUserAccNumber(accNumber) {
  return User.findById(accNumber);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Create new user account
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @param {string} accNumber - Account Number
 * @param {string} balance - Account Balance
 * @param {string} accType - Account Type
 * @returns {Promise}
 */
async function createUserAccount(name, email, password, loginAttempt, accNumber, balance, accType) {
  return User.create({
    name,
    email,
    password,
    loginAttempt,
    accNumber,
    balance,
    accType,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUserAccount(id, name, email, accNumber, balance, accType) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
        accNumber,
        balance,
        accType,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Delete a user from account number
 * @param {string} accNumber - Account Number
 * @returns {Promise}
 */
async function deleteUserAccount(accNumber) {
  return User.deleteOne({ accNumber: accNumber });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByAccNumber(accNumber) {
  return User.findOne({ accNumber });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

module.exports = {
  getUsers,
  getUser,
  getUserAccNumber,
  createUser,
  createUserAccount,
  updateUser,
  updateUserAccount,
  deleteUser,
  deleteUserAccount,
  getUserByEmail,
  getUserByAccNumber,
  changePassword,
};
