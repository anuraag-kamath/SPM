const mongoose = require('mongoose');

var instance = mongoose.model('instance', {
    processName: {
        type: String
    },
    processId: {
        type: String
    },
    status: {
        type: String
    },
    currentStep: {
        stepId: String
    },
    objects: [
        {
            id: {
                type: String
            },
            name: {
                type: String
            }
        }
    ],
    user: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String
    },
    workedUponUsers: [{
        userId: {
            type: String
        }
    }],
    
})


module.exports = { instance };