const express = require("express");
const usersRouter = express.Router();

const jwt = require('jsonwebtoken');
const {JWT_SECRET} = process.env;

const { createUser, getUserByUsername, getUser, getUserById } = require('../db/users');
const { getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db/routines");


// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if(!username || !password) {    // require username and password
            next({ 
                name: 'MissingCredentialsError', 
                message: 'Missing username or password'
            });
        }
        else if (username.length < 3) { // require all usernames to be at least 3 characters long 
            next({
                name: 'ShortUsernameError',
                message: 'Username is too short, must be at least 3 characters'
            });
        }
        else if (password.length < 8) { // require all passwords to be at least 8 characters long TODO: stop from creating user anyways...
            next({
                name: 'ShortPasswordError',
                message: 'Password is too short, must be at least 8 characters'
            });
        } else {
            const _user = await getUserByUsername(username);

            if (_user) {    // require unique username
                next ({
                    name:'UserExistsError',
                    message:'A user by that username already exists'
                });
            } else {    // okay, you may join
                const user = await createUser({ username, password });
                const token = jwt.sign({ id: user.id, username }, process.env.JWT_SECRET, { expiresIn:'1w' });
                res.send({
                    success: true,
                    message: 'thanks for signing up ' + username + "!",
                    token
                });
            }
        }
    } catch ({name, message}) {
        next ({name, message});
    }
});


// POST /api/users/login
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password){    // require username and password
        next({
            name:'MissingCredentialsError',
            message:'Please supply both a username and password'
        });
    }

    try { // verify that plaintext login password matches the saved hashed password before returning a json web token
        const user = await getUser({ username, password });

        if (user) { 
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {expiresIn:"1w"});   // keep the id and username in the token
            res.send({
                success: true,
                message: "you're logged in " + username + "!",
                token: token
            });
        } else { 
            next({
                name:'IncorrectCredentialsError',
                message:'Username or password is incorrect'
            });
        }
    } catch ({name, message}) {
        next ({name, message});
    }
});


// GET /api/users/me
// send back the logged-in user's data if a valid token is supplied in the header
usersRouter.get('/me', async (req, res, next) => {
    try {
        if (!req.user){
            next({
                name: "InvalidCredentialsError",
                message:"nobody logged in"
            })
        } else {
            res.send({ 
                success: true,
                message: req.user.username + " is logged in",
                user: req.user
            });
        }
    } catch ({name,message}){
        next({name,message})
    }
});


// GET /api/users/my-routines
// get a list of all routines for logged-in user
usersRouter.get('/my-routines', async (req, res, next) => {
    console.log("getting routines for user");

    try {
        if (!req.user){
            next({
                name: "InvalidCredentialsError",
                message:"nobody logged in"
            })
        } else {
            const routines = await getAllRoutinesByUser(req.user.id);

            res.send({ 
                success: true,
                message: req.user.username + "'s routines",
                routines: routines
            });
        }
    } catch ({name,message}){
        next({name,message})
    }
});


// GET /api/users/:username/routines
// get a list of public routines for a particular user
usersRouter.get('/:username/routines', async (req, res, next) => {
    const { username } = req.params;
    console.log("getting routines for ", username);

    try {
        const user = await getUserByUsername(username);
        const routines = await getPublicRoutinesByUser(user.id);

        res.send({ 
            success: true,
            message: username + "'s routines",
            routines: routines
        });
    } catch ({name,message}){
        next({name,message})
    }
});


module.exports = usersRouter;