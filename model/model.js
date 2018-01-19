var mongoose=require("mongoose");
var contact=mongoose.Schema({
    title:"String",
    description:"String",
    images:"String"
});
module.exports=mongoose.model('contact',contact);