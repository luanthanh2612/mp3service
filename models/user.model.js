const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rule: {
    type: Number,
    default: 0
  }
});

const userModel = (module.exports = mongoose.model("user", userSchema));

module.exports.getAllUser = function(callback) {
  userModel.find(callback);
};

module.exports.getUserById = function(id, callback) {
  userModel.findById({ _id: id }, callback);
};

module.exports.checkUserById = function(id, callback) {
  userModel.findOne({ _id: id },callback);
};

module.exports.getUserByUserName = function(username, callback) {
  userModel.findOne({ username: username }, callback);
};

module.exports.createUser = function(user, callback) {
  userModel.findOne({ username: user.username }, (err, rs) => {
    if (rs == null) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.save(callback(false));
        });
      });
    } else {
      console.log("Da co user ton tai");
      return callback(true);
    }
  });
};

module.exports.deletUserById = function(id, callback) {
  userModel.findByIdAndRemove({ _id: id }, callback);
};

module.exports.updateUserById = function(id, modifyUser, callback) {
  userModel.findByIdAndUpdate({ _id: id }, modifyUser,{new : true}, callback);
};

module.exports.comparePassword = function(neWpassword, passwordHash, callback) {
  bcrypt.compare(neWpassword, passwordHash, callback);
};

