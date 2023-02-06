const { client } = require('./index');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// user database functions


// hash password for encryption and create user
async function createUser({ username, password }) {
  const saltValue = await bcrypt.genSalt(SALT_COUNT);
  const hashedPassword = await bcrypt.hash(password, saltValue);

  try {
    const { rows: [ user ] } = await client.query(`
      INSERT INTO users(username, password)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING *;
    `, [username, hashedPassword]);

    return user;
  } catch (error) {
    console.log(error)
    throw error;
  }
}


// check user for valid input, find username and compare input password to encrypted password
async function getUser({ username, password }) {
  try {
    const user = await getUserByUsername(username);
    console.log("user", user);
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        return user;  // got you!
      } else {
        console.log("Passwords don't match")
      }
    } else {
      console.log("No user with that username")
    }
  } catch (error) {
    throw error;
  }
}


// gets user by id for
async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username 
      FROM users 
      WHERE id=$1;
    `, [userId]);
    return user;
  } catch (error) {
    throw error;
  }
}


// gets user by username
async function getUserByUsername(userName) {
  console.log("getting user by username...")
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username, password 
      FROM users 
      WHERE username=$1;
    `, [userName]);
    console.log("user:", user)
    return user;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
