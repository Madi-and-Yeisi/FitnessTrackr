const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  try {
    const {rows:[user]}= await client.query(`
    INSERT INTO users (username,password)
    VALUES ($1,$2)
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR (255)
    RETURNING*;
    `,[username,password]);
    return user;
  }catch (error){
    throw error;
  }
}



async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
