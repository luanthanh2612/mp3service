const route = require("express").Router();
const userModel = require("../models/user.model");
const config = require("../config/config");
const passport = require("passport");
const jwt = require("jsonwebtoken");

route.get(
  "/profileuser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({user :req.user});
  }
);

route.put("/dangkyuser", (req, res) => {
  let user = new userModel({
    username: req.body.username,
    password: req.body.password,
    name: req.body.name,
    rule: req.body.rule
  });

  userModel.createUser(user, err => {
    if (err) {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_DA_TON_TAI });
    } else {
      res.json({ success: true, msg: config.MESSAGE_USER.USER_THANH_CONG });
    }
  });
});

route.post("/dangnhapuser", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  userModel.getUserByUserName(username, (err, user) => {
    if (!user) {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_NOT_FOUND });
    } else {
      userModel.comparePassword(password, user.password, (err, data) => {
        if (data) {

          let token = jwt.sign({ data: user }, config.secret, {
            expiresIn: 604800
          });

          res.json({ success: true, token: "JWT " + token });
        } else {
          res.json({
            success: false,
            msg: config.MESSAGE_USER.USER_WRONG_PASSWORD
          });
        }
      });
    }
  });
});

route.post(
  "/updateuser/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {
      userModel.checkUserById(req.params.id, (err, data) => {
        if (err) throw err;
        if (data) {
          let userModify = req.body;
          userModel.updateUserById(req.params.id, userModify, (err, data) => {
            if (err) throw err;
            res.json({
              success: true,
              msg: config.MESSAGE_USER.USER_THANH_CONG
            });
          });
        } else {
          res.json({ success: false, msg: config.MESSAGE_USER.USER_NOT_FOUND });
        }
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.get(
  "/getalluser",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {
      userModel.getAllUser((err, listUser) => {
        if (err) throw err;
        res.json({ success: true, list: listUser });
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.delete(
  "/deleteuser/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    let user = req.user;
    if (user.rule === 1) {
      userModel.checkUserById(req.params.id, (err, data) => {
        if (err) throw err;
        if (data) {
          userModel.deletUserById(req.params.id, (err, rs) => {
            if (err) throw err;
            res.json({
              success: true,
              msg: config.MESSAGE_USER.USER_THANH_CONG
            });
          });
        } else {
          res.json({ success: false, msg: config.MESSAGE_USER.USER_NOT_FOUND });
        }
      });
    } else {
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
  }
);

route.get('/getuser/:id',passport.authenticate('jwt',{session : false}),(req,res)=>{
    if(req.user.rule === 1){
      userModel.getUserById(req.params.id,(err,user)=>{
          if(err) throw err;
          res.json(user);
      });
    }else{
      res.json({ success: false, msg: config.MESSAGE_USER.USER_TU_CHOI });
    }
});

module.exports = route;
