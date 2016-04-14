var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var braintree = require("braintree");
var routes = require('./routes/index');
var app = express();
var gateway;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, '.build')));




app.use('/', routes);
app.use("/client_token", function (req, res, next) {

   gateway.clientToken.generate({}, function (err, response) {
       if (err) {
           res.status(500).send({ 'error': err });

       }else {
           res.send({'token':response.clientToken});
       }
   });
});

app.post("/get_customer",function(req, res, next){
   var cusId = req.body.cusId;
   
   
   
   
   
   