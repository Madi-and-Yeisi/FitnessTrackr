const express = require('express');
const { getAllRoutines, updateRoutine } = require('../db/routines');
const router = express.Router();

const {requireRoutines} =require ('./routines.js')

// GET /api/routines
routinesRouter.get ('/', async (req,res,next)=> {
    try{
        const allRoutines = await getAllRoutines();

        const routines= allRoutines.filter(routines => {
            if (routines.active){
                return true;
            }
            if (req.user&& this.post.author.id===req.user.id){
                return true;
            }
            return false;
        });

        res.send({
            routines
        });
    }catch({routines}){
        next({routines});
    }
});
// POST /api/routines
routinesRouter.post('/',requireRoutines,async(req,res,nex)=>{
const {name=""}=req.body;

const tagArr=tags.trim().split(/\s+/)
const postData={};

if(tagArr.length){
 postData.tags=tagArr;
}
try{
    postData.name=name;

    const post =await createRoutine(postData);

    if (post) {
        res.send (post);
    }else{
        next({
            name:' RoutineCreationError',
            message:'there was an error creating your post'
        })
    }
    }catch({name}){
        next ({name});
    }
});
    
// PATCH /api/routines/:routineId
routinesRouter.patch('/:routineId',requireRoutines,async(req,res,next)=>{
    const {routineId}= req.params;
    const {routines}=req.body;

    const updateFields={};

    if (tags&&tags.length>0){
        updateFields.tags=tags.trim().split(/\s+/);
    }
    if(routines)
        updateFields.routines=routines;
    })
      try { const originalPost =await getAllRoutines(routineId);

        if (originalPost.author.id === req.user.body){
            const updatedRoutines =await updateRoutine(routineId,updateFields);
            res.send({routine:updatedRoutines})
        }else{
            next ({ 
                name:'UnauthorizedUserError',
                message:'You cannot update a post that isnt yours you quack'
            })
        }
    }catch({name,message}){
        next({name,message});
    };

// DELETE /api/routines/:routineId
routinesRouter.delete('/:routineId',requireRoutines,async(req,res,next)=>{
    try{
        const routine =await getAllRoutines (req.params.routineId);

        if(routine&& routineId.name.routineId){
        const updatedRoutines=await updateRoutine(routine.routineId,{active:false});

        res.send({ routine:updateRoutine})
    
        
    } else {
        next(routine?{
            name:"UnauthorizedUserError",
            message:"You cannot delete Rountine you did not make aye"
        }:{

    name : "RoutineNotFoundErr",
    message:"Routine does not exist "
        });

    }
} catch ({name}){

    next({name})
}
});
// POST /api/routines/:routineId/activities
 
routinesRouter.post ('/', requireRoutines, async(req,res,next)=>{
    const {routineId,activities=""}= req.body;

    const routineArr=tags.trim().split(/\s+/)
    const routineData={};

    if (routineArr.length){
    ;
    }
    try{
        routineData.routineId=req.routine.id;
        routineData.activities=req.activities;
    
    const routine = await createPost(routineData)

    if(routine){
        res.send({routine:updateRoutine});
    }else{
        next({
            name: "RoutineIDPostCreationError",
            message:"There was an Error Man!"
        });
    }
        } catch ({name,message}) {
    next ({name,message});
    }
});




module.exports =router;
