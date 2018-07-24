var mongoose = require('mongoose');
var user = mongoose.model("user", { "user": { "username": { "type": "String" }, "password": { "type": "String" }, "roles": [{ "type": "String" }] }, "instanceId": { "type": "String" } });
module.exports = { user }