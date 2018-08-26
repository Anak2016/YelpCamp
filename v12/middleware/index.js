var Campground = require("../models/campground"),
    Comment = require("../models/comment");

//all middleware goes here
var middlewareObj = {}; 
middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        //does user own the campground?
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                console.log("in checkCommentOwnership");
                req.flash("Comment id is not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("in checkCommentOwnership, id doesn't not match ")
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    }else{
        console.log("err in get campground/:id/edit You are not logged in")
        req.flash("error", "You must be logged in to do that")
        res.redirect("back");
    }
}

middlewareObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        //does user own the campground?
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                console.log("in checkCampgroundOwnership");
                req.flash("Campground id is not found");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("in checkCampgroundOwnership, id doesn't not match ")
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back")
                }
            }
        });
    }else{
        console.log("err in get campground/:id/edit You are not logged in")
        req.flash("error", "You must be logged in to do that")
        res.redirect("back");
    }

}

middlewareObj.isLoggedin = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;