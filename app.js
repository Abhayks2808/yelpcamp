// IMPORT PACKAGES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const serveStatic = require('serve-static');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const passportLocalmongoose=require('passport-local-mongoose');
const session=require('express-session')
const mongoose = require('mongoose');
const User=require('./models/User');
const flash=require('connect-flash');

const port=process.env.PORT || 5000;


// requiring routes
const indexroute=require('./router/index');
const Campgroundsroute = require('./router/campgrounds');
const Commentsroutes=require('./router/comment');
const Usersroutes=require('./router/user')
//serving static assets
app.use(serveStatic(path.join(__dirname, 'public')))
// TEMPLATE ENGINE(EJS) SETUP
app.set("view engine","ejs");
//requiring mongoose
mongoose.connect('mongodb://localhost:27017/yelpcampversion2',{useNewUrlParser:true,useUnifiedTopology:true})
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
//using bodyparser in our express app
app.use(bodyParser.urlencoded({extended:false}));


//PASSPORT CONFINGURATION
app.use(session({
    secret:'Keyboardcat',
    resave:false,
    saveUninitialized:false,
    cookie :{secret:false}
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash())
app.use((req,res,next)=>{
res.locals.currentUser=req.user;
res.locals.error=req.flash('error');
res.locals.success=req.flash('success');
next()
})


//using route
app.use("/",indexroute);
app.use("/Campgrounds",Campgroundsroute);
app.use("/Campgrounds/:id/comments",Commentsroutes)
app.use("/users",Usersroutes)
//LISTENING TO EXPRESS SERVER
app.listen(port,() =>{
    console.log(`server is started ${port}`);
})