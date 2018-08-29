const mongoose = require('mongoose')


var url = process.env.SPM_MONGODB_URL || "mongodb://mongo:27017/mydms"
//var url = "mongodb://localhost:27017"
//var url="mongodb://localhost:27017"
mongoose.connect(url, () => {
    console.log("DB connected successfully @ ", url);
})

module.exports = {
    mongoose
} 