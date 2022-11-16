const client = require("./client");

const { attachActivitiesToRoutines } = require('./activities');


// routines database functions


// create and return the new routine
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


async function getRoutineById(id) {
  try {
    const { rows: [ routine ] }=await client.query(`
      SELECT * 
      FROM routines
      WHERE id=$1;
    `, [id]);

    return routine;
  }catch(error){
    throw error;
  }
}


// select and return an array of all routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routines;
    `);

    return routines;
  }catch (error){
    throw error;
  }
}


// select and return an array of all routines, include their activities
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


// TODO: select and return an array of public routines, include their activities
async function getAllPublicRoutines() {
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


// TODO: select and return an array of all routines made by user, include their activities
async function getAllRoutinesByUser({ username }) {
  try{
    const {rows: routineIds } = await client.query (`
      SELECT id
      FROM routines
      WHERE "creatorId"=$1;
    `, [username]);

    const routines = await Promise.all(routineIds.map(
      routine => getRoutineById( routine.id )
    ));

    return routines;
  }catch (error){
    throw error;
  }
}


// TODO: select and return an array of public routines made by user, include their activities
async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows: routineIds } = await client.query (`
      SELECT id
      FROM routines
      WHERE "creatorId"=$1 AND "isPublic"=true;
    `, [username]);

    const routines = await Promise.all(routineIds.map(
      routine => getRoutineById( routine.id )
    ));

    return routines;
  }catch (error){
    throw error;
  }
}


// TODO: select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities
async function getPublicRoutinesByActivity(activityId) {
  try{
    const { rows: routines } = await client.query (`
      SELECT * FROM routines
      WHERE activity=${activityId} AND "isPublic"=true;
    `)

    const activity = await Promise.all (id.map(
      activity=> getPublicRoutinesByActivity(activity.id)
    ));

    return activity;
  } catch (error) {
    throw error;
  }
}


// TODO:
async function updateRoutine( routineId, fields ) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if (setString.length === 0) return;

  try {
    const { rows: [routine] } =await client.query(`
      UPDATE routines
      SET ${setString}
      WHERE id=${routineId}
      RETURNING *; 
    `, Object.values(fields));

    return routine;
  } catch (error){
    throw error;
  }
}


// TODO:
async function destroyRoutine(id){
  try{
      console.log("destroying routine #" + id)
      await client.query(`
      DELETE FROM routines WHERE id =${id}`)
      console.log(id + " routine destroyed");
  } catch(error){
      console.log(error);
  }
} 


module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
}
