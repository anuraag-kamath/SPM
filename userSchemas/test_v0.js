var mongoose=require('mongoose');
var test_v0=mongoose.model("test_v0",{"test_v0":[{"testtt2":{"type":"String","control":"radio","options":"12,23","pattern":"","required":false},"testttt":{"type":"String","control":"radio","options":"4334","pattern":"","required":false}}],"instanceId":{"type":"String"}});
module.exports={test_v0}