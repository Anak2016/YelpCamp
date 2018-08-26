var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    Comment = require("./models/comment")
seedDB();// remove all campground

mongoose.connect("mongodb://localhost/yelp_camp_v3");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
    

app.get("/", function(req,res){
    res.render("landing");
    console.log("in home");

});

app.get("/campgrounds", function(req,res){
    
    console.log("in campgrounds");
    Campground.find({},function(err,allcampgrounds){
        if(err){
            console.log("something is wrong!!");
        }else{
            console.log("find all objects!!");
            res.render("campgrounds/index", {campgrounds:allcampgrounds});
        }
    });
});

app.post("/campgrounds", function(req,res){
    
    console.log(req.body);
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampgrounds = {name: name, image: image, description: description};
    
    Campground.create(newCampgrounds,function(err,campgrounds){
            if(err){
                console.log("something is wrong!!");
            }else{
                console.log("find all objects!!");
                res.redirect("/campgrounds");
            }
    });
});


app.get("/campgrounds/new", function(req,res){
    res.render("campgrounds/new");
    console.log("in new");
});


app.get("/campgrounds/:id", function(req,res){
    //find the campgroudns with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundcampground){
        if(err){
            console.log("something is wrong with comments !!");
        }else{
            console.log("found id!");
            console.log(foundcampground);
            //render show template
            res.render("campgrounds/show",{campground:foundcampground});
        }
    });
});

//===================================
// COMMENT ROUTES
// =================================

app.get("/campgrounds/:id/comments/new", function(req, res){
    console.log("In /campgrounds/:id/comments/new");
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req,res){
 
    
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id); 
                }
            });
        }
    })
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("connected!!") ;
});