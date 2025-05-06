const mongoose = require('mongoose');

const activityCategorySchema = new mongoose.Schema({
    activityCatergoryname  : {
        type:String,
        required:true
    }, 
    activityDescription : {
        type:String,
        required:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


//module.exports = mongoose.model("ActivityCategories", activityCatergorySchema);
// Prevent overwriting the model if it's already compiled
const ActivityCategories = mongoose.models.ActivityCategories || mongoose.model('ActivityCategories', activityCategorySchema);

module.exports = ActivityCategories;