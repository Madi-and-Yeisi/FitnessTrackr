const { client } = require('./index');

const { attachActivitiesToRoutines } = require('./activities');
const { getUserById } = require('./users');


// routines database functions


// create new routine
async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{ 
    const {rows: [routine]}= await client.query (`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch (error) {
    throw error;
  }
}


// update routine
async function updateRoutine( routineId, fields ) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if (setString.length === 0) return;

  try {
    const { rows: [routine] } =await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id = ${routineId}
      RETURNING *; 
    `, Object.values(fields));

    return routine;
  } catch (error) {
    throw error;
  }
}


// delete routine
async function deleteRoutine(routineId){
  try {
    const { rows: [routine] } = await client.query(`
      DELETE FROM routines 
      WHERE id = $1 
      RETURNING *;
    `, [routineId]);

    return routine;
  } catch(error){
      console.log(error);
  }
} 


// get routine by id
async function getRoutineById(id) {
  try {
    const { rows: [ routine ] }=await client.query(`
      SELECT * 
      FROM routines
      WHERE id = $1;
    `, [id]);

    return routine;
  } catch (error) {
    throw error;
  }
}


// get routine by id, include routine activities and creatorName
async function getRoutineByIdWithActivities(id) {
  try {
    const { rows: [ routine ] }=await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      WHERE routines.id = $1;
    `, [id]);

    return attachActivitiesToRoutines([routine]);
  } catch (error) {
    throw error;
  }
}


// select and return an array of all routines, join the users.username as creatorName, include their activities
async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
    `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}


// select and return an array of all routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines;
    `);

    return routines;
  } catch (error) {
    throw error;
  }
}


// select and return an array of public routines, join the users.username as creatorName, include their activities
async function getAllPublicRoutines() {
  try {
    const { rows: routines } = await client.query(`
      SELECT routines.*, users.username AS "creatorName"
      FROM routines
      JOIN users ON routines."creatorId" = users.id 
      WHERE "isPublic" = true;
    `);
    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error
  }
}


// select and return an array of all routines made by user, include their activities
async function getAllRoutinesByUser(userId) {
  try {
    const {rows: routineIds } = await client.query (`
      SELECT id
      FROM routines
      WHERE "creatorId" = $1;
    `, [userId]);

    const routines = await Promise.all(routineIds.map(
      routine => getRoutineById( routine.id )
    ));

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}


// select and return an array of public routines made by user, include their activities
async function getPublicRoutinesByUser(userId) {
  try {
    const { rows: routineIds } = await client.query (`
      SELECT id
      FROM routines
      WHERE "creatorId" = $1 AND "isPublic" = true;
    `, [userId]);

    const routines = await Promise.all(routineIds.map(
      routine => getRoutineById( routine.id )
    ));

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    throw error;
  }
}


// select and return an array of public routines which have a specific activityId in their routine_activities, include their activities and creator username
async function getPublicRoutinesByActivity(activityId) {
  try {
    const { rows: routineIds } = await client.query (`
      SELECT "routineId" 
      FROM routine_activities
      WHERE "activityId" = $1;
    `, [activityId])

    const routines = await Promise.all(routineIds.map(
      routine => getRoutineById( routine.routineId )
    ));

    // add usernames as creatorName to each routine
    const routinesWithCreatorNames = await Promise.all(routines.map(async function(routine) {
      const user = await getUserById( routine.creatorId );
      routine.creatorName = user.username;
      return routine;
    }));

    return attachActivitiesToRoutines(routinesWithCreatorNames);
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createRoutine,
  updateRoutine,
  deleteRoutine,
  getRoutineById,
  getRoutineByIdWithActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getRoutinesWithoutActivities,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity
}
