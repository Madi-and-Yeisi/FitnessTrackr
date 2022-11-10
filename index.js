//building express server

const express = require('express');
const { client } = require('./db/index');

const app = express();

client.connect();

app.listen(3000, () => {
    console.log('We are now running on port 3000');
});