const route = require("express").Router();
const theLoaiModel = require("../models/theloai.model");
const config = require("../config/config");
const passport = require("passport");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

//upload file
let maxSize = 100 * 1024 * 1024;
let storage = multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./public/theloai')
    },
    filename : (req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
});

let upload = multer({
    storage : storage,
    fileFilter : (req,file,cb)=>{
        var ext = path.extname(file.originalname);
        if(ext != '.png' && ext != '.jpg' && ext !== '.jpeg'){
            return cb(new Error('Chi duoc chon hinh'));
        }
        cb(null,true);
    },
    limits : {fileSize  : maxSize}
});
//----------------------//

route.get("/getalltheloai", (req, res) => {

  theLoaiModel.getAllTheLoai((err, listTheLoai) => {
    if (err) throw err;
    res.json({listTheLoai : listTheLoai});
  });
});

route.put(
  "/taotheloai",
  passport.authenticate("jwt", { session: false }),upload.single('hinhTL'),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {
      let theLoai = new theLoaiModel({
        tenTL: req.body.tenTL,
        hinhTL: req.file.path
      });

      theLoaiModel.getTheLoaiByTenTL(theLoai.tenTL, (err, rs) => {
        if (err) throw err;
        if (!rs) {
          theLoaiModel.createTheLoai(theLoai, err => {
            if (err) throw err;
            res.json({
              success: true,
              msg: config.MESSAGE_THELOAI.THELOAI_THANH_CONG
            });
          });
        } else {
          fs.unlink('./'+req.file.path,(err)=>{
            if(err) throw err;
            res.json({
              success: false,
              msg: config.MESSAGE_THELOAI.THELOAI_DA_TON_TAI
            });
          });
        }
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.post(
  "/updatetheloai/:id",
  passport.authenticate("jwt", { session: false }),upload.single('hinhTL'),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {

      if(req.file === undefined){
       res.json({success : false,msg : config.MESSAGE_NHAC.NHAC_MISSING_FILE});
      }else{
        let theLoai = {
          tenTL : req.body.tenTL,
          hinhTL : req.file.path
        }
        theLoaiModel.updateTheLoaiById(req.params.id, theLoai, (err, rs) => {
          if (err) throw err;
          let linkHinh = './'+rs.hinhTL;
          if(linkHinh === '' || linkHinh === undefined){
            console.log('Error link not found');
          }else{
            fs.unlink(linkHinh,(err)=>{if(err) throw err;});
            res.json({
              success: true,
              msg: config.MESSAGE_THELOAI.THELOAI_THANH_CONG
            });
          }
         
        });
      }
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.get("/gettheloaibyid/:id",passport.authenticate('jwt',{session : false}),(req,res)=>{
  let user = req.user;
  if(user.rule === 1){
      theLoaiModel.getTheLoaiById(req.params.id,(err,rs)=>{
          if(err) throw err;
          res.json({theLoai : rs});
      });
  }else{
    res.json({success : false, msg : config.MESSAGE_USER.USER_TU_CHOI});
  }
});

route.delete("/deletetheloai/:id",passport.authenticate('jwt',{session : false}), (req, res) => {

    let user = req.user;
    if(user.rule === 1) {
        theLoaiModel.getTheLoaiById(req.params.id,(err,rs)=>{
            if(err) throw err;
            if(rs){
                theLoaiModel.deleteTheLoaiById(req.params.id,(err)=>{
                    if(err) throw err;
                    fs.unlink('./' + rs.hinhTL,(err)=>{
                      if(err) throw err
                      res.json({success : true, msg : config.MESSAGE_THELOAI.THELOAI_THANH_CONG});
                    });
                });
            }else{
                res.json({success : false, msg : config.MESSAGE_THELOAI.THELOAI_NOT_FOUND});
            }
        });
    }else{
        res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }

});

route.post('/gettheloailimit',(req,res)=>{
    var skip = parseInt(req.body.skip);
    var limit = parseInt(req.body.limit);
    theLoaiModel.getTheLoaiLimit(skip,limit,(err,data)=>{
        if(err) throw err;
        if(data.length > 0){
          res.json({success : true,listTheLoai : data});
        }else{
          res.json({success : false, msg : 'Da het du lieu'});
        }
       
    });
});

module.exports = route;
