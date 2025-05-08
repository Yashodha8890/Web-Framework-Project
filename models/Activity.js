const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    activityName  : {
        type:String,
        required:true
    }, 
    activityDescription : {
        type:String,
        required:true
    },
    ActivityPlannedDate :{
        type: Date,
        required:true
    },
    ActivityStartTime : {
        type: String,
        required : true
    },
    ActivityEndTime : {
        type: String,
        required : true
    },
    activityStatus: {
        type: String,
        required: false,
        default: "Pending"
    },
    activityCatergory: {
        type: String,
        required: true
    },
    activityType: {
        type: String, 
        required: true
    },
    activityPriority: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

    //taking user Id from the users table
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      
    emailSent: {
        type: Boolean,
        default: false  // this is the flag to know whether email is sent or not
    }

});
module.exports = mongoose.model("Activities", activitySchema); 