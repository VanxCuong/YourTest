var express = require('express');
var router = express.Router();
var multer=require("multer");
var contact=require("../model/model");
var noMatch=null;

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null,file.originalname)
  }
})
//check upload
function fileFilter (req, file, cb) {
  if(!file.originalname.match(/\.(jpg|png|gif|jqeg)$/)){
    cb(new Error('Bạn Chỉ được upload file ảnh'));
    console.log('Bạn chỉ được upload file Ảnh');
    
  }else{
    cb(null, true);
  }
}
var upload = multer({ storage: storage,fileFilter:fileFilter }).single('images');
/* GET home page. */
/**
 * Phân Trang
 */
var sobaiviet=3;
function phantrang(cb){
  contact.find({},function(err,result){
    cb(result.length);
  });
  return cb;
}


/**
 * Hàm tìm kiếm trung gian.
 * @param {*} res : server trả về
 * @param {*} views : đối tượng cần views
 * @param {*} objects : điều kiện find()
 */
function timkiem(res,views,objects){
  contact.find(objects,function(err,result){
    res.render(views, { title: 'Express',data:result });
  })
}
module.exports=timkiem;
/**
 * interface insert product
 */
router.get('/insert', function(req, res, next) {
  res.render('insert', { title: 'Express' });
});
/**
 * insert product
 */
router.post('/insert', function(req, res, next) {
  upload(req, res, function (err) {
    var dl={
    title:req.body.title,
    description:req.body.des,
    images:req.file.originalname
    }
    if(req.file==undefined) {
      res.send("Yêu cầu bạn thêm hình ảnh");
    }else{
      contact.create(dl,function(err,result){
         res.redirect('/');
        }
      );
    }
  })
  
});

/**
 * Search product
 */
// router.post('/search',function(req,res,next){
//   product=req.body.searchsp;
//   const regex=new RegExp(escapeRegex(product),'gi');
//   contact.find({title:regex},function(err,result){

//   })
// });
/**
 *  Show giao diện chỉnh sửa
 */
router.get('/edit/:id', function(req, res, next) {
  views="edit";
  id=req.params.id;
  objects={_id:id};
  timkiem(res,views,objects);
});
/**
 * Chỉnh sửa id
 */

function updatenow(id,dl,res){
  contact.update({_id:id},dl,function(err,result){
    if(err){
      console.log('Update thất bại');
    }else{
      res.redirect('/');
    }
  })
}
router.post('/edit/:id', function(req, res, next) {
  upload(req, res, function (err) {
    var id=req.params.id, 
        title=req.body.title,
        description=req.body.des;
    //console.log(req.file); // -> Thêm gì cũng bị lỗi ngoại trừ thêm chính ảnh gốc
    if(err){
      console.log('Lỗi rồi:'+err);  
    }else{
      if(req.file==undefined){
        dl={
          title:title,
          description:description
        }
        updatenow(id,dl,res);
      }else{
        dl={
          title:title,
          description:description,
          images:req.file.originalname
        }
        updatenow(id,dl,res);
      }
    }
  })
  
});
/**
 * Phân trang / page / id++
 */
// router.get('/page/:id',function(req,res,next){
//   var id=req.params.id,
//       offset=(id-1)*sobaiviet,
//       pageId={pageId:id};
//       contact.find().limit(sobaiviet).skip(offset).exec(function(err,result){
//         phantrang(function(rs){
//           rs=Math.ceil(rs/sobaiviet);
//           res.render("index",{title:"EXPRESS",data:result,page:rs,pageId:pageId});
//         })
//       })
// });
function escapeRegex(text) {
  return text.replace(/[-[\]({})*+?.,\\^$|#\s]/g, "\\$&");
};
/**
 * Phân trang / page / id++
 */
router.get('/page/:id',function(req,res,next){
  var id=req.params.id,
  //logic phân trang
  offset=(id-1)*sobaiviet, // location product
  pageId={pageId:id},  
  product=req.query.searchsp;  // dữ liệu server trả về
  // Nếu nhận dc dữ liệu từ input.search thì trả về sản phẩm theo tìm kiếm
  if(req.query.searchsp){
    const regex=new RegExp(escapeRegex(product),'gi');
    contact.find({title:regex}).exec(function(err,result){
      // Nếu ko tìm đc bản ghi => gán noMach=ko tìm thấy và in ra màn hình
      noMatch=null; // Trước khi kiểm tra kết quả gán noMatch=null
      if(result.length<1){
        noMatch="Không tìm thấy sản phẩm bạn yêu cầu";
      }      
      rs=Math.ceil(result.length/result.length);
      res.render("index",{title:"EXPRESS",data:result,page:rs,pageId:pageId,noMatch:noMatch});
    })
  }else{   // Nếu không có yêu cầu từ khách hàng => trả về tất cả danh sách sản phẩm
    contact.find().limit(sobaiviet).skip(offset).exec(function(err,result){
      phantrang(function(rs){
        rs=Math.ceil(rs/sobaiviet);
        res.render("index",{title:"EXPRESS",data:result,page:rs,pageId:pageId,noMatch:null});
      })
    })
  }
  
      
});
/**
 * Trang chủ. Show tổng hợp
 */
router.get('/', function(req, res, next) {
  var noMach=null;
  pageId={pageId:1};
  contact.find().limit(sobaiviet).exec(function(err,result){
    phantrang(function(rs){
      rs=Math.ceil(rs/sobaiviet);
      res.render("index",{title:"EXPRESS",data:result,page:rs,pageId:pageId,noMatch:noMatch});
    })
  })
});
/**
 * Xóa id sp
 */
router.get('/delete/:id', function(req, res, next) {
  var id=req.params.id;
  contact.remove({_id:id},function(err,result){
     res.redirect('/');
  })
});


module.exports = router;
