var mongoose=require('mongoose');
var empNew_v0=mongoose.model("empNew_v0",{"empNew_v0":[{"name":{"type":"String","control":"text"},"age":{"type":"Number","control":"text"},"dOB":{"type":"Date","control":"text"}}],"instanceId":{"type":"String"}});
module.exports={empNew_v0}