const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activityCName : {
        type:String,
        required:true
    }, 
    activityDuration : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("ActivityCategories", activityCatergorySchema);