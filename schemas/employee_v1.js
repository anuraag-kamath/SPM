var mongoose=require('mongoose');
var employee_v1=mongoose.model("employee_v1",{"employee_v1":[{"name":{"type":"String"},"age":{"type":"Boolean"}}],"instanceId":{"type":"String"}});
module.exports={employee_v1}