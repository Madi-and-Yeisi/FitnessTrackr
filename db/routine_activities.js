const { client } = require('./index');


// routine activities database functions


// add routine activity
async function addActivityToRoutine({ routineId, activityId, count, duration, }) {
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}


// update routine activity
async function updateRoutineActivity( routineActivityId, fields ) {
  console.log("updating routine activity...", routineActivityId);
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if (setString.length === 0) return;
  
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      UPDATE routine_activities 
      SET ${setString}
      WHERE id=${routineActivityId}
      RETURNING *;
    `, Object.values(fields));

    return routineActivity;
  } catch (error) {
    throw error;
  }

}


// delete routine activity
async function deleteRoutineActivity(routineActivityId) {
  try {
    const { rows: [routineActivity] } = await client.query(`
      DELETE FROM routine_activities 
      WHERE id = $1 
      RETURNING *;
    `, [routineActivityId]);

    return routineActivity;
  } catch (error) {
      console.log(error);
  }
}


// get routine activity by routine activity id
async function getRoutineActivityById(routineActivityId) {
  console.log("getting routine activity by id ", routineActivityId);
  try {
    const { rows: [ routineActivity ] } = await client.query(`
      SELECT * 
      FROM routine_activities 
      WHERE id = $1;
    `, [routineActivityId]);

    return routineActivity;
  } catch (error) {
    throw error;
  }
}


// select and return an array of all routine activities
async function getAllRoutineActivities() {
  try {
    const { rows: routines } = await client.query(`
      SELECT * FROM routine_activities;
    `);

    return routines;
  } catch (error) {
    throw error;
  }
}


// get routine activities by routine id   // TODO: use
async function getRoutineActivitiesByRoutine(routineId) {
// select and return an array of all routine_activity records
  try {
    const { rows: routineActivities } = await client.query(`
      SELECT * 
      FROM routine_activities 
      WHERE routineId = $1;
    `, [routineId]);

    return routineActivities;
  } catch (error) {
    throw error;
  }

}


module.exports = {
  addActivityToRoutine,
  updateRoutineActivity,
  deleteRoutineActivity,
  getRoutineActivityById,
  getAllRoutineActivities,
  getRoutineActivitiesByRoutine
};
