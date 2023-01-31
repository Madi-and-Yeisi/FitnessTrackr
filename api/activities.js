const express = require('express');
const activitiesRouter = express.Router();

const { getAllActivities, createActivity, updateActivity } = require('../db/activities');
const { getPublicRoutinesByActivity } = require('../db/routines');
const { requireUser } = require('./utils');


// GET /api/activities
// just return a list of all activities in the database
activitiesRouter.get('/', async (req, res, next) => {
    try {
        const activities = await getAllActivities();

        res.send({ 
            success: true,
            activities: activities
        });
    } catch ({name,message}){
        next({name,message});
    }
});


// POST /api/activities
// create a new activity
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const { name, description, imageUrl } = req.body;
    console.log("CREATING A NEW ACTIVITY");
    console.log(name, description, imageUrl)

    const activityData = {};

    try {
        if(!name) {    // require an activity name
            next({ 
                name: 'MissingInputError', 
                message: 'Missing an activity name'
            });
        }
        else if (!description) { // require an activity description
            next({ 
                name: 'MissingInputError', 
                message: 'Missing an activity description'
            });
        } else {
            activityData.name = name;
            activityData.description = description;
            activityData.imageUrl = imageUrl;

            const activity = await createActivity(activityData);
            
            if (activity){
                res.send({
                    success: true,
                    message: 'new activity created',
                    activity: activity
                });
            } else {
                next({
                    name:'ActivityPostError',
                    message:'An activity with that name already exists'
                });
            }
        }
    } catch ({name,message}) {
        next({name,message});
    }
});


// PATCH /api/activities/:activityId
// update an activity (any user can update an activity like wikipedia)
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description, imageUrl } = req.body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (imageUrl) updateFields.imageUrl = imageUrl;

    try {
        const updatedActivity = updateActivity(activityId, updateFields);
        res.send({
            success: true,
            message: name + ' activity updated',
            activity: updatedActivity
        });
    } catch ({name,message}) {
        next({name,message});
    }
});


// GET /api/activities/:activityId/routines
// TODO: Get a list of all public routines which feature that activity
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
