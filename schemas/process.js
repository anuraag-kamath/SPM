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
                days1: {
                    type: Number
                },
                hours1: {
                    type: Number
                },
                minutes1: {
                    type: Number
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
                },
                days2: {
                    type: Number
                },
                hours2: {
                    type: Number
                },
                minutes2: {
                    type: Number
                }
            }
        ]
    }
)

module.exports = {
    process1
}