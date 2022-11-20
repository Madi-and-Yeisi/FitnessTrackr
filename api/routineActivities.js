const express = require('express');
const router = express.Router();

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch('/:routineActivityId',requireUser,async (req,res,next)=>{
    const {routineActivityId}=req.params;

    const updateFields = {};

    if (content){
    updateFields.content=content;

    }
    try{
        const originalRoutineActiv=await getRoutineActivityById (routineActivityId);
        if (originalRoutineActiv.author.id === req.user.id){
            const updatedRoutineActivityById=await updateRoutineActivityById(routineActivityId,updateFields);
            res.send({routineActivityId:updatedRoutineActivityById})
        }else{
            next({
                name:'Error',
                message:'errrrorororor'
            })
        }
    }catch ({name,message}) {
            next({name,message});
        }

    });
// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete('/:routineActivityId',requireUser,async (req,res,next)=>{
    try{
        const routineActivity =await  getRoutineActivityById(req.params.routineActivityId);

        if (routineActivity&& routineActivity.author.id=== req.user.id){
            const updatedRoutineActivity=await updateRoutineActivity (routineActivity.id, {active:false});

            res.send({ routineActivity:updatedRoutineActivity});
        }else{

            next (routineActivity? {
                name:'UnauthorizedUserError',
                message:'Not Able to Delete  Which is not Yours'
            }:{
                name:'RoutineActivityNotFound',
                message:'RoutineActivityDoesnotExist'
            });
        }
    }catch({name,message}){
        next({name,message})
    }
});
module.exports = router;
