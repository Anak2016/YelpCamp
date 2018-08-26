var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = mongoose.Schema({
    username: String,
    password: String
});

// how username and password will be stored depend on strategy
// in this case strategy is passport-local-mongoose
UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);