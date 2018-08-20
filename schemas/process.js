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
        obsolete: {
            type: String
        },
        deleted: {
            type: Boolean
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
                method1:{
                    type: String
                },
                url1:{
                    type: String
                },
                headers1: [{
                    type: String
                }],
                queryParams1: [{
                    type: String
                }],
                input1: {
                    type: String
                },
                output1: {
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
                },
                url2:{
                    type: String
                },
                headers2: [{
                    type: String
                }],
                queryParams2: [{
                    type: String
                }],
                input2: {
                    type: String
                },
                output2: {
                    type: String
                }
            }
        ]
    }
)

module.exports = {
    process1
}