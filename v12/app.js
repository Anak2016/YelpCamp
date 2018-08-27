var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds");
    
//require routes
var commentRoutes = require("./routes/comments"),
    camgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_v6");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());
// seedDB();// remove old data and create all campground




//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "There is no secret",
    resave: false,
    saveUninitialized: false
}));


// User.authenticate comes with passportLocalMongoose (contain in model/user.js.
app.use(passport.initialize());
app.use(passport.session());

//create new LocalStrategy using user.authenticate() 
// that is coming from passportLocalMongoose (locate in model/use.js)
passport.use(new LocalStrategy(User.authenticate()));

// use pre-coded serialize and deserialize code for passport
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//create var currentUser that can be accessed by all function (act like global variable)
app.use(function(req,res,next){
    //res.local -> whatever that is available in our template
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/", indexRoutes);
app.use("/campgrounds", camgroundRoutes),
app.use("/campgrounds/:id/comments",commentRoutes)


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("connected!!") ;
});