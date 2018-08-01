var mongoose = require('mongoose');

var process1 = mongoose.model('process',
    {
        formName: {
            type: String
        }, processName: {
            type: String
        },
        objects: [{
            type: String
        }],
        obsolete:{
            type: String
        },
        steps: [
            {
                step1: {
                    type: String
                },
                lbl1: {
                    type: String
                },
                frm1: {
                    type: String
                },
                part1: {
                    type: String
                },
                step2: {
                    type: String
                },
                lbl2: {
                    type: String
                },
                frm2: {
                    type: String
                },
                part2: {
                    type: String
                }
            }
        ]
    }
)

module.exports = {
    process1
}