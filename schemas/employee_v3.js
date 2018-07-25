var mongoose=require('mongoose');
var employee_v3=mongoose.model("employee_v3",{"employee_v3":[{"name":{"type":"String","control":"text"},"address":{"type":"String","control":"text"}}],"instanceId":{"type":"String"}});
module.exports={employee_v3}