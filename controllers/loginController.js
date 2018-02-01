var User = require("../models/user");
var Profile = require("../models/profile");
var async = require("async");

//get login page 
exports.login_page=function(req,res){
    async.parallel({
        userCount:function(callback){
            User.count(callback);
        }
    },function(err,results){
        res.render("./login/login",{data:results});
    })
}
//post login page
exports.login=function(req,res){
    console.log(req.body.username);
    var user = User.findOne({
        'username':req.body.username,
        'password':req.body.password
    },'',function(err,result){
        console.log('error : ' + err);
        console.log('result :' + result);
        if(result){
            res.send("Found User");
        } else {
            res.send("Not Found");
        }
    });
}

//get sign up page 
exports.signup_page=function(req,res){
    res.render("./login/signup");
}

//post signup page 
exports.signup = function(req,res){
    console.log("looking for " + req.body.username + " in database");
    User.findOne({username:req.body.username},"",function(err,user){
        if(err) res.send("Failed");
        console.log(user);
        if(!user){

            Profile.create({},function(err,profile){
                if(err){
                    res.status(500);
                    console.log("Cannot create profile");
                    return res.send("DB ERROR");
                } 
                //console.log("created new profile" + profile);
                //create the user info 
                User.create({
                    username:req.body.username.toString(),
                    password:req.body.password.toString(),
                    email:req.body.email.toString(),
                    profile:profile.getId
                },function(err){
                    if(err) {
                        res.status(500);
                        console.log(err);
                        return res.send("DB ERROR");
                    };
                    res.render("./login/signup_message",{
                        title_message:"SUCCESS",
                        message:"You're good to go"
                    })
                });
            })

            //console.log(newProfile);
            //console.log(newProfile.getId);o
            
        } else {
            console.log("Account existed");
            res.render("./login/signup_message",{
                title_message:"FAILED",
                message:"Your username have been used"
            })
        }
        
    });
}