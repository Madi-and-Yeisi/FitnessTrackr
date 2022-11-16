const client = require("./client");

async function createRoutine({ creatorId,isPublic, name, goal }) {
  try{ 
    const {rows: [routine]}= await client.query (`
    INSERT INTO routines ("creatorId", "isPublic",name,goal)
    VALUES ($1,$2,$3,$4)
    RETURNING *;
    `,[creatorId,isPublic,name,goal]);


return routine;
  }catch (error){
    throw error;
  }
}


async function getRoutineById(id) {
  try{
    const {rows:[routine]}=await client.query(`
    SELECT * 
    FROM routines
    WHERE id=$1;
    ,`[id]);

    const {rows:id }=await client.query(`
    SELECT id *
    FROM id
    WHERE id=$1;
    `,[id])
  return id;
  }catch(error){
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try{
    const {rows}= await client.query(`
    SELECT * FROM routines;`);
   
    return rows;
  }catch (error){
    throw error;
  }
}



async function getAllRoutines() {
  try{
    const {routine}=await client.query(`
    SELECT * FROM routines;`);

    return routine;
  }catch(Error){
    throw error;
  }
}

async function getAllPublicRoutines() {
try{
  const {rows}=await client.query(`
 SELECT * FROM routines; `);
  
  return routine;
}catch(error){
  throw error;
}
}



async function getAllRoutinesByUser({ username }) {
  try{
    const {rows: routine } = await client.query (`
    SELECT id
    FROM routines
     `);
     
     const routines = await Promise.all (id.map(
     routine => getAllRoutinesByUser(routine.user)
     ));
return routines;
  }catch (error){
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try{
    const {rows:username}=await client.query (`
    SELECT username FROM routines
    WHERE username=${username};
    `)
    const routines=await Promise.all (username.map(
      routines => getPublicRoutinesByUser(routines.username)
    ));
    return routines ;
  }catch (Error){
    throw Error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try{
    const {rows:id}=await client.query (`
    SELECT activity FROM routines
    WHERE activity=${id};
    `)

    const activity =await Promise.all (id.map(
      activity=> getPublicRoutinesByActivity(activity.id)
    ));
return activity;
}catch(error){
  throw error;
  }
}

async function updateRoutine({ id,...fields }) {
  const setString=Object.keys(fields).map(
    (key,index)=> `"${key}"=$${index+1}`
  ).join(',');

  if (setString.length===0) {
    return;

  }
  try{
    const {rows:[routine]} =await client.query(`
     UPDATE routine
     SET ${setString}
     WHERE id=${id}
     RETURNING *; 
     `, Object.values(fields));
     return user;
  }catch (Error){
    throw error;
  }
}

// async function destroyRoutine(id) {}

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
  // destroyRoutine,
}
