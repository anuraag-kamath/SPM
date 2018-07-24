var mongoose=require('mongoose');
var particular=mongoose.model("particular",{"particular":[{"description":{"type":"String"},"cost":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={particular}