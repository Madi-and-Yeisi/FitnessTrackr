/* eslint-disable no-useless-catch */
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require("express");
const usersRouter = express.Router();

const { createUser, getUserByUsername, getUser } = require('../db/users');
const { getAllRoutinesByUser } = require("../db/routines");


// POST /api/users/register
usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    try {
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
usersRouter.get('/me', async (req, res, next) => {
    try {
        if (!req.user){
            next({
                name: "InvalidUsername",
                message:"Invalid Username"
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
usersRouter.get('/:username/routines', async (req, res, next) => {
    try {
        if (!req.user) {
            next({
                name:"InvalidUsernameRoutines",
                message:"Invalid Username and Routines"
            });
        } else {
            const routines = await getAllRoutinesByUser(req.user.username);
            console.log("routines", routines);
            res.send({ routines });
        }
    } catch ({name,message}){
        next({name,message})
    }
});

module.exports = usersRouter;