const express = require('express');
const routineActivitiesRouter = express.Router();

const { getRoutineActivityById, updateRoutineActivity } = require('../db/routine_activities')
const { requireUser } = require('./utils');

// PATCH /api/routine_activities/:routineActivityId
// TODO: Update the count or duration on the routine activity
routineActivitiesRouter.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { routineActivityId } = req.params;
    const { count, duration } = req.body;

    const updateFields={};

    if (count) updateFields.count = count;
    if (duration) updateFields.duration = duration;

    try {
        const originalRoutineActivity = await getRoutineActivityById(routineActivityId);

        if (originalRoutineActivity.creatorId === req.user.id){ // TODO: Fix this line, no creatorId on routine activity
            const updatedRoutineActivity = await updateRoutineActivity(routineActivityId, updateFields);
            res.send({ routine: updatedRoutineActivity })
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
// TODO: Remove an activity from a routine, use hard delete
routineActivitiesRouter.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    try {
        const routineActivity = await getRoutineActivityById(req.params.routineActivityId);

        if (routineActivity && routineActivity.author.id === req.user.id){ // TODO: Fix this, no author on routine activity
            const updatedRoutineActivity = await updateRoutineActivity(routineActivity.id, { active : false }); // TODO: no active key on routine activity to update

            res.send({ routineActivity:updatedRoutineActivity});
        }else{
            next (routineActivity ? {
                name:'UnauthorizedUserError',
                message:'Not Able to Delete  Which is not Yours'
            }:{
                name:'RoutineActivityNotFound',
                message:'RoutineActivityDoesnotExist'
            });
        }
    } catch ({name,message}) {
        next({name,message})
    }
});


module.exports = routineActivitiesRouter;
