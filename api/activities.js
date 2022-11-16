const express = require('express');
const activitiesRouter = express.Router();

const { getAllActivities, createActivity, updateActivity } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { requireUser } = require('./utils');


// GET /api/activities
activitiesRouter.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();

        res.send({ activities });
    } catch ({name,message}){
        next({name,message});
    }
});


// POST /api/activities
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description } = req.body;

    const activityData = {};

    try {
        activityData.name = name;
        activityData.description = description;

        const activity = await createActivity(activityData);
        
        if (activity){
            res.send({ activity });
        } else {
            next({
                name:'ActivityPostError',
                message:'Activity airrerrr'
            });
        }
    } catch ({name,message}) {
        next({name,message});
    }
});


// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;

    try {
        const updatedActivity = updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity });

    } catch ({name,message}) {
        next({name,message});
    }
});


// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    const activityId = req.params.activityId;

    try{
        const activities = await getPublicRoutinesByActivity(activityId);

        if (activities.length) {
            res.send({ activities });
        } else {
            next({
                name: "NoRoutinesWithActivityId",
                message: "There are no routines with that activity"
            });
        }

    } catch ({ name, message}){
        next ({name, message});
    }
});


module.exports = activitiesRouter;
