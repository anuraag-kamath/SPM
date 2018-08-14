var mongoose = require('mongoose');

var comments = mongoose.model('comments',
    {
        comment: {
            type: String
        }, instanceId: {
            type: String
        },
        deleted: {
            type: Boolean
        },
        user: {
            type: String
        },
        commentDate: {
            type: Date

        }
    }
)

module.exports = {
    comments
}