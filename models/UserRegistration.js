const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true
    }, 
    lastName : {
        type:String,
        required:true
    }, 
    email : {
        type:String,
        required:true
    }, 
    mobileNumber : {
        type:String,
        required:true
    },
    birthDay : {
        type:Date,
        required:true
    }, 

    gender : {
        type:String,
        required:true
    },
    
    userName : {
        type:String,
        required:true
    }, 
    password : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("Users", usersSchema);