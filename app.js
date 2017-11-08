const express = require('express');
const app = express();

const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/config');

//mongoose
mongoose.connect(config.DATABASE_URL,{useMongoClient : true},(err)=>{if(err) throw err});
mongoose.Promise = global.Promise


//Middleware
app.use('/public',express.static(path.join(__dirname+'/public')));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

require('./config/passport')(passport);


//socket



//router
app.use('/api',[require('./routes/theloai.route'),require('./routes/nhac.route'),require('./routes/user.route')]);
app.use('/*',(req,res)=>res.send('404 not found'));

app.listen(process.env.PORT || 3000,()=>{
    console.log('Server da chay o port 3000');
});





