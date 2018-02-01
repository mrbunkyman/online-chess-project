var mongoose = require("mongoose");
var moment = require("moment");

var UserSchema = new mongoose.Schema({
    username:{type:String, required:true, max:50},
    password:{type:String,required:true},
    profile:{type: mongoose.Schema.Types.ObjectId, ref:'Profile', required:true},
    email:{type:String,required:true},
    creationDate:{type:Date,default:Date.now}
});

// UserSchema
// .virtual('secretQuestion')
// .get(function(){
//     return this.secretQuestion1;
// })

// UserSchema
// .virtual('secretAnswer')
// .get(function(){
//     return this.secretAnswer1;
// })


// UserSchema 
// .virutal('url')
// .get(function(){
//     return "/get_user_as_super_user/"+this._id;
// })

module.exports= mongoose.model('User',UserSchema);