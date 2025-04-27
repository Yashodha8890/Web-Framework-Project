const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
    activityTypeName : {
        type:String,
        required:true
    }, 
    activityDescription : {
        type:String,
        required:true
    },
    activityCategory : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("activityType", activityTypeSchema);