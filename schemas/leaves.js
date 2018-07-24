var mongoose=require('mongoose');
var leaves=mongoose.model("leaves",{"leaves":[{"number":{"type":"String"},"reason":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={leaves}