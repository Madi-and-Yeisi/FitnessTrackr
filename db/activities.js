const { client } = require('./index');

// activity database functions


// create activity - unless activity name already exists
async function createActivity({ name, description, imageUrl }) {
  try {
    const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities (name, description, "imageUrl")
      VALUES ($1, $2, $3)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [name, description, imageUrl]);

    return activity;
  } catch (error) {
    throw error;
  }
}


// update activity
async function updateActivity(activityId, fields) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(',');

  if (setString.length === 0) return; // nothing was input to update

  try {
    const { rows: [ activity ] } =await client.query(`
      UPDATE activities 
      SET ${ setString }
      WHERE id = ${ activityId }
      RETURNING *; 
    `, Object.values(fields));

    return activity;
  } catch (error){
    throw error;
  }
}


// get all activities
async function getAllActivities() {
  try {
    const { rows: activities } = await client.query(`
      SELECT * 
      FROM activities;
    `);

    return activities;
  } catch (error) {
    throw error;
  }
}


// get activity by id   // TODO: use
async function getActivityById(id) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT id, name, description
      FROM activities
      WHERE id = $1;
    `, [id]);

    return activity;
  } catch (error) {
    throw error;
  }
}


// get activity by name   // TODO: use
async function getActivityByName(name) {
  try {
    const { rows: [ activity ] } = await client.query(`
      SELECT id, name, description
      FROM activities
      WHERE name = $1;
    `, [name]);

    return activity;
  } catch (error) {
    throw error;
  }
}


// attach activities to routines
async function attachActivitiesToRoutines(routines) {
  // no side effects
  const routinesToReturn = [...routines];
  const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
  const routineIds = routines.map(routine => routine.id);
  if (!routineIds?.length) return [];
  
  try {
    // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
    const { rows: activities } = await client.query(`
      SELECT activities.*, routine_activities.duration, routine_activities.count, routine_activities.id AS "routineActivityId", routine_activities."routineId"
      FROM activities 
      JOIN routine_activities ON routine_activities."activityId" = activities.id
      WHERE routine_activities."routineId" IN (${ binds });
    `, routineIds);

    // loop over the routines
    for(const routine of routinesToReturn) {
      // filter the activities to only include those that have this routineId
      const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
      // attach the activities to each single routine
      routine.activities = activitiesToAdd;
    }
    return routinesToReturn;
  } catch (error) {
    throw error;
  }
}


module.exports = {
  createActivity,
  updateActivity,
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines
};
