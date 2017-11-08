const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const theLoaiSchema = new Schema({
  tenTL: {
    type: String,
    required: true,
    default : 'MP3 PRO'
  },
  hinhTL: {
    type: String,
    required: true
  }
});

const theLoaiModel = (module.exports = mongoose.model(
  "theloai",
  theLoaiSchema
));

module.exports.createTheLoai = function(theloai, callback) {
  theloai.save(callback);
};

module.exports.getTheLoaiByTenTL = function(tenTl, callback) {
  theLoaiModel.findOne({ tenTL: tenTl }, callback);
};

module.exports.getTheLoaiById = function(id, callback) {
  theLoaiModel.findById({ _id: id }, callback);
};

module.exports.getAllTheLoai = function(callback) {
  theLoaiModel.find(callback);
};

module.exports.deleteTheLoaiById = function(id, callback) {
  theLoaiModel.findByIdAndRemove({ _id: id }, callback);
};

module.exports.updateTheLoaiById = function(id, theloai, callback) {
  theLoaiModel.findByIdAndUpdate({ _id: id }, theloai, callback);
};

module.exports.getTheLoaiLimit = function(skip,limit,callback){
  theLoaiModel.find(callback).skip(skip).limit(limit);
}
