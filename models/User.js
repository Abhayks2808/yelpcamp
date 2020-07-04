
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema=new mongoose.Schema({
  username:{type:String,unique:true,required:true},
  fullname:{type:String,required:true},
  password:String,
  email:{type:String,unique:true,required:true},
  joined:{type:Date,default:Date.now},
  
});


UserSchema.plugin(passportLocalMongoose)

module.exports=mongoose.model('User',UserSchema)