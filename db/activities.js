const client = require("./client");

// database functions

// activity functions
async function createActivity({ name, description }) {
  try {
    const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities (name, description)
      VALUES ($1, $2)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [name, description]);

    return activity;
  } catch (error) {
    throw error;
  }
}


async function getAllActivities() {
  try {
    const { rows } = await client.query(`
      SELECT id, name, description
      FROM activities;
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}


async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT id, name, description
      FROM activities
      WHERE id=$1;
    `, [id]);

    if (!activity) return null;
    return activity;
  } catch (error) {
    throw error;
  }
}


async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT id, name, description
      FROM activities
      WHERE name=$1;
    `, [name]);

    if (!activity) return null;
    return activity;
  } catch (error) {
    throw error;
  }
}


async function updateActivity({ id, name, description }) {
  try {
    if (setString.length > 0) {
      const { rows: [ activity ] } = await client.query(`
        UPDATE activities 
        SET "name"=$1, "description"=$2  
        WHERE id=$3  
        RETURNING *;
      `, [name, description, id]);

      return activity;
    }

  } catch (error) {
    throw error;
  }
}


module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  createActivity,
  updateActivity,
};
