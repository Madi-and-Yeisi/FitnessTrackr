const express = require('express');
const routineActivitiesRouter = express.Router();

const { getRoutineActivityById, updateRoutineActivity, deleteRoutineActivity } = require('../db/routine_activities')
const { getRoutineById } = require('../db/routines');
const { getAllRoutineActivities } = require('../db/routine_activities') // DEVELOPMENT TESTING ONLY

const { requireUser } = require('./utils');


// GET /api/routine_activities
// return a list of all routine activities
routineActivitiesRouter.get('/', async (req, res, next) => {   // DEVELOPMENT TESTING ONLY
    try {
        const routineActivities = await getAllRoutineActivities();

        res.send({
            success: true,
            routineActivities: routineActivities
        });
    } catch ({name, message}) {
        next({name, message});
    }
});



// PATCH /api/routine_activities/:routineActivityId
// update the count or duration on the routine activity
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const updateFields = {};

    if (count) updateFields.count = count;
    if (duration) updateFields.duration = duration;

    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId);
        const routine = await getRoutineById(originalRoutineActivity.routineId);

        if (routine.creatorId === req.user.id){ // you can only update your own routine activities
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            if (updatedRoutineActivity) {
                res.send({ 
                    success: true,
                    message: 'routine activity updated',
                    updatedRoutineActivity: updatedRoutineActivity
                })
            } else {
                next ({ 
                    name:'RoutineActivityUpdateError',
                    message:'there was an error updating routine activity'
                })
            }
        } else {
            next ({ 
                name:'UnauthorizedUserError',
                message:'You cannot update a routine activity that isnt yours'
            })
        }
    } catch ({name,message}) {
        next({name,message});
    }
});


// DELETE /api/routine_activities/:routineActivityId
// hard delete a routine activity
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    try {
        const deletedRoutineActivity = await deleteRoutineActivity(routineActivityId);
        if (deletedRoutineActivity) {
            res.send({
                success: true,
                message: 'routine activity deleted',
                deletedRoutineActivity: deletedRoutineActivity
            });
        } else {
            next({
                name: 'DeleteRoutineActivityError',
                message: 'there was an error deleting routine activity, nothing was deleted'
            });
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});


module.exports = routineActivitiesRouter;
