const PORT = 3000;
// imports
const express = require('express');
const apiRouter = require('./api/index')
const morgan = require('morgan');
const { client } = require('./db/index');
require('dotenv').config();


const app = express();

// Middleware

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");

    next();
});

app.use('/api', apiRouter);

client.connect();

app.listen(PORT, () => {
    console.log('We are now running on port', PORT);
});