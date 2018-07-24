var mongoose = require('mongoose');
var alpha = mongoose.model("alpha", { "alpha": [{ "name": { "type": "String" } }], "instanceId": { "type": "String" } });
module.exports = { alpha }