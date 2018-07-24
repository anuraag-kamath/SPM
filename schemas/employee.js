var mongoose=require('mongoose');
var employee=mongoose.model("employee",{"employee":[{"name":{"type":"String"},"age":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={employee}