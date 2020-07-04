const express = require('express');
const User=require('../models/User')
const { check, validationResult } = require('express-validator');
const passport=require('passport')
const router= express.Router();







//root route
 router.get("/",(req,res) =>{
     res.render('index');
 })
 //register route:show register form
 router.get('/register',async(req,res) =>{
     res.render('register')
 })
//handle signup logic
router.post('/register',[check('password').isLength({ min: 5 })],async(req,res)=>
{
try{
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
 let user=new User({username:req.body.username,fullname:req.body.fullname,email:req.body.email});
 await User.register(user,req.body.password)
 await passport.authenticate("local")(req, res, function(){
    req.flash('success',`welcome to yelpcamp ${user.username}`)
    res.redirect("/campgrounds"); 
 });
}
catch(error){
console.log(error)
}
})
//show login form
router.get('/login',async(req,res)=>{
    res.render('login')
})
//handle login logic
router.post('/login',passport.authenticate('local',{
    
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
        failureFlash:true,
        successFlash:`welcome to yelpcamp again!!!`
    
}),(req,res)=>{
})
//logout route
router.get('/logout',async(req,res)=>{
    req.logout();
    res.redirect('/campgrounds')
})


 module.exports=router;