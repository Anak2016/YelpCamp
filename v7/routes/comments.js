var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment")

//===================================
// COMMENT ROUTES
// =================================

router.get("/new", isLoggedin,function(req, res){
    console.log("In /campgrounds/:id/comments/new");
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            console.log("in comment/new")
            res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/", isLoggedin, function(req,res){
    //create new comment
    //connect new comment to camground
    //redirect campground show page 
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err)
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    //save comment
                    campground.comments.push(comment);
                    campground.save();
                    console.log("inside comment")
                    console.log(comment);
                    res.redirect("/campgrounds/" + campground._id); 
                }
            });
        }
    })
});
//middleware
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;