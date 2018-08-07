var mongoose = require('mongoose');
var emp_v2 = mongoose.model("emp_v2", { "emp_v2": [{ "name": { "type": "String", "control": "text" }, "dob": { "type": "Date", "control": "text" }, "email id": { "type": "String", "control": "text" } }], "instanceId": { "type": "String" } });
module.exports = { emp_v2 }