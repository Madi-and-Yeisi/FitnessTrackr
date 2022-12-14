require('dotenv').config();
const jwt = require('jsonwebtoken');
const client = require('./client');
const bcrypt = require('bcrypt');
const SALT_COUNT = 10;

// user database functions


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
    console.log("user", user);
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        return user;
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

async function getUserById(userId) {
  console.log("getting user by id.... Id:", userId);
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
  console.log("finding user by username...")
  try {
    const { rows: [ user ] } = await client.query(`
      SELECT id, username, password 
      FROM users 
      WHERE username=$1;
    `, [userName]);
    console.log("found user by username:", user)

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
