var mongoose=require('mongoose');
var testEl=mongoose.model("testEl",{"testEl":[{"name":{"type":"String"}}],"instanceId":{"type":"String"}});
module.exports={testEl}