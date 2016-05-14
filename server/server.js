'use strict';

/* globals __dirname */

var loopback = require('loopback');
var boot = require('loopback-boot');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = module.exports = loopback();
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);
var exphbs  = require('express-handlebars');

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(express.static(path.join(__dirname, '../.build')));

var templateDir = path.join(__dirname, 'templates/');
app.set('views', templateDir);
app.engine('handlebars', exphbs({
  defaultLayout: 'index',
  layoutsDir: templateDir,
  helpers: {
    json: function(context) {
      return JSON.stringify(context);
    }
  }
}));
app.set('view engine', 'handlebars');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


// The access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken
}));

// Build the providers/passport config
var config = require('../providers.json');

app.middleware('session:before', loopback.cookieParser('asdf1212asdfasfas3434gggdfas'));
app.middleware('session', loopback.session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true
}));
passportConfigurator.init();

passportConfigurator.setupModels({
  userModel: app.models.FirepolUser,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}


