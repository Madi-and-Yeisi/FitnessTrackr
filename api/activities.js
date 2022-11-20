const express = require('express');
const {getAllActivities,updateActivity, createActivity, getActivityById, updateActivity}= require('../db/activities');
const router = express.Router();

const {requireActivities}=require ('./activities.js')


// GET /api/activities/:activityId/routines
activitiesRouter.get ('/',async (req,res,next)=> {

    try{
        const allActivities = await requireActivities();

        const activities=allActivities.filter(activities=>{
            if (activities.active){
                return true;
            }
            if (req.user && this.post.activities.id===req.user.id){
                return true;
            }
            return false;
        });
        res.send({
            activities
        });
    }catch ({routines}){
    next ({routines});
    }
})


// GET /api/activities
activitiesRouter.get ('/',async (req,res,next)=>{
    try{
        const allActivities=await getAllActivities();
        
        const activities= allActivities.filter(activities=>{
            if (activities.active){
                
                if (req.user && activities.author.id === req.user.id){
                    return true;
                }
                return false;
            }
        });
        res.send({
            activities
        });
    }catch({name,message}){
        next ({name,message});
    }
});


// POST /api/activities
activitiesRouter.post('/',async(req,res,next)=>{

    const activArr=activities.trim().split(/\s+/)
    const activData = {};

    if(activArr/lenth){
        activData.activities=activArr;
    }
try{
    activData.activities=activities;

    const activities=await createActivity(activData);
    
    if(activities){
        res.send(activities);
    }else{
        next({
            name:'ActivityPostError',
            message:'Activity airrerrr'
        })
    }
}catch({name,message}){
    next ({name,message});
}
});



// PATCH /api/activities/:activityId
activitiesRouter.patch('/"activitiyId', requireUser,async (req,res,next)=>{
    const {activityId}=req.params;


    if (content ){
        updatefields.content=content;
    }})

    try{
        const originalActiv=await getActivityById(activityId);

        if (originalActiv.activities.id === req.user.id) {
            const updateActivity=await updateActivity(activityId,updateFields);
            res.send({activity:updateActivity})
        } else {
            next({
                name:'NoActivityId',
                message:'No activityId Available'
            })
        
        }
    }catch ({name,message}){
            next({name,message});
        }

module.exports = router;
