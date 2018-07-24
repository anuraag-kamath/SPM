var mongoose=require('mongoose');
var sample_v2=mongoose.model("sample_v2",{"sample_v2":[{"name":{"type":"String"},"age":{"type":"Number"},"SOMETHING":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={sample_v2}