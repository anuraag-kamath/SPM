const mongoose = require('mongoose')


var url= "mongodb://anuraagkamath:Anuraag123!@ds159641.mlab.com:59641/spm"
//var url = "mongodb://localhost:27017"
//var url="mongodb://localhost:27017"
mongoose.connect(url, () => {
    console.log("DB connected successfully @ ", url);
})

module.exports = {
    mongoose
} 