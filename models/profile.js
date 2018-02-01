var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
    name:{type:String, required:true,default:"Chess Lover"},
    age:{type:Number, required:true, default:0},
    lost:{type:Number, required:true, default:0},
    won:{type:Number, required:true, default:0},
    level:{type:Number, required:true, default:0},
    levelTitle:{type:String, required:true,default:"Rookie"}
})

ProfileSchema.virtual("getId")
.get(function(){
    return this._id;
})
module.exports = mongoose.model('Profile',ProfileSchema);