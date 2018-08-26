var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundsSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundsSchema);

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
            res.render("index", {campgrounds:allcampgrounds});
        }
    });
});

app.post("/campgrounds", function(req,res){
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
    res.render("new");
    console.log("in new");
});


app.get("/campgrounds/:id", function(req,res){
    //find the campgroudns with provided ID
    Campground.findById(req.params.id, function(err,foundcampground){
        if(err){
            console.log("something is wrong!!");
        }else{
            console.log("found id!");
            //render show template
            res.render("show",{campground:foundcampground});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("connected!!") ;
});