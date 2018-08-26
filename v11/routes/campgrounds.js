var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    middleware = require("../middleware/index");
    
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

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedin, function(req,res){
    res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedin ,function(req,res){
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

//SHOW - shows more info about one campgorund 
router.get("/:id", middleware.isLoggedin, function(req,res){
    //find the campgroudns with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log("error in campgrounds/:id");
        }else{
            //render show template
            res.render("campgrounds/show",{campground:foundcampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
    //note: foundCampground.author.id is mongoDB object and req.user._id is a string, so they are not equal
 
    //find campground by id (from the url hence req.params.id) and pass it as foundCampground to be call in .ejs as campground
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    //find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds")
            console.log("error in log")
        }else{
            console.log("in /:id")
            res.redirect("/campgrounds/" + req.params.id ); //remember that req.params.id = updatedCampground._id
        }
    });
});


//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log("error in delete campgrounds/:id")
        }else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;