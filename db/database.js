const mongoose = require('mongoose')


var url= "mongodb://anuraagkamath:Anuraag123!@ds147451.mlab.com:47451/simple-process-management"
//var url = "mongodb://localhost:27017"

mongoose.connect(url, () => {
    console.log("DB connected successfully @ ", url);
})

module.exports = {
    mongoose
}