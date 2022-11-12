// building pg.Client

const pg = require('pg');

const client = new pg.Client(`postgres://localhost:5432/fitness-dev`);

module.exports = {
    client
}

// from the forked example repo
// module.exports = {
//     // ...require('./client'), // adds key/values from users.js
//     ...require('./users'), // adds key/values from users.js
//     ...require('./activities'), // adds key/values from activites.js
//     ...require('./routines'), // etc
//     ...require('./routine_activities') // etc
//   }