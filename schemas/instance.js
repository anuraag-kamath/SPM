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
    ]
})


module.exports = { instance };