const mongoose = require('mongoose');


var obj = mongoose.model('obj', {
    schemaName: {
        type: String
    },
    schemaStructure: {
        type: Object
    },
    obsolete: {
        type: String
    }
});

module.exports = {
    obj
}