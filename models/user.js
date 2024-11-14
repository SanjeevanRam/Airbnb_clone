const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PassportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema ({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(PassportLocalMongoose); //It's create automatically:- Username,Hashing,Solting 

module.exports = mongoose.model("User",userSchema);