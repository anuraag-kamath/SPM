var mongoose=require('mongoose');
var emp_v1=mongoose.model("emp_v1",{"emp_v1":[{"name":{"type":"String","control":"text"},"age":{"type":"Number","control":"text"},"dob":{"type":"Date","control":"text"}}],"instanceId":{"type":"String"}});
module.exports={emp_v1}