var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"), 
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    User = require("./models/user")
    
//require routes
var commentRoutes = require("./routes/comments"),
    camgroundRoutes = require("./routes/camgrounds"),
    indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/yelp_camp_v6");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+'/public'));
app.set("view engine", "ejs");
seedDB();// remove then recreate campgrounds


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
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", camgroundRoutes),
app.use("/campgrounds/:id/comments",commentRoutes)

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("connected!!") ;
});

// var campgroundsSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });



// Campground.create(
//     {
//         name: "Salmon Creek", 
//         image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg",
//         description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite"
        
//     }, function(err, campground){
//         if(err){
//             console.log("something is wrong !!");
//         }else{
//             console.log("new Campground has been created!!");
//             console.log(campground);
//         }
//     });
    






