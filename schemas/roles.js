var mongoose = require('mongoose');
var roles = mongoose.model("roles", { "roles": [{ "roleName": { "type": "String" }, "description": { "type": "String" }, "type": { "type": "String" }, "mode": { "type": "String" } }], "instanceId": { "type": "String" } });
module.exports = { roles }