const express=require('express');
const User=require('../models/User');
const middleware=require('../middleware/index')
const router=express.Router()


//user profile dashboard
router.get('/:user_id',middleware.isloggedin,async(req,res)=>{
    let foundUser=await User.findById(req.params.user_id)
    res.render('Users/index',{user:foundUser})
})
//edit user profile dashbard
router.get("/:user_id/edit",middleware.isloggedin,async(req,res) =>{
    let foundUser=await User.findById(req.params.user_id)
    res.render('Users/Edit',{user:foundUser})
})
 
router.post("/:user_id",middleware.isloggedin,async(req,res) =>{
    try{
        let Editdetails={fullname:req.body.fullname,username:req.body.username,email:req.body.email}
        let replaceuser=await User.findByIdAndUpdate(req.params.user_id,Editdetails)
        replaceuser.save()
        res.redirect(`/users/${req.params.user_id}`)
    }
    catch(error){
         console.log(error)
    }
})


module.exports=router