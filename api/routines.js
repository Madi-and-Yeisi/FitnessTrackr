const express = require('express');
const routinesRouter = express.Router();

const { getAllPublicRoutines, createRoutine, updateRoutine, getRoutineById, deleteRoutine, getRoutineByIdWithActivities } = require('../db/routines');
const { getAllRoutines } = require('../db/routines');   // DEVELOPMENT TESTING ONLY
const { addActivityToRoutine, deleteRoutineActivity } = require('../db/routine_activities');
const { requireUser } = require('./utils');


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
                message:'You cannot update a routine that isnt yours'
            })
        }
    } catch ({name,message}) {
        next({name,message});
    }
});


// DELETE /api/routines/:routineId
// hard delete a routine - making sure to delete all the routineActivities whose routine is the one being deleted
routinesRouter.delete('/:routineId', requireUser, async (req, res, next) => {
    console.log("DELETING ROUTINE")
    const { routineId } = req.params;
    try {
        const [ routine ] = await getRoutineByIdWithActivities(routineId);
        console.log('routine to delete: ', routine);
        console.log("HELLO WORLD")
        console.log('routine.activities.length: ', routine.activities.length);

        if (routine.activities.length) {
            for ( let i = 0; i < routine.activities.length; i++ ) {
                // console.log("INSIDE FOR LOOP")
                // console.log('!!!!!!!!! routine.activities[i]', routine.activities[i]);
                const deletedRoutineActivity = await deleteRoutineActivity(routine.activities[i].routineActivityId);
                if (deletedRoutineActivity) {
                    console.log("routine activity deleted before deleting routine: ", deletedRoutineActivity);
                } else {
                    next({
                        name: 'DeleteRoutineError',
                        message: 'there was an error deleting routine activities for routine deletion, nothing was deleted'
                    });
                }
            }
        }
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
                message: 'there was an error deleting routine, nothing was deleted'
            });
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});


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


// GET /api/routines/:routineId
// return a single routine by id
routinesRouter.get('/:routineId', async (req, res, next) => {
    const { routineId } = req.params;
    try{
        const [ routine ] = await getRoutineByIdWithActivities(routineId);

        // if (!routine.isPublic) {
        //     console.log("PRIVATE ROUTINE"); // TODO: dont let users get others private routines by typing routineId into url
        // }

        res.send({
            success: true,
            message: 'got routine #' + routineId,
            routine: routine
        });
    } catch ({name, message}) {
        next({name, message});
    }
});


// POST /api/routines/:routineId/activities
// attach a single activity to a routine
routinesRouter.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const { routineId } = req.params;
    const { activityId, count, duration } = req.body;

    const routineActivityData = {};

    try {
        routineActivityData.routineId = routineId;
        routineActivityData.activityId = activityId;
        if (count) routineActivityData.count = count;
        if (duration) routineActivityData.duration = duration;

        const routineActivity = await addActivityToRoutine(routineActivityData);

        if (routineActivity) {
            res.send({
                success: true,
                message: "activity added to routine",
                routineActivity:routineActivity
            });
        } else {
            next({
                name: "AttachRoutineActivityError",
                message:"something went wrong adding activity to routine"
            });
        }
    } catch ({name,message}) {
        next ({name,message});
    }
});


module.exports = routinesRouter;