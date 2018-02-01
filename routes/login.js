var express = require("express");
var router = express.Router();
var User = require("../models/user");
var loginController = require("../controllers/loginController");
//get routes 
router.get("/",loginController.login_page);

router.post("/",loginController.login);

router.get("/signup",loginController.signup_page);

router.post("/signup",loginController.signup);

module.exports = router;