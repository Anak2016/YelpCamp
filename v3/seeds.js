var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment")
// create array of set called data has name, image, description
var data =[
    {
        name:"camp_1",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN0bkq9kayjzP-rAaPfUlOCAt92_DBo5rjKC6w2XFrOKBnhHnW",
        description:"1111111111111111"
    },
    {
        name:"camp_2",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvs03PTuKsmTW8T-03wmYShPaTiyWwFNJpz1GlO71LhHqCkmZ3",
        description:"22222222222222222222222"
    },
    {
        name:"camp_3",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ4ELi1A7snioymknBGcZnp7IrMNYVTPrWtCdvcZJF6OtNbQRx",
        description:"33333333333333333333333333333"
    }
]
//create function 
function seedDB(){
    //remove all Campgroudn
    Campground.remove({}, function(err){
       if(err){
           console.log(err)
       }else{
           console.log("removed Campground");
       }
       //create campground
       data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                   if(err){
                       console.log(err)
                   }else{
                       console.log("added a Campground!!");
                       //create comment for each campground
                       Comment.create({
                           text:"This is good",
                           author: "Anak Wannaphaschaiyong"
                       }, function(err, comment){
                           if(err){
                               console.log(err)
                           }else{
                              campground.comments.push(comment);
                              campground.save();
                              console.log("Create comment")
                           }
                       });
                    
                   }
            });
        });
    });
    
    


}

module.exports = seedDB;