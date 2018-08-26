var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user")

//root route
router.get("/", function(req,res){
    res.render("landing");
    console.log("in home");
});

//=============================================================//
// AUTHENTICATION ROUTES
//=============================================================
//show regiser form
router.get("/register", function(req,res){
   res.render("register"); 
});

//handle sign up logic
router.post("/register", function(req,res){
    // parse from name attribute
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username: username}), password, function(err,user){
    // save original username, but hash password
        if(err){
            console.log(err);
            // return will short circuit everything. (act like break)
            return res.render('register');
        }
        console.log("User.register is ok");
        passport.authenticate("local")(req, res,function(){
            console.log("passport.authenticate is ok")
            res.redirect("/campgrounds");
        })
    });
});

//passport.authenticate come from "passport.user(new LocalStrategy(User.authenticate()))"
//show login form
router.get("/login",function(req,res){
    res.render("login")
})

//handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect:"/campgrounds",
        failureRedirect:"/login"
    }),function(req,res){
})
//logout route
router.get("/logout", function(req,res){
    req.logout();
    res.redirect("campgrounds")
})

//middleware
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;