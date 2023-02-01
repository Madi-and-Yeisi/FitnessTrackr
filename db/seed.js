const { client } = require('./index');

// db functions 
const { createUser } = require('./users.js');
const { createActivity } = require('./activities.js');
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
      // arms and shoulders
      { name: "Bicep Curl", description: "Hold a dumbbell with your palm facing upward, slowly curl the weight up by bending your elbow, keeping your elbow close to your body. Then slowly lower the weight to the starting position", imageUrl: "https://gethealthyu.com/wp-content/uploads/2014/08/Bicep-Curl_Exercise.jpg" },
      { name: "Lateral Raises", description: "Stand tall with your feet between hip and shoulder-width apart. Slowly, without any kind of hip, torso, or leg movement, raise the dumbbells out to each side, not above shoulder level. Slowly bring the weights back to just short of starting position.", imageUrl: "https://www.verywellfit.com/thmb/gtxAQHluqGFoFoLUdQmcXhvYAEI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/61-4588211-dumbell-Lateral-side-Raise-GIF-7858592bcda347a9adf46886c5106e73.gif" },
      { name: "Shoulder Press", description: "Feet shoulder-width apart, hold dumbbells at shoulder height. Lift the dumbbells overhead, then lower them slowly", imageUrl: "https://cdn.shopify.com/s/files/1/1497/9682/articles/1_71d97192-f77f-47fa-a059-87456a2c1fb1.jpg?v=1647872386" },
      { name: "Push Ups", description: "Straighten your arms and legs on all fours, place hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor, pause, then push yourself back up.", imageUrl: "https://www.aleanlife.com/wp-content/uploads/2020/09/poor-form-push-up.gif"},
      { name: "Tricep Dips", description: "Sit on edge of stable chair or weight bench, extend legs with feet hips-width apart, look straight ahead with chin up. Grip edge and lift body to slide forward to clear the edge. Lower yourself until elbows are bent between 45 to 90 degrees, control the movement throughout. Push yourself up slowly until arms are almost straight.", imageUrl: "https://www.sparkpeople.com/assets/exercises/Triceps-Dips-with-Straight-Legs.gif" },
      { name: "Overhead Triceps Extension", description: "Stand with a weight grasped overhead. Keep your core and shoulders stable. Slowly lower the weight behind your back, then return and repeat.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/09/HL-01.07c.OverheadTricepsExtensionWithDumbbells.gif?h=840" },
      
      // legs
      { name: "Squats", description: "Stand with your feet shoulder-width apart, toes slightly out, core braced, and chest up. Squat — hips back, knees bent, ensuring they fall out, not in. Pause when your thighs reach about parallel to the ground. Push through your entire foot to return to start", imageUrl: "https://srosm.com/uploads/squatting.jpg" },
      { name: "Treadmill", description: "Running, indoors. Strike the belt with the ball of your feet, not your heels, well ahead of your body's center of gravity. Also, keep your feet under your body, not behind or ahead of it. Avoid short, choppy strides and do your best to run with your natural form.", imageUrl: "" },
      { name: "Stair Climbing", description: "Stair climbing engages your body's largest muscle groups to repeatedly lift your body weight up, step after step.", imageUrl: "" },
      { name: "Jumping Jacks", description: "Jumping jacks work your whole body. This includes shoulders, hearts, lungs, core, hip flexors, and glutes.", imageUrl: "https://www.icegif.com/wp-content/uploads/icegif-134.gif" },
      { name: "Glute Bridge", description: "Lie on back with knees bent, feet flat on the floor, and arms down at sides. Inhale and push through all four corners of your feet, engaging your core, glutes, and hamstrings to press your hips toward the ceiling. Pause at the top, then slowly release back to the starting position.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_How_to_Get_Rid_of_Hip_Dips_Glute_Bridges.gif?h=840" },

      // core 
      { name: "Plank", description: "Position elbows directly under shouldrs and rest forearms on ground. Get up on toes, keeping body in a straight line. Engage core - think of pulling belly button to ceiling, firing glutes and quads, and focusing on keeping weight distributed evenly throughout body", imageUrl: "https://www.shape.com/thmb/T2GyvzFah3XYR8_L8W16ANWBTXs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/low-plank-hold-b8a63da1ef844f00b6f6a21141ba1d87.jpg" },
      { name: "Russian Twist", description: "Lift feet from floor keeping knees bent, elongate and straighten spine at 45 degree angle from floor creating a V shape with torso and thighs. Reach arms straight out in front, interlace fingers or clasp hands together. Use your abdominals to twist to the right, the back to center, and then to the left.", imageUrl: "https://cdn.greatlifepublishing.net/wp-content/uploads/sites/2/2015/12/21162916/russiantwist.gif" },
      { name: "Bicycle Crunches", description: "Raise your knees to a 90-degree angle and alternate extending your legs as if pedaling a bike. Twist your body to touch your elbow to the opposite knee with each pedal motion", imageUrl: "https://bod-blog-assets.prod.cd.beachbodyondemand.com/bod-blog/wp-content/uploads/2017/10/bb_bicycle-crunch.jpg" },

      // stretches
      { name: "Cat - Cow", description: "Hands shoulder-width apart and knees directly below hips. Inhale deeply to cow. Exhale deeply to cat", imageUrl: "https://media1.popsugar-assets.com/files/thumbor/Ed_FiTrnwdhWIR1HP7WF4uAK0js/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2021/12/02/674/n/1922729/tmp_tdb0lt_63abb2d201fb98ce_Cat-Cow.jpeg" },
      { name: "Cobra", description: "Lie on your stomach, toes pointing straight back, hands underneath the shoulders, elbows close to the body. Legs engaged, pull the belly in and up. As you inhale, lift your chest from the back of your heart. Roll the collarbones up and firm the shoulder blades into the upper back, slightly down along the spine.", imageUrl: "https://www.yogajournal.com/wp-content/uploads/2007/08/Cobra-Pose_Andrew-Clark.gif" },
      { name: "Warrior I", description: "Step forward with foot parallel and toes pointing to the top of mat, bend knee into lunge. Keep back leg straight behind you and turn heel slightly. Raise arms straight above head keeping shoulders pressed down. Squeeze shoulderblades together and downward, lift chin to gaze at hands.", imageUrl: "https://www.ekhartyoga.com/media/images/articles/content/Warrior-1-Pose-Virabhadrasana-1-Ekhart-Yoga.jpg" },
      { name: "Warrior II", description: "Front knee bends to create a stretch in your hips, your arms engage and extend straight out from your shoulder and your gaze is toward your front hand.", imageUrl: "https://www.ekhartyoga.com/media/images/articles/content/Warrior-2-yoga-pose-Virabhadrasana-II-Ekhart-Yoga.jpg" },
      
      // { name: "", description: "", imageUrl: "" },

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
      { creatorId: 1, isPublic: true, name: "Quick Weekday Morning Yoga", goal: "Start your weekday right. Focus on back, neck, and shoulders - great for desk workers!" },
      { creatorId: 1, isPublic: true, name: "Leg Day", goal: "Running, stairs, squats" },
      { creatorId: 2, isPublic: false, name: "My Nightly Routine", goal: "Relaxing yoga and tiring workouts" },
      { creatorId: 2, isPublic: true, name: "Arm Day", goal: "Never lose an arm wrestling contest. Work the Back and Biceps." },
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
    const [morningYogaRoutine, legRoutine, nightlyRoutine, armRoutine] = await getRoutinesWithoutActivities();

    const routineActivitiesToCreate = [
      { routineId: armRoutine.id, activityId: 1, count: 30, duration: 120 },
      { routineId: armRoutine.id, activityId: 2, count: 20, duration: 80 },
      { routineId: armRoutine.id, activityId: 6, count: 20, duration: 60 },
      { routineId: armRoutine.id, activityId: 3, count: 10, duration: 40 },
      { routineId: armRoutine.id, activityId: 4, count: 10, duration: 50 },
      { routineId: armRoutine.id, activityId: 5, count: 10, duration: 45 },
      
      { routineId: morningYogaRoutine.id, activityId: 15, count: 10, duration: 5 },
      { routineId: morningYogaRoutine.id, activityId: 16, count: 5, duration: 50 },

      { routineId: legRoutine.id, activityId: 7, count: 50, duration: 250 },
      { routineId: legRoutine.id, activityId: 8, count: 2, duration: 20 },
      { routineId: legRoutine.id, activityId: 9, count: 1, duration: 10 },
      { routineId: legRoutine.id, activityId: 10, count: 200, duration: 100 },
      { routineId: legRoutine.id, activityId: 11, count: 20, duration: 60 },

      { routineId: nightlyRoutine.id, activityId: 17, count: 3, duration: 30 },
      { routineId: nightlyRoutine.id, activityId: 18, count: 3, duration: 30 },
      { routineId: nightlyRoutine.id, activityId: 12, count: 2, duration: 60 },
      { routineId: nightlyRoutine.id, activityId: 7, count: 35, duration: 105 },

    ];
    const routineActivities = await Promise.all(routineActivitiesToCreate.map(addActivityToRoutine));
    console.log("routine_activities: ", routineActivities);
    console.log("...(๑•̀ㅂ•́)ง✧ routine_activities created!");
  } catch (error) {
    console.error("Error creating routine_activities");
    throw error;
  }
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
    client.end();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB();