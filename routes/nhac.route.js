const route = require("express").Router();
const config = require("../config/config");
const nhacModel = require("../models/nhac.model");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//upload file image and mp3
let maxSize = 1 * 1024 * 1024;
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/nhac");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

let uploadFile = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext != ".png" && ext != ".jpeg" && ext != ".jpg" && ext != ".mp3") {
      cb(new Error("Invalid Fotmat"), false);
    }
    cb(null, true);
  },
  limits: { fieldSize: maxSize }
});

//--------------//

route.get("/getallnhac", (req, res) => {
  nhacModel.getAllNhac((err, nhac) => {
    if (err) throw err;
    res.json({ nhacs: nhac });
  });
});

route.put(
  "/createnhac",
  passport.authenticate("jwt", { session: false }),
  uploadFile.fields([{ name: "hinh" }, { name: "nhac" }]),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {
      console.log(req.body);
      nhacModel.getNhacByName(req.body.name, (err, rs) => {
        if (err) throw err;
        if (!rs) {
          let nhac = new nhacModel({
            name: req.body.name,
            theloai: req.body.theloai,
            yeuthich: req.body.yeuthich,
            hinh: req.files["hinh"][0].path,
            nhac: req.files["nhac"][0].path
          });

          nhacModel.createNhac(nhac, err => {
            if (err) throw err;
            res.json({
              success: true,
              msg: config.MESSAGE_THELOAI.THELOAI_THANH_CONG
            });
          });
        } else {
          res.json({
            success: false,
            msg: config.MESSAGE_NHAC.NHAC_DA_TON_TAI
          });
          fs.unlink("./" + req.files["hinh"][0].path, err => {
            if (err) throw err;
          });
          fs.unlink("./" + req.files["nhac"][0].path, err => {
            if (err) throw err;
          });
        }
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.post(
  "/updatenhac/:id",
  passport.authenticate("jwt", { session: false }),
  uploadFile.fields([{ name: "hinh" }, { name: "nhac" }]),
  (req, res) => {
    if (req.user.rule === 1) {
      if (req.files["hinh"] === undefined || req.files["nhac"] === undefined) {
        res.json({
          success: false,
          msg: config.MESSAGE_NHAC.NHAC_MISSING_FILE
        });
      } else {
        let newNhac = {
          name: req.body.name,
          theloai: req.body.theloai,
          yeuthich: req.body.yeuthich,
          hinh: req.files["hinh"][0].path,
          nhac: req.files["nhac"][0].path
        };

        nhacModel.updateNhacById(req.params.id, newNhac, (err, nhac) => {
          if(err) throw err;

          fs.unlink('./'+nhac.hinh,(err)=>{if(err) throw err;});
          fs.unlink('./'+nhac.nhac,(err)=>{if(err) throw err;});

          res.json({success : true , msg : config.MESSAGE_THELOAI.THELOAI_THANH_CONG});
        });
      }
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.delete(
  "/deletenhac/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.rule === 1) {
      nhacModel.getNhacById(req.params.id, (err, rs) => {
        if (err) throw err;
        if (rs) {
          nhacModel.deleteNhacById(rs._id, (err, nhac) => {
            if (err) throw err;
            if (!nhac) {
              console.log("asdas");
            } else {
              fs.unlink("./" + nhac.hinh, err => {
                if (err) throw err;
              });
              fs.unlink("./" + nhac.nhac, err => {
                if (err) throw err;
              });
              res.json({
                success: true,
                msg: config.MESSAGE_THELOAI.THELOAI_THANH_CONG
              });
            }
          });
        } else {
          res.json({
            success: false,
            msg: config.MESSAGE_NHAC.NHAC_KO_TON_TAI
          });
        }
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);
route.get("/nhacbytheloaiid/:id",(req,res)=>{
    nhacModel.getNhacByTheLoaiId(req.params.id,(err,nhac)=>{
        if(err) throw err;
        res.json({nhacs : nhac});
    });
});
module.exports = route;
