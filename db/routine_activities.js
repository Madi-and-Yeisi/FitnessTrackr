const { client } = require('./index');

async function addActivityToRoutine({ routineId, activityId, count, duration, }) {
  try {
    const { rows: [ routine_activity ] } = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    return routine_activity;
  } catch (error) {
    throw error;
  }

}

async function getRoutineActivityById(id) {
  try {
    const { rows: [ routine_activity ] } = await client.query(`
      SELECT id, "routineId", "activityId" 
      FROM routine_activities 
      WHERE id=$1;
    `, [id]);

    if (!routine_activity) return null;
    return routine_activity;
  } catch (error) {
    throw error;
  }

}

async function getRoutineActivitiesByRoutine({ id }) {
// select and return an array of all routine_activity records
  try {

  } catch (error) {
    throw error;
  }

}

async function updateRoutineActivity({ id, count, duration }) {
  try {
    const { rows: [ routine_activity ] } = await client.query(`
      UPDATE routine_activities 
      SET count=$1, duration=$2 
      WHERE id=$3 
      RETURNING *;
    `, [count, duration, id]);

    return routine_activity;
  } catch (error) {
    throw error;
  }

}

async function destroyRoutineActivity(id) {}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
