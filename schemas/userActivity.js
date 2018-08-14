const mongoose = require('mongoose');

var userActivity = mongoose.model('userActivity', {
    activity: {
        type: String
        // enum: ['log-in', 'log-out', 'process', 'object', 'form', 'workitem', 'page']
    },
    subActivity: {
        type: String
    },
    activityId: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failure']
    },
    userId: {
        type: String
    },
    ipAddress: {
        type: String
    }
})


module.exports = { userActivity };