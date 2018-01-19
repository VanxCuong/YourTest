var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');
var users = require('./routes/users');
var users = require('./routes/chi-tiet');
var mongoose=require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/tonghop',{useMongoClient: true},function(err){
  if(err){
    throw err
  }else{
    console.log('Kết nối database thành công');
  }
});
var contact=require("./model/model");
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var session=require("express-session");
app.use(session({
  secret: 'MasterTVC',
  resave: false,
  saveUninitialized: true
  // cookie: { secure: true }
}))
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/chi-tiet', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.locals.tieude="My App";
console.log(app.locals.tieude);

app.locals.sumData=contact.find({},function(err,result){
  console.log(result);
});
module.exports = app;
