const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/**
 * Get list of users with pagination and search and sort feature
 * * @param {string} page_number - Page Number
 * * @param {string} page_size - Page Size
 * * @param {string} search - Search
 * * @param {string} sort - Sort
 * @returns {Array}
 */
async function getUsersPagination(page_number, page_size, search, sort) {
  let users = await usersRepository.getUsers();
  if (isNaN(page_number)) {
    page_number = 1;
  }

  if (isNaN(page_size)) {
    page_size = users.length;
  }
  
  if (search) {
    const searchFields = search.split(':');
    const searchField = searchFields[0];
    const searchKey = searchFields[1];

    if (searchField === 'email'){
      users = users.filter(user => user.email.toLowerCase().includes(searchKey.toLowerCase()));
    }
    if (searchField === 'name'){
      users = users.filter(user => user.name.toLowerCase().includes(searchKey.toLowerCase()));
    }
  } else {
    // if search is not provided, don't filter the users
    search = '';
  }

  if (sort) {
    const sortFields = sort.split(':'); // Create new variable for sort parameters
    const sortField = sortFields[0].toLowerCase(); // Ensure consistent case
    const sortOrder = sortFields[1];
    

    users.sort((a, b) => {
      const comparisonValue = a[sortField].localeCompare(b[sortField]);
      return sortOrder === 'asc' ? comparisonValue : -comparisonValue; // Handle both asc and desc
    });
  }

  const count = users.length;

  const totalpages = Math.ceil(users.length / page_size);

  page_number = Math.min(page_number, totalpages)

  const startIndex = (page_number - 1) * page_size;
  const endIndex = Math.min(startIndex + page_size, users.length);

  const paginatedUsers = users.slice(startIndex, endIndex);

  const data = [];
  for (let i = 0; i < paginatedUsers.length; i++) {
    const user = paginatedUsers[i];
    data.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  const has_next_page = endIndex < count;
  const has_previous_page = startIndex > 0;

  return {
    totalpages, 
    page_number, 
    page_size, 
    count, 
    totalpages, 
    has_next_page, 
    has_previous_page, 
    data
  };
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUsersPagination,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
