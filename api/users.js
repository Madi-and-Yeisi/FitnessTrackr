require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require("express");
const usersRouter = express.Router();

const { createUser, getUserByUsername, getUser } = require('../db/users');
const { getAllRoutinesByUser, getPublicRoutinesByUser } = require("../db/routines");


// POST /api/users/register
// Create a new user. Require username and password, and hash password before saving user to DB. Require all passwords to be at least 8 characters long.
// Throw errors for duplicate username, or password-too-short.
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
        if (password.length < 8) { // TODO: stop from creating user anyways...
            next({
                name: 'PasswordTooShortError',
                message: 'Password must be at least 8 characters long'
            });
        }

        const _user = await getUserByUsername(username);

        if (_user) {
            next ({
                name:'UserExistsError',
                message:'A User by that Username already exists'
            });
        }

        const user = await createUser({ username, password });

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
                expiresIn:'1w'
        });
        res.send({
            message: 'Thank You for Signing Up',
            token
        });
    } catch ({name, message}) {
        next ({name, message});
    }
});


// POST /api/users/login
// Log in the user. Require username and password, and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token.
// Keep the id and username in the token
usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password){
        next({
            name:'MissingCredentialsError',
            message:'Please supply both a username and password'
        });
    }

    try {
        const user = await getUser({ username, password });

        if (user) {
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET);
            res.send({
                message: "you're logged in!",
                token: token
            });
        } else { 
            next({
                name:'IncorrectCredentialsError',
                message:'Username or password is incorrect'
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
});


// GET /api/users/me
// Send back the logged-in user's data if a valid token is supplied in the header.
usersRouter.get('/me', async (req, res, next) => {
    try {
        if (!req.user){
            next({
                name: "InvalidCredentialsError",
                message:"Not logged in"
            })
        } else {
            const user = await getUserByUsername(req.user.username);
            res.send({ user });
        }
    } catch ({name,message}){
        next({name,message})
    }
});


// GET /api/users/:username/routines
// TODO: Get a list of public routines for a particular user.
usersRouter.get('/:username/routines', async (req, res, next) => {
    const { username } = req.params;
    console.log("getting routines from ", username);

    try {
        const routines = await getPublicRoutinesByUser(username);
        res.send(routines);
    } catch ({name,message}){
        next({name,message})
    }
});

module.exports = usersRouter;