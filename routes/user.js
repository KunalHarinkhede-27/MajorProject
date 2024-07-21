const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const asyncwrap=require("../utill/asyncwrap.js");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const usercontroller=require("../controllers/user.js");


//router.route method is used to combine the common route method for the simplicity of code.
router
.route("/signup")
.get(usercontroller.signup) 
.post(asyncwrap(usercontroller.usersignup));


router
.route("/login")
.get(usercontroller.login)
.post(saveredirectUrl,
passport.authenticate("local",         //authenticate is the method inside passport tool that help us to detect user
{failureRedirect:"/login",              //is signup already or not.
failureFlash:true}),usercontroller.userlogin);

router.get("/logout", usercontroller.logout);

module.exports=router;