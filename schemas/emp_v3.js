var mongoose=require('mongoose');
var emp_v3=mongoose.model("emp_v3",{"emp_v3":[{"name":{"type":"String","control":"text"},"current time":{"type":"Date","control":"text"},"age":{"type":"Number","control":"text"}}],"instanceId":{"type":"String"}});
module.exports={emp_v3}