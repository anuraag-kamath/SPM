var mongoose=require('mongoose');
var test=mongoose.model("test",{"test":[{"alpha":{"type":"String"},"beta":{"type":"String"},"gamma":{"type":"String"}},],"instanceId":{"type":"String"}});
module.exports={test}