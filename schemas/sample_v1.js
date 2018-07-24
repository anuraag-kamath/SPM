var mongoose=require('mongoose');
var sample_v1=mongoose.model("sample_v1",{"sample_v1":[{"name":{"type":"String"},"age":{"type":"Number"}}],"instanceId":{"type":"String"}});
module.exports={sample_v1}