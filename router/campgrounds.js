const express = require('express');
const router=express.Router();
const Campground = require('../models/campgrounds');
const middleware=require('../middleware/index')


//RESTFUL ROUTES
//INDEX: Display all Campground
router.get("/", async(req,res) => {
 try{
    //get all the Campgrounds from db
    let Campgrounds = await Campground.find({})
    res.render("Campgrounds/index",{Campgrounds})
 }
 catch{
    console.log("error");
    res.redirect("/");
 }
})

//NEW:SHOW FORM TO MAKE NEW CAMPGROUND
router.get("/new",middleware.isloggedin,async(req,res) =>{
   res.render("Campgrounds/new")
})

//CREATE : ADD NEW CAMPGROUND TO DB THEN REDIRECT SOMEWHERE
router.post("/",middleware.isloggedin,async(req,res) =>{
   try{
      let newlyCreated=await new Campground({
          name :req.body.name,
          image : req.body.image,
          description:req.body.description,
           author:{
            id:req.user.id,
            username:req.user.username
         }
      })
      await newlyCreated.save()
      res.redirect("/Campgrounds")
   }
   catch(error){
      console.log(error);
      
     res.redirect("/")
   } 
})

//SHOW : SHOW INFO ABOUT ONE BLOG
router.get("/:id",middleware.isloggedin,async(req,res) =>{
   try{
      let foundCampground= await Campground.findById(req.params.id).populate('comments').exec()
      res.render("Campgrounds/show",{Campground:foundCampground})
   }
   catch(error){
      req.flash('error',error.message)
      res.redirect("/")
   }
   })

//EDIT : SHOW EDIT FORM OF ONE BLOG
router.get("/:id/edit",middleware.isloggedin,middleware.checkCampgroundOwnership,async(req,res) =>{
   try{
      //find the Campground with provided ID
      let foundCampground=await Campground.findById(req.params.id)
     res.render("Campgrounds/Edit",{Campground:foundCampground})
   }
   catch(error){
      req.flash('error',error.message)
      res.redirect("/")
   }
})

// UPDATE : update a particular dog ,then redirect
router.post("/:id",middleware.isloggedin,middleware.checkCampgroundOwnership,async(req,res) =>{
   let name = req.body.name;
   let image = req.body.image;
   let description=req.body.description;
   let author={
      id:req.user.id,
      username:req.user.username
   }
   
   let updateCampground={name,image,description,author};
   try{
    //find the Campground with providedid 
   await Campground.findByIdAndUpdate(req.params.id,updateCampground)
   req.flash('success','Campground sucessfully edited')
   res.redirect(`/Campgrounds/${req.params.id}`)
   }
   catch(error){
      req.flash('error',error.message)
      res.redirect("/")
   }
   
});
router.post("/:id/delete",middleware.isloggedin,middleware.checkCampgroundOwnership,async(req,res) =>{
try{
  await Campground.findByIdAndRemove(req.params.id)
   req.flash('success','Campground sucessfully deleted')
   res.redirect("/Campgrounds");
}
catch(err){
   req.flash('error',err.message)
   res.redirect("/")
}
})

module.exports=router;
