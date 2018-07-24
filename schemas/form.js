var mongoose=require('mongoose');

var form1=mongoose.model('form',{
    name:{
        type: String
    },
    structure:[{
        id: String,
        name: String,
        tagName: String,
        parentId: String,
        parentName: String,
        class: String,
        height: String,
        width: String,
        display: String,
        overflow: String,
        bgc: String,
        color: String,
        align: String,
        padding:String,
        margin: String,
        holder:String,
        text: String,
        src: String,
        background: String,
        opacity: String,
        position: String,
        float: String,
        binding: String,
        border: String
    }]
});

module.exports = {
    form1
};