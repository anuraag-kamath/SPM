var mongoose = require('mongoose');
var user = mongoose.model("user", { "user": { "email": { "type": "String" }, "activationId":{"type":"String"}, "activated": { "type": "Boolean" }, "username": { "type": "String" }, "deactivated": { "type": "Boolean" }, "password": { "type": "String" }, "roles": [{ "type": "String" }] }, "instanceId": { "type": "String" } });
module.exports = { user }