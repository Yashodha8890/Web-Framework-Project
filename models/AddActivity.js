const mongoose = require('mongoose');

const activityCatergorySchema = new mongoose.Schema({
    activityCatergoryname  : {
        type:String,
        required:true
    }, 
    activityDuration : {
        type:String,
        required:true
    }
});


//module.exports = mongoose.model("ActivityCategories", activityCatergorySchema);
// Prevent overwriting the model if it's already compiled
const ActivityCategories = mongoose.models.ActivityCategories || mongoose.model('ActivityCategories', activityCategorySchema);

module.exports = ActivityCategories;