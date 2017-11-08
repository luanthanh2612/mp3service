const mongoose = require('mongoose');


const Schema = mongoose.Schema;
const nhacSchema = new Schema({
    name : {
        type : String,
        required : true,
        default : 'Music MP3'
    },
    theloai : {
        type : [String],
        required : true,
        default : []
    },
    hinh : {
        type : String,
        required : true,
    },
    yeuthich : {
        type : [String],
        default : []
    },
    nhac : {
        type : String,
        required : true
    }
},{collection : 'nhac'});

const nhacModel = module.exports = mongoose.model('nhac',nhacSchema,'nhac');

module.exports.getAllNhac = function(callback){
    nhacModel.find(callback);
}

module.exports.createNhac = function(nhac,callback){
    nhac.save(callback);
}

module.exports.getNhacByName = function(name,callback){
    nhacModel.findOne({name : name},callback);
}

module.exports.getNhacById = function(id,callback){
    nhacModel.findById({_id : id },callback);
}

module.exports.updateNhacById = function(id,nhac,callback){
    nhacModel.findByIdAndUpdate({_id : id },nhac,callback);
}

module.exports.deleteNhacById = function(id,callback){
    nhacModel.findByIdAndRemove({_id : id},callback);
}
module.exports.getNhacByTheLoaiId = function(id,callback){
    nhacModel.find({theloai : id},callback);
}


