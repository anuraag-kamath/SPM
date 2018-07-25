var mongoose=require('mongoose');
var employee_v2=mongoose.model("employee_v2",{"employee_v2":[{"name":{"type":"String","control":"text"}}],"instanceId":{"type":"String"}});
module.exports={employee_v2}