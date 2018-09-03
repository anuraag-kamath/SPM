const mongoose = require('mongoose')


var url = process.env.SPM_MONGODB_URL || "mongodb://mongo:27017/mydms"

mongoose.connect(url, () => {
    console.log("SPM DB connected successfully @ ", url);
})

module.exports = {
    mongoose
} 