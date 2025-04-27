const mongoose = require('mongoose');

const activityCatergorySchema = new mongoose.Schema({
    activityCatergoryname : {
        type:String,
        required:true
    }, 
    activityDuration : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model("ActivityCategories", activityCatergorySchema);