const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
    activityCatergory : {
        type:String,
        required:true
    },
    ActivityTypeName : {
        type:String,
        required:true
    }, 
    ActivityDuration : {
        type:String,
        required:true
    }
    
});

module.exports = mongoose.model("ActivityTypes", activityTypeSchema);