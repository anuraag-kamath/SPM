const mongoose = require('mongoose')

var url = "mongodb://localhost:27017"

mongoose.connect(url, () => {
    console.log("DB connected successfully @ ", url);
})

module.exports = {
    mongoose
}