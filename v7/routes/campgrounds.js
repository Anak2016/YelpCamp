var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground")
    
//===================================
// CAMPGROUNDS 
// =================================


//INDEX - show all campgrounds
router.get("/", function(req,res){
    console.log("in campgroundsssss");
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("something is wrong!!");
        }else{
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
});


//CREATE - add new campground to DB
router.post("/", isLoggedin ,function(req,res){
    // console.log(req.body);
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampgrounds = {name: name, image: image, description: description, author: author};
    
    
    Campground.create(newCampgrounds,function(err,newlyCreated){
            if(err){
                console.log("something is wrong!!");
            }else{
                res.redirect("/campgrounds");
            }
    });
});



//NEW - show form to create new campground
router.get("/new", isLoggedin, function(req,res){
    res.render("campgrounds/new");
    console.log("in new");
});


router.get("/:id", isLoggedin, function(req,res){
    //find the campgroudns with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log("something is wrong with comments !!");
        }else{
            //render show template
            res.render("campgrounds/show",{campground:foundcampground});
        }
    });
});
//middleware
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;