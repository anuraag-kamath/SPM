var mongoose = require('mongoose');

var processMaster = mongoose.model('processMaster',
    {
        processName: {
            type: String
        },
        latestVersionId: {
            type: String
        },
        pastVersions:[{
            type: String
        }]
                
    }
)

module.exports = {
    processMaster
}