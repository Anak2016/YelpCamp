var express = require("express"),
    router = express.Router({mergeParams: true}),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware/index");

//===================================
// COMMENT ROUTES
// =================================

router.get("/new", middleware.isLoggedin,function(req, res){
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
router.post("/", middleware.isLoggedin, function(req,res){
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

//EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id,function(err,foundComment){
       if(err){
           console.log("err in router.get campgrounds/:id/comment/:comment_id/edit cannot find id")
           res.redirect("back");
       }else{
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

//UPDATE COMMENT
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
      if(err){
          console.log("err in router.put /campgrounds/:id/comments/:comment_id/ ");
          res.redirect("back");
      }else{
          res.redirect("/campgrounds/" + req.params.id);
      }
  });
});

//DESTROY COMMENT
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
     if(err){
        console.log("error in delete campgrounds/:id")
     }else{
        res.redirect("/campgrounds/" + req.params.id );
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