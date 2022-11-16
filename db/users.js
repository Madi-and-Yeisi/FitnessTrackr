require('dotenv').config();
const jwt = require('jsonwebtoken');
const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// database functions

// user functions
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
  }catch (error){
    console.log(error)
    throw error;
  }
}


async function getUser({ username, password }) {
  // this should be able to verify the password against the hashed password
  try {
    const user = await getUserByUsername(username);

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      return user;
    } else {
      console.log("Passwords don't match")
    }
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username 
      FROM users 
      WHERE id=$1;
    `, [userId]);

    if (!user) return null;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(userName) {
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username, password 
      FROM users 
      WHERE username=$1;
    `, [userName]);

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
