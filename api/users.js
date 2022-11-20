/* eslint-disable no-useless-catch */
const express = require("express");
const usersRouter = express.Router();

const { createUser,getUserByUsername,getAllUsers}=require('../db');
const { getAllRoutinesByUser } = require("../db/routines");
// POST /api/users/register
console.log("hello world!");


usersRouter.post('/register',async (req,res,next)=>{
    const {username,password,name}=req.body;

    try{
        const_user=await getUserByUsername(username);
        if(_user) {
            next ({
                name:'UserExistsError',
                message:'A User by that Username already exists'

            });
        }
        const user =await createUser({
            username,password,name
        });
        const token=jwt.sign({
            username}, process.env.JWT_SECRET,{
                expiresIn:'1wk'
        });
        res.send({
            message: 'Thank You for Signing Up',
            token
        });
    }catch({name,message}){
        next ({name,message});
    }
});


// POST /api/users/login
usersRouter.post('/login',async(req,res,next)=>{
    const{username,password}=req.body;

    if (!username|| !password){
        next({
            name:'CreateANewAccount',
            message:'Please make a New Account'
        });
    }
    try{
        const user=await getUserByUsername(username);

        if (user&& user.password == password){
            const token =jwt.sign({
                id:user.id,
                username}, process.env.JWT_SECRET, {
                    expiresIn:'1wk'
 });
                }else { 
                    next({
                        name:'Incorrect',
                        message:'Username or Password are Incorrect'
                    })
                }
            }catch(error){
                console.log(error);
                next(Error);
            }
})
// GET /api/users/me
usersRouter.get('/me',async(req,res,next)=>{
    try{
        if(!req.user){
            next({
                name: "InvalidUsername",
                message:"Invalid Username"
            })
        }else{
            const user = getUserByUsername (req.user.username);
            res.send ({
                user
            })
        }
    }catch({name,message}){
        next({name,message})
    }
})

// GET /api/users/:username/routines

usersRouter.get('/username/routines',async(req,res,next)=> {
    try{
        if(!req.user){
            next({
                name:"InvalidUsernameRoutines",
                message:"Invalid Username and Routines"
            })
        }else{
            const user =getAllRoutinesByUser (req.user.username);
            res.send({
                username,routine
            })
        }
    }catch({name,message}){
        next({name,message})
    }
})
module.exports = router;
