var express = require('express');
var router = express.Router();
var multer=require("multer");
var index=require("./index");
var contact=require("../model/model");


router.get("/",function(req,res){
    contact.find({},function(err,result){
        if(err){
            console.log("Chi tiết trả về lỗi");
        }else{
            console.log(result);
            
        }
        res.render("chi-tiet",{title:"EXPRESS",productShow:req.session.idsp,data:result,idsanpham:null});
    })
})
router.get('/:id',function(req,res){
    id=req.params.id;
    if(!req.session.idsp){
        req.session.idsp=[];
    }
    if(req.session.idsp.indexOf(id)<0){
        req.session.idsp.push(id);
    }
    contact.find({},function(err,result){
        if(err){
            console.log("Chi tiết trả về lỗi");
        }else{
            console.log(result);
        }
        res.render("chi-tiet",{title:"EXPRESS",productShow:req.session.idsp,data:result,idsanpham:id});
    })
})

module.exports=router;