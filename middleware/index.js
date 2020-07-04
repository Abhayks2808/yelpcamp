const Campground=require('../models/campgrounds');
const Comment=require('../models/campgrounds');
const User=require('../models/User');


const middlewareObj={}

middlewareObj.checkCampgroundOwnership=(req,res,next) => {
    Campground.findById(req.params.id,(err,foundCampground) => {
        if(foundCampground.author.id.equals(req.user.id)) {
            next()
        }
        else if (err || !foundCampground) {
             req.flash('error',"Error!! Campground doesn't exist")
              res.redirect('/')
            }
        else{
          req.flash('error',"You don't have permission to do that")
          res.redirect(`/Campgrounds/${req.params.id}`)
        }
    })
};
middlewareObj.checkCommentOwnership=(req,res,next) => {
   Comment.findById(req.params.id,(err,foundComment) =>{
       if(foundComment.author.id.equals(req.user.id)) {
           console.log(req.user.id)
           next()
        }
        else if (err || !foundcomment) {
            req.flash('error',"Sorry!! that comment don't exist")
            res.redirect('/')
        }
        else {
            req.flash("you don't have permission to do that")
            res.redirect(`/Campgrounds/${req.params.id}`)
        }
   })
}
middlewareObj.isloggedin=(req,res,next) => {
 if(req.isAuthenticated()){
    return next();
}
else{
    req.flash('error','You need to be logged in to do that');
    res.redirect('/login')
}
}
module.exports=middlewareObj;