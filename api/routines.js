const express = require('express');
const routinesRouter = express.Router();

const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, deleteRoutine } = require('../db/routines');
const { getAllRoutines } = require('../db/routines');   // DEVELOPMENT TESTING ONLY
const { requireUser } = require('./utils');

// GET /api/routines
// return a list of public routines including their activities
routinesRouter.get('/', async (req, res, next) => {
    try{
        const routines = await getAllPublicRoutines();
        const allRoutines = await getAllRoutines();   // DEVELOPMENT TESTING ONLY

        res.send({
            success: true,
            routines: routines,
            allRoutines: allRoutines   // DEVELOPMENT TESTING ONLY
        });
    } catch ({name, message}) {
        next({name, message});
    }
});


// POST /api/routines
// create a new routine
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
            res.send({ 
                success: true,
                message: 'new routine created',
                routine: routine
            });
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
// update a routine
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
            res.send({ 
                success: true,
                message: 'routine updated',
                routine: updatedRoutine
            })
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
// hard delete a routine - TODO: making sure to delete all the routineActivities whose routine is the one being deleted.
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    console.log("DELETE ROUTINE")
    const { routineId } = req.params;
    try {
        const deletedRoutine = await deleteRoutine(routineId);
        if (deletedRoutine) {
            res.send({
                success: true,
                message: 'routine deleted',
                deletedRoutine: deletedRoutine
            });
        } else {
            next({
                name: 'DeleteRoutineError',
                message: 'there was an error deleted routine, nothing was deleted'
            });
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});


// POST /api/routines/:routineId/activities
// TODO: Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.
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