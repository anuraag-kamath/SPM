const mongoose = require('mongoose');

var workitem = mongoose.model('workitem', {
    processName: {
        type: String
    },
    processId: {
        type: String
    },
    instanceId: {
        type: String
    },
    status: {
        type: String
    },
    stepId: {
        type: String
    },
    stepName: {
        type: String
    },
    stepType: {
        type: String
    },
    formId: {
        type: String
    },
    participant: {
        type: String
    }
})


module.exports = { workitem };