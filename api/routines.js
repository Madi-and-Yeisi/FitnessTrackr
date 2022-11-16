const express = require('express');
const routinesRouter = express.Router();

const { createRoutine, getAllRoutines, updateRoutine, getRoutineById } = require('../db/routines');
const { requireUser } = require('./utils');

// GET /api/routines
routinesRouter.get('/', async (req, res, next) => {
    try{
        const routines = await getAllRoutines();

        res.send({ routines });
    } catch ({name, message}) {
        next({name, message});
    }
});


// POST /api/routines
routinesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, goal, isPublic } = req.body;

    const routineData = {};

    try {
        routineData.name = name;
        routineData.goal = goal;
        routineData.isPublic = isPublic;
        routineData.creatorId = req.user.id;

        const routine = await createRoutine(routineData);
        
        if (routine){
            res.send({ routine });
        } else {
            next({
                name:'RoutinePostError',
                message:'Routine post error'
            });
        }
    } catch ({name,message}) {
        next({name,message});
    }
});


// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { name, goal, isPublic } = req.body;

    const updateFields={};

    if (name) updateFields.name = name;
    if (goal) updateFields.goal = goal;
    if (isPublic) updateFields.isPublic = isPublic;


    try {
        const originalRoutine = await getRoutineById(routineId);

        if (originalRoutine.creatorId === req.user.id){
            const updatedRoutine = await updateRoutine(routineId, updateFields);
            res.send({ routine: updatedRoutine })
        } else {
            next ({ 
                name:'UnauthorizedUserError',
                message:'You cannot update a routine that isnt yours you quack'
            })
        }
    } catch ({name,message}) {
        next({name,message});
    }
});

// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    try {
        const routine = await getRoutineById(req.params.routineId);

        if (routine && routine.creatorId == req.user.id){
            const updatedRoutine = await updateRoutine(routine.id, { isPublic: false });

            res.send({ routine: updatedRoutine })
        } else {
            // if there was a routine, throw UnauthorizedUserError, otherwise throw RoutineNotFoundError
            next(post ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a routine which is not yours"
            } : {
                name: "RoutineNotFoundError",
                message: "That routine does not exist"
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});


// POST /api/routines/:routineId/activities
routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    // const { activityId, count, duration } = req.body;

    // const routineActivityData = {};

    // try{
    //     routineActivityData.activityId = activityId;
    //     routineActivityData.count = count;
    //     routineActivityData.duration = duration;

    // const routine = await createPost(routineData)

    // if(routine){
    //     res.send({routine:updateRoutine});
    // }else{
    //     next({
    //         name: "RoutineIDPostCreationError",
    //         message:"There was an Error Man!"
    //     });
    // }
    //     } catch ({name,message}) {
    // next ({name,message});
    // }
});




module.exports = routinesRouter;
