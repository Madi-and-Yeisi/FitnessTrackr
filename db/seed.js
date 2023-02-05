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
  console.log("\n(˵ ͡° ͜ʖ ͡°˵) creating initial users...")
  try {
    const usersToCreate = [
      { username: "spiderman", password: "leapoffaith" },
      { username: "wentworth", password: "willnotcount" },
      { username: "PARV", password: "blackwidowbrigade" },
      { username: "Taylor13", password: "kingofmyheart" },
      { username: "hozie", password: "cherrywine" },
      { username: "c_yang", password: "yourethesun" },
      { username: "McDreamy", password: "chasingcars" },
      { username: "fleabag", password: "claireitsfrench" },
      { username: "villanelle", password: "deservedbetter" },
      { username: "evelyn_hugo", password: "deathbyathousandcuts" },
      { username: "anyatjoy", password: "kissmeplease" },
      { username: "CFields", password: "gamechanger" },
      { username: "bostonROB", password: "therobfather" }
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
      { name: "Bicep Curl", description: "Hold a dumbbell with your palm facing upward, slowly curl the weight up by bending your elbow, keeping your elbow close to your body. Then slowly lower the weight to the starting position", imageUrl: "https://post.greatist.com/wp-content/uploads/sites/2/2020/09/GRT-1.11-.DB-Curls.gif" },
      { name: "Lateral Raises", description: "Stand tall with your feet between hip and shoulder-width apart. Slowly, without any kind of hip, torso, or leg movement, raise the dumbbells out to each side, not above shoulder level. Slowly bring the weights back to just short of starting position.", imageUrl: "https://thumbs.gfycat.com/RevolvingCloseGreatdane-size_restricted.gif" },
      { name: "Shoulder Press", description: "Feet shoulder-width apart, hold dumbbells at shoulder height. Lift the dumbbells overhead, then lower them slowly", imageUrl: "https://thumbs.gfycat.com/FluffyCarefulBaboon-size_restricted.gif" },
      { name: "Push Ups", description: "Straighten your arms and legs on all fours, place hands slightly wider than shoulders. Lower your body until your chest nearly touches the floor, pause, then push yourself back up.", imageUrl: "https://www.aleanlife.com/wp-content/uploads/2020/09/poor-form-push-up.gif"},
      { name: "Tricep Dips", description: "Sit on edge of stable chair or weight bench, extend legs with feet hips-width apart, look straight ahead with chin up. Grip edge and lift body to slide forward to clear the edge. Lower yourself until elbows are bent between 45 to 90 degrees, control the movement throughout. Push yourself up slowly until arms are almost straight.", imageUrl: "https://images.squarespace-cdn.com/content/v1/5b569d057c93278cd993848b/1560460761126-2YVBOZRQ9GKQ9JNFCWG0/BY+NEST_Shape_Tricep_Dip.gif" },
      { name: "Overhead Triceps Extension", description: "Stand with a weight grasped overhead. Keep your core and shoulders stable. Slowly lower the weight behind your back, then return and repeat.", imageUrl: "https://post.greatist.com/wp-content/uploads/sites/2/2020/09/ticep-extension.gif" },
      { name: "Plank Tap", description: "Get into the high plank position with your hands below your shoulders on the floor and your arms straight. Keep your head, shoulders, hips, and knees aligned while keeping your core tight. Then bring one hand up and tap the opposite shoulder.", imageUrl: "https://post.greatist.com/wp-content/uploads/sites/2/2020/09/planktap.gif" },
      { name: "Triceps Kickback", description: "Bend forward at the waist, engage your core, keep your head, neck, and spine in one line. On an exhale, engage your triceps as you slowly extend your arm back as far as you can, keeping your arm in tight by your side.", imageUrl: "https://post.greatist.com/wp-content/uploads/sites/2/2020/11/GRT-1.12.-Tricep-Kick-backs.gif" },
      { name: "Kettlebell Swing", description: "Hold a kettlebell in front of body with both hands, arms straight. With slight bend in knees and flat back, hinge at your hips and swing the kettlebell back through legs. Use that momentum to stand and swing the kettlebell out in front of body, up to shoulder height.", imageUrl: "https://post.greatist.com/wp-content/uploads/sites/2/2020/05/4.15.KBSwing.gif" },
      { name: "Arm Circles", description: "Stand with feet shoulder-width apart and extend arms parallel to floor. Circle your arms forward using small controlled motions, gradually making the circles bigger until you feel a stretch in triceps.", imageUrl: "https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/11/400x400_The_Benefits_of_Dynamic_Stretching_and_How_to_Get_Started_Arm_Circles.gif" },

      // legs 11
      { name: "Squats", description: "Stand with your feet shoulder-width apart, toes slightly out, core braced, and chest up. Squat — hips back, knees bent, ensuring they fall out, not in. Pause when your thighs reach about parallel to the ground. Push through your entire foot to return to start", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/400x400_24_Standing_Ab_Exercises_to_Strengthen_and_Define_Your_Core_Squat.gif?h=840" },
      { name: "Treadmill", description: "Running, indoors. Strike the belt with the ball of your feet, not your heels, well ahead of your body's center of gravity. Also, keep your feet under your body, not behind or ahead of it. Avoid short, choppy strides and do your best to run with your natural form.", imageUrl: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/using-a-machine-to-become-one-royalty-free-image-960249252-1561543819.jpg?crop=0.668xw:1.00xh;0.332xw,0&resize=1200:*" },
      { name: "Stair Climbing", description: "Stair climbing engages your body's largest muscle groups to repeatedly lift your body weight up, step after step.", imageUrl: "https://i.imgur.com/7ciyFGc.jpg" },
      { name: "Jumping Jacks", description: "Jumping jacks work your whole body. This includes shoulders, hearts, lungs, core, hip flexors, and glutes.", imageUrl: "https://www.icegif.com/wp-content/uploads/icegif-134.gif" },
      { name: "Glute Bridge", description: "Lie on back with knees bent, feet flat on the floor, and arms down at sides. Inhale and push through all four corners of your feet, engaging your core, glutes, and hamstrings to press your hips toward the ceiling. Pause at the top, then slowly release back to the starting position.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_How_to_Get_Rid_of_Hip_Dips_Glute_Bridges.gif?h=840" },
      { name: "Walking Lunges", description: "Stand up straight with feet shoulder-width apart. Step forward with right leg putting your weight into your heel. Bend right knee, lowering down parallel to floor in lunge position, pause. Without moving right leg, move left leg forward repeating movements, walking forward as you lunge, alternating legs.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_Butt_Cellulite-Exercises_Walking_Lunge.gif?h=840" },
      { name: "Reverse Lunge", description: "Step backward with one of your legs, bend back leg so your back knee nearly touches the ground and your front knee so your thigh is about parallel to the ground. Your front, planted leg is the one that will be working.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_Alternatives_to_Leg_Extension_Exercises_Reverse_Lunges.gif?h=840" },
      { name: "Lateral Lunge", description: "Stand with feet hip-width apart. Take a big step to the side and bend knee, push hips back and lower knee to about 90 degress. Push back to start.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_Cellulite_Busting_Routine_Lateral_Lunge.gif?h=840" },
      { name: "Hip Thrust", description: "Using the strength of your gluteal muscles, push through your heels and raise your hips upward until your entire body is in a straight line.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_24_Standing_Ab_Exercises_to_Strengthen_and_Define_Your_Core_Hip_Thrust.gif?h=840" },
      { name: "Romanian Deadlift", description: "Stand behind a grounded barbell. Bend your knees slightly to grab it, keeping your shins, back and hips straight. Without bending your back, push your hips forwards to lift the bar. From upright, push your hips back to lower the bar, bending your knees only slightly.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/02/400x400_What_Muscles_Do_Deadlifts_Work_Romanian_Dead_Lift.gif?h=840" },
      { name: "Donkey Kicks", description: "Get on all fours, with your hands directly under shoulders. Make sure your back is flat and tuck your chin slightly. Without rounding spine, engage lower abdominals. Keeping 90 degree bend in knee, slowly lift leg straight back and up toward ceiling. Stop before your back starts to arch or your hips begin to rotate. Return to starting position.", imageUrl: "https://i0.wp.com/images-prod.healthline.com/hlcmsresource/images/topic_centers/Fitness-Exercise/400x400_Donkey_Kick_Exercises_Donkey_Kick.gif?w=1155&h=840" },
      { name: "Clamshells", description: "Lie on one side with knees at 45 degree angle, legs and hips stacked. Contract abdominal muscles to stabilize core. Keep feet in contact with one another as you raise your upper knee as high as you can, without moving the hips or pelvis. Don't allow lower leg to move off floor.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/400x400_The_Pilates_Exercises_that_Worked_Wonders_on_My_Pregnancy_Back_Pain_Clamshells.gif?h=840" },
      { name: "Side-lying Hip Abduction", description: "Lie on side with legs extended and hips stacked. Bend bottom elbow and rest head on forearm so its in line with vertebrae. Raise your upper leg to just above your hip join, stop and hold, slowly lower.", imageUrl: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2021/04/400x400_Ankle_Weights_Side_Lying_Hip_Abduction.gif?h=840" },

      // core 24
      { name: "Plank", description: "Position elbows directly under shouldrs and rest forearms on ground. Get up on toes, keeping body in a straight line. Engage core - think of pulling belly button to ceiling, firing glutes and quads, and focusing on keeping weight distributed evenly throughout body", imageUrl: "https://www.shape.com/thmb/T2GyvzFah3XYR8_L8W16ANWBTXs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/low-plank-hold-b8a63da1ef844f00b6f6a21141ba1d87.jpg" },
      { name: "Russian Twist", description: "Lift feet from floor keeping knees bent, elongate and straighten spine at 45 degree angle from floor creating a V shape with torso and thighs. Reach arms straight out in front, interlace fingers or clasp hands together. Use your abdominals to twist to the right, the back to center, and then to the left.", imageUrl: "https://cdn.greatlifepublishing.net/wp-content/uploads/sites/2/2015/12/21162916/russiantwist.gif" },
      { name: "Bicycle Crunches", description: "Raise your knees to a 90-degree angle and alternate extending your legs as if pedaling a bike. Twist your body to touch your elbow to the opposite knee with each pedal motion", imageUrl: "https://thumbs.gfycat.com/CheapMadeupLeafhopper-max-1mb.gif" },
      { name: "Crunches", description: "Lie face up, place hands on floor by side. Inhale, contract your abs toward your spine. Exhale and lift your feet off the floor and raise your knees upward and inward toward your chest, keeping knees at 90 degree angle. ", imageUrl: "https://post.healthline.com/wp-content/uploads/2020/10/400x400_Exercises_That_Help_You_Get_V_Reverse_Crunches.gif" },
      { name: "Sit Ups", description: "Lie face up with arms extended past head. Bend knees and have soles of feet facing one another in a diamond shape. Crunch your abs to a sitting position as you reach forward with both hands to your feet. Slowly lower back to starting position.", imageUrl: "https://thumbs.gfycat.com/JollyGiantAfricanaugurbuzzard-size_restricted.gif" },
      { name: "Bird Dog Exercise", description: "Draw shoulder blades together. Raise right arm and left leg, keeping shoulders and hips parallel to floor. Lengthen the back of neck and tuck chin into chest to gaze down at floor. Hold position for a few seconds then lower to starting position.", imageUrl: "https://i0.wp.com/thumbs.gfycat.com/InsignificantPerkyInvisiblerail-size_restricted.gif?w=1155&h=844" },
      { name: "Side Plank", description: "Lie on side with body fully extended. lift body off ground and balance weight between the forearm or hand and the side of the foot. Keep body in a straight line.", imageUrl: "https://www.ekhartyoga.com/media/images/articles/content/Side-plank-pose-Vasisthasana-Ekhart-Yoga.jpg" },

      // stretches 31
      { name: "Cat/Cow", description: "Hands shoulder-width apart and knees directly below hips. Inhale deeply to cow. Exhale deeply to cat", imageUrl: "https://media.tenor.com/-wXXHLdS4nYAAAAM/workout-working-out.gif" },
      { name: "Tree ", description: "Stand on one leg with the foot of the other leg pressed against the inner thigh of the standing leg. The hands are stretched upward with the palms touching.", imageUrl: "https://i.imgur.com/vTuzmPf.png" },
      { name: "Cobra", description: "Lie on your stomach, toes pointing straight back, hands underneath the shoulders, elbows close to the body. Legs engaged, pull the belly in and up. As you inhale, lift your chest from the back of your heart. Roll the collarbones up and firm the shoulder blades into the upper back, slightly down along the spine.", imageUrl: "https://www.ekhartyoga.com/media/images/articles/content/Cobra-pose-Bhujangasana-Esther-Ekhart.jpg" },
      { name: "Triangle", description: "Engage your right thigh muscles and drawa your right femur into its socket. Extend your right hand toward the front of the room, keeping right hip tucked. Lower right hand down, onto shin, ankle, or floor. Left shoulder stacks on top of the right one as you open your chest, reaching left fingertips toward the ceiling. Turn head to gaze up toward left fingertips.", imageUrl: "https://i.imgur.com/ggRtv5X.png" },
      { name: "Warrior I", description: "Step forward with foot parallel and toes pointing to the top of mat, bend knee into lunge. Keep back leg straight behind you and turn heel slightly. Raise arms straight above head keeping shoulders pressed down. Squeeze shoulderblades together and downward, lift chin to gaze at hands.", imageUrl: "https://i.imgur.com/1JfZh24.jpg" },
      { name: "Warrior II", description: "Front knee bends to create a stretch in your hips, your arms engage and extend straight out from your shoulder and your gaze is toward your front hand.", imageUrl: "https://i.imgur.com/4KtdGUD.jpg" },
      { name: "Downward-Facing Dog", description: "Head down, ultimately touching the floor, with the weight of the body on the palms and the feet. Arms stretched straight forward, shoulder width apart; the feet are a foot apart, the legs are straight, and the hips are raised as high as possible.", imageUrl: "https://i.imgur.com/mUwupam.png" },
      { name: "Mountain Pose", description: "Stand upright with your feet facing forward parallel to each other and your arms at your sides.", imageUrl: "https://i.imgur.com/BdKPRxb.png" },
      { name: "Child's Pose", description: "Kneel and sit on your knees. Lean forward, keeping your buttocks on your heels, and rest your forehead on the floor. Move your arms so they're next to your legs, palms facing up - or stretched in front, palms facing down.", imageUrl: "https://www.ekhartyoga.com/media/images/articles/content/Childs-pose-Balasana-Ekhart-Yoga.jpg" },

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
      { creatorId: 1, isPublic: true, name: "Daily Arm Workout", goal: "Strengthen the muscles in the arms and shoulders, never lose an arm wrestling contest." },
      { creatorId: 2, isPublic: true, name: "Leg Day", goal: "Running, stairs, squats" },
      { creatorId: 3, isPublic: false, name: "My Nightly Routine", goal: "Relaxing yoga and tiring workouts, just for me." },
      { creatorId: 3, isPublic: true, name: "Quick Weekday Morning Yoga", goal: "Start your weekday right. Focus on back, neck, and shoulders - great for desk workers!" },
      { creatorId: 4, isPublic: true, name: "Full Body INTENSE Workout", goal: "Train every muscle in your body until you're not be able to move the next day." },
      { creatorId: 5, isPublic: true, name: "Cardio and Endurance", goal: "Build your lung capacity and persevere." },
      { creatorId: 6, isPublic: true, name: "my washboard abs routine", goal: "don't stop at a six pack, don't stop until your stomach is rock hard" },
      { creatorId: 8, isPublic: true, name: "Evening Cool Down", goal: "Relax and unwind while expending that last bit of energy for the day." },
      { creatorId: 7, isPublic: true, name: "Monthly Leg Workout", goal: "Everybody knows you don't really need to work out your legs! Just do this every few weeks and then forget about them." },
      { creatorId: 9, isPublic: true, name: "ULTIMATE Core Routine", goal: "Not for the weak!" },
      { creatorId: 10, isPublic: true, name: "Big Booty Bonanza!", goal: "Bulk up your glutes with this intense workout." },
      { creatorId: 11, isPublic: true, name: "Arm Day", goal: "Tone up those arm, shoulder, and back muscles!" },
      { creatorId: 12, isPublic: true, name: "morning routine", goal: "start the day right" },
      { creatorId: 13, isPublic: true, name: "Daily Health and Wellness Routine", goal: "Focuses on natural movements and mobility to build muscle and maintain body health." },
      { creatorId: 7, isPublic: true, name: "Bicep and Tricep BULK UP", goal: "Build bigger arms - the most important muscles are the ones on display everyday. Get that sleeve-bursting pump." },
      { creatorId: 10, isPublic: true, name: "Beginner Full Body", goal: "The most important thing is to start, just do what you can and trust yourself. Get moving!" },
      { creatorId: 8, isPublic: true, name: "M/W/F", goal: "Part of my every-other-weekday workout routines. Monday, wednesday, friday workout (more intense than tuesday thursday)" },
      { creatorId: 8, isPublic: true, name: "T/TH", goal: "Part of my every-other-weekday workout routines. Tuesday, thursday workout (lighter than MWF, recover but keep moving and keep the habit alive!)" },
      { creatorId: 2, isPublic: true, name: "Wake up right", goal: "^^^" },
      { creatorId: 1, isPublic: true, name: "Full Body Every Other Day", goal: "Keep your whole body strong and active" },
      { creatorId: 3, isPublic: true, name: "My Perfect Morning Routine", goal: "Mainly yoga and stretches with some light strength training to boost your morning" },
      { creatorId: 4, isPublic: true, name: "INTENSE LEGS WORKOUT", goal: "You're gonna need a wheelchair tomorrow" },
      { creatorId: 5, isPublic: true, name: "Quick wake me up", goal: "Short but sweet workout to get the blood pumping" },
      { creatorId: 6, isPublic: true, name: "daily get moving routine", goal: "excercises for getting your full body moving" },
      { creatorId: 11, isPublic: true, name: "Glutes Day", goal: "Workouts for maximum gluteus maximus" },

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
  console.log("\n	[¬º-°]¬ creating initial routine_activities...");
  try {
    const [dailyArmWorkout, legDay, nightlyRoutine, quickMorningYoga, fullBodyIntense, cardioEndurance, washboardAbs, eveningCoolDown, monthlyLeg, ultimateCore, bigBooty, armDay, morning, dailyHealth, bicepTricep, beginner, mwf, tth, wakeUpRight, fullBodyEveryOther, perfectMorning, intenseLegs, quickWakeMeUp, dailyGetMoving, glutesDay ] = await getRoutinesWithoutActivities();

    const routineActivitiesToCreate = [
      { routineId: dailyArmWorkout.id, activityId: 9, count: 30, duration: 60 },
      { routineId: dailyArmWorkout.id, activityId: 1, count: 20, duration: 80 },
      { routineId: dailyArmWorkout.id, activityId: 6, count: 20, duration: 60 },
      { routineId: dailyArmWorkout.id, activityId: 3, count: 10, duration: 40 },
      { routineId: dailyArmWorkout.id, activityId: 4, count: 10, duration: 50 },
      { routineId: dailyArmWorkout.id, activityId: 5, count: 10, duration: 45 },

      { routineId: legDay.id, activityId: 11, count: 50, duration: 250 },
      { routineId: legDay.id, activityId: 12, count: 2, duration: 20 },
      { routineId: legDay.id, activityId: 13, count: 1, duration: 10 },
      { routineId: legDay.id, activityId: 21, count: 40, duration: 120 },
      { routineId: legDay.id, activityId: 19, count: 20, duration: 60 },

      { routineId: nightlyRoutine.id, activityId: 35, count: 3, duration: 30 },
      { routineId: nightlyRoutine.id, activityId: 36, count: 3, duration: 30 },
      { routineId: nightlyRoutine.id, activityId: 39, count: 2, duration: 60 },
      { routineId: nightlyRoutine.id, activityId: 11, count: 35, duration: 105 },

      { routineId: quickMorningYoga.id, activityId: 31, count: 10, duration: 5 },
      { routineId: quickMorningYoga.id, activityId: 33, count: 5, duration: 50 },
      { routineId: quickMorningYoga.id, activityId: 34, count: 4, duration: 40 },
      { routineId: quickMorningYoga.id, activityId: 38, count: 1, duration: 30 },

      { routineId: fullBodyIntense.id, activityId: 11, count: 100, duration: 300 },
      { routineId: fullBodyIntense.id, activityId: 4, count: 30, duration: 45 },
      { routineId: fullBodyIntense.id, activityId: 28, count: 40, duration: 60 },
      { routineId: fullBodyIntense.id, activityId: 14, count: 300, duration: 300 },
      { routineId: fullBodyIntense.id, activityId: 10, count: 50, duration: 25 },
      { routineId: fullBodyIntense.id, activityId: 16, count: 20, duration: 40 },
      { routineId: fullBodyIntense.id, activityId: 1, count: 35, duration: 70 },
      { routineId: fullBodyIntense.id, activityId: 13, count: 1, duration: 15 },
      { routineId: fullBodyIntense.id, activityId: 6, count: 35, duration: 70 },
      { routineId: fullBodyIntense.id, activityId: 27, count: 60, duration: 60 },

      { routineId: cardioEndurance.id, activityId: 12, count: 1, duration: 45 },
      { routineId: cardioEndurance.id, activityId: 13, count: 1, duration: 10 },
      { routineId: cardioEndurance.id, activityId: 14, count: 200, duration: 200 },

      { routineId: washboardAbs.id, activityId: 24, count: 2, duration: 30 },
      { routineId: washboardAbs.id, activityId: 25, count: 20, duration: 20 },
      { routineId: washboardAbs.id, activityId: 30, count: 20, duration: 40 },
      { routineId: washboardAbs.id, activityId: 29, count: 2, duration: 30 },
      { routineId: washboardAbs.id, activityId: 26, count: 30, duration: 30 },
      { routineId: washboardAbs.id, activityId: 27, count: 25, duration: 50 },

      { routineId: eveningCoolDown.id, activityId: 32, count: 2, duration: 40 },
      { routineId: eveningCoolDown.id, activityId: 2, count: 1, duration: 10 },
      { routineId: eveningCoolDown.id, activityId: 27, count: 30, duration: 60 },

      { routineId: monthlyLeg.id, activityId: 17, count: 10, duration: 40 },
      { routineId: monthlyLeg.id, activityId: 19, count: 20, duration: 30 },
      { routineId: monthlyLeg.id, activityId: 20, count: 5, duration: 50 },
      { routineId: monthlyLeg.id, activityId: 21, count: 25, duration: 65 },
      { routineId: monthlyLeg.id, activityId: 22, count: 30, duration: 60 },
      
      { routineId: ultimateCore.id, activityId: 26, count: 45, duration: 90 },
      { routineId: ultimateCore.id, activityId: 28, count: 20, duration: 40 },
      { routineId: ultimateCore.id, activityId: 30, count: 2, duration: 110 },
      { routineId: ultimateCore.id, activityId: 31, count: 25, duration: 65 },
      { routineId: ultimateCore.id, activityId: 7, count: 16, duration: 60 },
      { routineId: ultimateCore.id, activityId: 9, count: 40, duration: 40 },
      { routineId: ultimateCore.id, activityId: 14, count: 200, duration: 100 },
      { routineId: ultimateCore.id, activityId: 27, count: 60, duration: 120 },
      { routineId: ultimateCore.id, activityId: 24, count: 1, duration: 75 },
      { routineId: ultimateCore.id, activityId: 29, count: 22, duration: 80 },

      { routineId: bigBooty.id, activityId: 15, count: 25, duration: 55 },
      { routineId: bigBooty.id, activityId: 11, count: 75, duration: 200 },
      { routineId: bigBooty.id, activityId: 17, count: 15, duration: 60 },
      { routineId: bigBooty.id, activityId: 19, count: 15, duration: 90 },
      { routineId: bigBooty.id, activityId: 20, count: 30, duration: 60 },
      { routineId: bigBooty.id, activityId: 21, count: 10, duration: 50 },
      { routineId: bigBooty.id, activityId: 22, count: 35, duration: 70 },

      { routineId: armDay.id, activityId: 2, count: 30, duration: 60 },
      { routineId: armDay.id, activityId: 3, count: 20, duration: 45 },
      { routineId: armDay.id, activityId: 6, count: 25, duration: 50 },
      { routineId: armDay.id, activityId: 8, count: 40, duration: 60 },
      { routineId: armDay.id, activityId: 9, count: 15, duration: 75 },
      { routineId: armDay.id, activityId: 10, count: 65, duration: 130 },

      { routineId: morning.id, activityId: 38, count: 1, duration: 60 },
      { routineId: morning.id, activityId: 12, count: 2, duration: 30 },
      { routineId: morning.id, activityId: 7, count: 20, duration: 40 },
      { routineId: morning.id, activityId: 26, count: 25, duration: 50 },

      { routineId: dailyHealth.id, activityId: 35, count: 5, duration: 50 },
      { routineId: dailyHealth.id, activityId: 36, count: 5, duration: 50 },
      { routineId: dailyHealth.id, activityId: 29, count: 15, duration: 60 },
      { routineId: dailyHealth.id, activityId: 26, count: 35, duration: 95 },
      { routineId: dailyHealth.id, activityId: 10, count: 65, duration: 130 },
      { routineId: dailyHealth.id, activityId: 13, count: 2, duration: 10 },
      { routineId: dailyHealth.id, activityId: 18, count: 20, duration: 80 },
      { routineId: dailyHealth.id, activityId: 31, count: 20, duration: 120 },

      { routineId: bicepTricep.id, activityId: 1, count: 50, duration: 100 },
      { routineId: bicepTricep.id, activityId: 5, count: 30, duration: 90 },
      { routineId: bicepTricep.id, activityId: 4, count: 45, duration: 100 },
      { routineId: bicepTricep.id, activityId: 2, count: 40, duration: 80 },
      { routineId: bicepTricep.id, activityId: 6, count: 55, duration: 125 },
      { routineId: bicepTricep.id, activityId: 8, count: 35, duration: 110 },

      { routineId: beginner.id, activityId: 11, count: 30, duration: 60 },
      { routineId: beginner.id, activityId: 1, count: 20, duration: 60 },
      { routineId: beginner.id, activityId: 27, count: 20, duration: 40 },
      { routineId: beginner.id, activityId: 15, count: 15, duration: 45 },
      { routineId: beginner.id, activityId: 6, count: 15, duration: 30 },
      { routineId: beginner.id, activityId: 24, count: 1, duration: 35 },
      { routineId: beginner.id, activityId: 18, count: 10, duration: 50 },

      { routineId: mwf.id, activityId: 31, count: 10, duration: 100 },
      { routineId: mwf.id, activityId: 11, count: 55, duration: 160 },
      { routineId: mwf.id, activityId: 1, count: 20, duration: 60 },
      { routineId: mwf.id, activityId: 25, count: 30, duration: 60 },
      { routineId: mwf.id, activityId: 38, count: 3, duration: 30 },
      { routineId: mwf.id, activityId: 15, count: 15, duration: 45 },
      { routineId: mwf.id, activityId: 2, count: 20, duration: 60 },
      { routineId: mwf.id, activityId: 24, count: 1, duration: 45 },
      { routineId: mwf.id, activityId: 21, count: 20, duration: 80 },
      { routineId: mwf.id, activityId: 6, count: 15, duration: 60 },

      { routineId: tth.id, activityId: 31, count: 10, duration: 100 },
      { routineId: tth.id, activityId: 11, count: 35, duration: 100 },
      { routineId: tth.id, activityId: 1, count: 20, duration: 60 },
      { routineId: tth.id, activityId: 25, count: 16, duration: 60 },
      { routineId: tth.id, activityId: 15, count: 10, duration: 30 },
      { routineId: tth.id, activityId: 2, count: 10, duration: 30 },

      { routineId: wakeUpRight.id, activityId: 39, count: 3, duration: 30 },
      { routineId: wakeUpRight.id, activityId: 3, count: 20, duration: 60 },
      { routineId: wakeUpRight.id, activityId: 17, count: 30, duration: 120 },
      { routineId: wakeUpRight.id, activityId: 26, count: 40, duration: 60 },
      { routineId: wakeUpRight.id, activityId: 1, count: 15, duration: 45 },
      { routineId: wakeUpRight.id, activityId: 6, count: 20, duration: 60 },

      { routineId: fullBodyEveryOther.id, activityId: 25, count: 30, duration: 40 },
      { routineId: fullBodyEveryOther.id, activityId: 11, count: 60, duration: 140 },
      { routineId: fullBodyEveryOther.id, activityId: 4, count: 10, duration: 40 },
      { routineId: fullBodyEveryOther.id, activityId: 22, count: 30, duration: 60 },
      { routineId: fullBodyEveryOther.id, activityId: 9, count: 40, duration: 60 },
      { routineId: fullBodyEveryOther.id, activityId: 27, count: 20, duration: 35 },
      { routineId: fullBodyEveryOther.id, activityId: 2, count: 30, duration: 45 },
      { routineId: fullBodyEveryOther.id, activityId: 3, count: 15, duration: 45 },

      { routineId: perfectMorning.id, activityId: 32, count: 2, duration: 60 },
      { routineId: perfectMorning.id, activityId: 34, count: 4, duration: 40 },
      { routineId: perfectMorning.id, activityId: 33, count: 3, duration: 60 },
      { routineId: perfectMorning.id, activityId: 36, count: 5, duration: 50 },
      { routineId: perfectMorning.id, activityId: 37, count: 5, duration: 50 },
      { routineId: perfectMorning.id, activityId: 10, count: 50, duration: 50 },
      { routineId: perfectMorning.id, activityId: 15, count: 15, duration: 30 },
      { routineId: perfectMorning.id, activityId: 25, count: 30, duration: 45 },
      { routineId: perfectMorning.id, activityId: 3, count: 15, duration: 45 },
      { routineId: perfectMorning.id, activityId: 31, count: 10, duration: 100 },

      { routineId: intenseLegs.id, activityId: 16, count: 20, duration: 80 },
      { routineId: intenseLegs.id, activityId: 19, count: 25, duration: 35 },
      { routineId: intenseLegs.id, activityId: 11, count: 50, duration: 250 },
      { routineId: intenseLegs.id, activityId: 20, count: 15, duration: 45 },
      { routineId: intenseLegs.id, activityId: 23, count: 20, duration: 30 },
      { routineId: intenseLegs.id, activityId: 21, count: 40, duration: 120 },
      { routineId: intenseLegs.id, activityId: 13, count: 1, duration: 10 },

      { routineId: quickWakeMeUp.id, activityId: 6, count: 15, duration: 45 },
      { routineId: quickWakeMeUp.id, activityId: 11, count: 35, duration: 70 },
      { routineId: quickWakeMeUp.id, activityId: 29, count: 20, duration: 100 },
      { routineId: quickWakeMeUp.id, activityId: 1, count: 15, duration: 45 },
      { routineId: quickWakeMeUp.id, activityId: 31, count: 10, duration: 50 },

      { routineId: dailyGetMoving.id, activityId: 2, count: 30, duration: 60 },
      { routineId: dailyGetMoving.id, activityId: 14, count: 50, duration: 50 },
      { routineId: dailyGetMoving.id, activityId: 26, count: 20, duration: 30 },
      { routineId: dailyGetMoving.id, activityId: 31, count: 10, duration: 50 },
      { routineId: dailyGetMoving.id, activityId: 37, count: 2, duration: 20 },
      { routineId: dailyGetMoving.id, activityId: 9, count: 20, duration: 30 },
      { routineId: dailyGetMoving.id, activityId: 11, count: 35, duration: 70 },
      { routineId: dailyGetMoving.id, activityId: 3, count: 15, duration: 30 },
      { routineId: dailyGetMoving.id, activityId: 19, count: 15, duration: 30 },
      { routineId: dailyGetMoving.id, activityId: 30, count: 2, duration: 40 },

      { routineId: glutesDay.id, activityId: 19, count: 20, duration: 30 },
      { routineId: glutesDay.id, activityId: 11, count: 40, duration: 80 },
      { routineId: glutesDay.id, activityId: 15, count: 10, duration: 30 },
      { routineId: glutesDay.id, activityId: 18, count: 10, duration: 30 },
      { routineId: glutesDay.id, activityId: 20, count: 10, duration: 40 },
      { routineId: glutesDay.id, activityId: 21, count: 20, duration: 40 },
      { routineId: glutesDay.id, activityId: 22, count: 20, duration: 30 },
      { routineId: glutesDay.id, activityId: 23, count: 4, duration: 60 },


    ];
    const routineActivities = await Promise.all(routineActivitiesToCreate.map(addActivityToRoutine));
    console.log("routine_activities: ", routineActivities);
    console.log("...(•̀ᴗ•́)و ̑̑ routine_activities created!");
  } catch (error) {
    console.error("Error creating routine_activities");
    throw error;
  }
}


async function rebuildDB() {
  try {
    client.connect();
    console.log("\n___________________________\n\nREBUILDING DB ... (✿ ◠ ‿◠ )\n___________________________\n")
    await dropTables()
    await createTables()
    await createInitialUsers()
    await createInitialActivities()
    await createInitialRoutines()
    await createInitialRoutineActivities()
    console.log("\n__________________________________________\n\nFINISHED REBUILDING DB ... ε/̵͇̿̿/’̿’̿ ̿ (◡ ︵◡ )\n__________________________________________\n");
    client.end();
  } catch (error) {
    console.log("Error during rebuildDB")
    throw error
  }
}

rebuildDB();