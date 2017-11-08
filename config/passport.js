

module.exports = function(passport){
    const secret = require('./config');
    const userModel = require('../models/user.model');
    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;

    let opt = {};
    opt.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opt.secretOrKey = secret.secret;

    passport.use(new JwtStrategy(opt,(jwt_payload,done)=>{
        userModel.getUserById(jwt_payload.data._id,(err,user)=>{
            if(err){
                return done(err,false);
            }
            if(user){
                return done(null,user);
            }else{
                return done(null,false);
            }
            
        });
    }));



}