const { client } = require('./index');

// db functions 
const { createUser } = require('./users.js');
const { createActivity, getAllActivities } = require('./activities.js');
const { createRoutine, getRoutinesWithoutActivities } = require('./routines.js');
const { addActivityToRoutine } = require('./routine_activities.js');


async function createTables() {
  console.log("\n┬─┬ノ( º _ ºノ) creating tables...");
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT NOT NULL,
        "imageUrl" VARCHAR(500)
      );

      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE activitys_tags (
        "activityId" INTEGER REFERENCES activities(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE ("activityId", "tagId")
      );

      CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        "isPublic" BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
      );

      CREATE TABLE routine_activities (
        id SERIAL PRIMARY KEY,
        "routineId" INTEGER REFERENCES routines(id),
        "activityId" INTEGER REFERENCES activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE ("routineId", "activityId")
      )
    `);
    console.log("...┏━┓┏━┓┏━┓ ︵ /(^.^/) tables created!")
  } catch (error) {
      console.error("Error creating tables");
      throw error;
  }
}


async function dropTables() {
  console.log("\n(┛◉Д◉)┛彡┻━┻ dropping tables...")
  try {
    await client.query (`
      DROP TABLE IF EXISTS routine_activities;
      DROP TABLE IF EXISTS routines;
      DROP TABLE IF EXISTS activitys_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS activities;
      DROP TABLE IF EXISTS users;
    `);
    console.log("...┻━┻︵ \(°□°)/ ︵ ┻━┻ tables dropped!")
  } catch (error) {
    console.error("Error dropping tables");
    throw error;
  }
}


// SEED DATA


async function createInitialUsers() {
  console.log("\n≋≋≋≋≋̯̫⌧̯̫(ˆ•̮ ̮•ˆ) creating initial users...")
  try {
    const usersToCreate = [
      { username: "taylor", password: "kingofmyheart" },
      { username: "wentworth", password: "willnotcount" },
      { username: "hozie", password: "cherrywine" }
    ];
    const users = await Promise.all(usersToCreate.map(createUser))
    console.log("users:", users);
    console.log("...( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°) users created!")
  } catch (error) {
    console.error("Error creating users")
    throw error;
  }
}


async function createInitialActivities() {
  console.log("\nᕙ(`▽´)ᕗ creating initial activities...")
  try {
    const activitiesToCreate = [
      { name: "wide-grip standing barbell curl", description: "Lift that barbell!", imageUrl: "https://images.squarespace-cdn.com/content/v1/5ffcea9416aee143500ea103/1638183377952-LJZ8PDJYO558HFQV31KX/Standing%2BEZ%2BBar%2BCurls.jpeg" },
      { name: "Incline Dumbbell Hammer Curl", description: "Lie down face up on an incline bench and lift the barbells slowly upward toward chest", imageUrl: "https://i.pinimg.com/600x315/2e/f1/2c/2ef12c69560426956d1240a4972e5e59.jpg" },
      { name: "bench press", description: "Lift a safe amount, but push yourself!", imageUrl: "https://www.verywellfit.com/thmb/aWTZq8v9rypu7U5y8RF4XELsGTI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/29-3498606-Bench-Press-GIF-b26faabc528b48a8b3a145797ddfa0e3.gif" },
      { name: "Push Ups", description: "you know what to do!", imageUrl: ""},
      { name: "Squats", description: "Heavy lifting.", imageUrl: "https://santacruzcore.com/wp-content/uploads/proper-squat-meme-72dpi.png" },
      { name: "treadmill", description: "running", imageUrl: "" },
      { name: "stairs", description: "climbing stairs", imageUrl: "" },
      // { name: "cat-cow", description: "inhale to cow, exhale to cat", imageUrl: "https://media1.popsugar-assets.com/files/thumbor/Ed_FiTrnwdhWIR1HP7WF4uAK0js/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2021/12/02/674/n/1922729/tmp_tdb0lt_63abb2d201fb98ce_Cat-Cow.jpeg" },
    ];
    const activities = await Promise.all(activitiesToCreate.map(createActivity));
    console.log("activities:", activities);
    console.log("...(҂◡_◡) ᕤ activities created!");
  } catch (error) {
    console.error("Error creating activities");
    throw error;
  }
}


async function createInitialTags() {

}


async function createInitialRoutines() {
  console.log("\n(⊙＿⊙') creating initial routines...")
  try {
    const routinesToCreate = [
      { creatorId: 1, isPublic: true, name: "Chest Day", goal: "To beef up the Chest and Triceps!" },
      { creatorId: 1, isPublic: false, name: "Leg Day", goal: "Running, stairs, squats" },
      { creatorId: 2, isPublic: true, name: "Cardio Day", goal: "Running, stairs. Stuff that gets your heart pumping!" },
      { creatorId: 2, isPublic: false, name: "Bicep Day", goal: "Work the Back and Biceps." },
    ];
    const routines = await Promise.all(routinesToCreate.map((routine) => createRoutine(routine)));
    console.log("routines:", routines);
    console.log("...(=____=) routines created!");
  } catch (error) {
    console.error("Error creating routines");
    throw error;
  }

}


async function createInitialRoutineActivities() {
  console.log("\n╚(•⌂•)╝ creating initial routine_activities...");
  try {
    const [chestRoutine, legRoutine, cardioRoutine, bicepRoutine] = await getRoutinesWithoutActivities();
    const [bicep1, bicep2, chest1, chest2, leg1, leg2, leg3] = await getAllActivities();

    const routineActivitiesToCreate = [
      { routineId: bicepRoutine.id, activityId: bicep1.id, count: 10, duration: 5 },
      { routineId: bicepRoutine.id, activityId: bicep2.id, count: 10, duration: 8 },
      { routineId: chestRoutine.id, activityId: chest1.id, count: 10, duration: 8 },
      { routineId: chestRoutine.id, activityId: chest2.id, count: 10, duration: 7 },
      { routineId: legRoutine.id, activityId: leg1.id, count: 10, duration: 9 },
      { routineId: legRoutine.id, activityId: leg2.id, count: 10, duration: 10 },
      { routineId: legRoutine.id, activityId: leg3.id, count: 10, duration: 7 },
      { routineId: cardioRoutine.id, activityId: leg2.id, count: 10, duration: 10 },
      { routineId: cardioRoutine.id, activityId: leg3.id, count: 10, duration: 15 },
    ];
    const routineActivities = await Promise.all(routineActivitiesToCreate.map(addActivityToRoutine));
    console.log("routine_activities: ", routineActivities);
    console.log("...(๑•̀ㅂ•́)ง✧ routine_activities created!");
  } catch (error) {
    console.error("Error creating routine_activities");
    throw error;
  }
}


async function testDB() {
  console.log('\n\nლ༼>╭ ͟ʖ╮<༽ლ ... TESTING DATABASE ... ლ༼>╭ ͟ʖ╮<༽ლ');

}


async function rebuildDB() {
  try {
    client.connect();
    await dropTables()
    await createTables()
    await createInitialUsers()
    await createInitialActivities()
    await createInitialRoutines()
    await createInitialRoutineActivities()
    await testDB();
    client.end();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB();