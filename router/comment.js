const express=require('express');
const router =express.Router({mergeParams:true});
const Comment=require('../models/comment');
const Campground=require('../models/campgrounds')
const middleware=require('../middleware/index')

//New :show form to make a new Comment
router.get("/new",middleware.isloggedin,async(req,res)=>{
    try{
        //find the Campground with the provided id
        let foundCampground=await Campground.findById(req.params.id)
        res.render("Comments/new",{Campground:foundCampground})
    }
   catch(err){
       console.log(err)
      res.redirect("/")
   }
})
router.post("/",middleware.isloggedin,async(req,res)=>{
    try{
        let text=req.body.text;
        let author={
            id:req.user.id,
            username:req.user.username
        }
        let comment={text,author}
        //find the Campground with the provided id
        let foundCampground=await Campground.findById(req.params.id)
        
        let createcomment  =await Comment.create(comment)
        createcomment.save()
       await foundCampground.comments.push(createcomment)
       foundCampground.save() 
        res.redirect(`/Campgrounds/${req.params.id}`)   
    }
    catch(err){
        console.log(err)
       res.redirect("/")
    }
    
})
//Edit route
router.get("/:commentid/edit",middleware.isloggedin,middleware.checkCommentOwnership,async(req,res) =>{
    try{
        let foundCampground= await  Campground.findById(req.params.id)
        {
            try{
                 let foundComment= await Comment.findById(req.params.commentid)
                 res.render("Comments/edit",{Comment:foundComment,Campground:foundCampground})
            }
            catch(err){
                   console.log(err)
                   res.redirect("/")
            }
        }
         
    }
    catch(err){
        console.log(err)
        res.redirect("/")
    }
})
router.post("/:commentid",middleware.isloggedin,middleware.checkCommentOwnership,async(req,res) =>{
    try{
        let Comments={
            text:req.body.text
        }
       let UpdatedComment= await Comment.findByIdAndUpdate(req.params.commentid,Comments)
        console.log(Comments)
        UpdatedComment.save()
         res.redirect(`/Campgrounds/${req.params.id}`)
    }
    catch(err){
        console.log(err,"err")
        
    }
})
//delete route
router.post('/:commentid/delete',async(req,res) =>{
   Comment.findByIdAndRemove(req.params.commentid,(err,deleteComment) =>{
    try{
        if(err)
        {
            req.flash('Error','Campground do not exist')
            res.redirect('/Campgrounds')
        }
        else
        {
            req.flash('success','Campground suceesfully delted')
            console.log(deleteComment)
            res.redirect('/Campgrounds')
        }
    }
    catch(err){
           req.flash('error',err.message)
           res.redirect('/Campgrounds')
    }

})
})



module.exports=router