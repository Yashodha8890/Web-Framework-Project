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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
});

module.exports = mongoose.model("ActivityTypes", activityTypeSchema);