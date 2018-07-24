var mongoose=require('mongoose');
var beta=mongoose.model("beta",{"beta":[{"b":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={beta}