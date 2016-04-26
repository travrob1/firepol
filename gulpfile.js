'use strict';

/* globals __dirname, process */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var less = require('gulp-less');
var path = require('path');
var KarmaServer = require('karma').Server;
var exec = require('child_process').exec;
var fs = require('fs');
var _ = require('lodash');

var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');

function removeFilesSync(dirPath) {
      //console.log('shutdown');
      var files;
      try { files = fs.readdirSync(dirPath); }
      catch(e) { return; }
      if (files.length > 0)
        for (var i = 0; i < files.length; i++) {
          var filePath = dirPath + '/' + files[i];
          if (fs.statSync(filePath).isFile())
            fs.unlinkSync(filePath);
          else
            removeFilesSync(filePath);
        }
      fs.rmdirSync(dirPath);
    }

gulp.task('lb-services.js', function () {
    return gulp.src('./server/server.js')
    .pipe(loopbackAngular())
    .pipe(rename('lb-services.js'))
    .pipe(gulp.dest('.build/js'));
});

gulp.task('integration-server', function (cb) {
    if(process.env.NODE_ENV !== 'integration') {
      throw Error('integration-server is expected to be run with NODE_ENV=integration');
    }

    fs.exists('./.tmp-integration-data', function(status) {
      if (status) {
        removeFilesSync('./.tmp-integration-data');
      }
      fs.mkdirSync('./.tmp-integration-data');
      start();
    });

    var Db = require('mongodb').Db, 
      Server = require('mongodb').Server;

    function startMongo() {
        exec('mongod --port 3124 --dbpath ./.tmp-integration-data', function (err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          cb(err);
        });
    }

    function startApiServer() {
        exec('PORT=3123 node server/server.js', function (err, stdout, stderr) {
          console.log(stdout);
          console.log(stderr);
          cb(err);
        });
    }

    function createAdminUser(cb) {
        var db = new Db('firepol-integration', new Server('localhost', 3124));
        db.dropDatabase();
        db.open(function (err, db) {
          if (err) throw err;

          // Use the admin database for the operation
          var adminDb = db.admin();

          adminDb.authenticate('adminLogin', 'adminPwd', function (err, result) {
            db.addUser('firepol-integration', 'firepol-integration', function (err, result) {
              console.log(err, result);
              //cb();
            });
          });
        });
    }

    function start() {
        startMongo();
        setTimeout(function() {
          createAdminUser(startApiServer);
          setTimeout(function() {
              startApiServer();
                setTimeout(function() {
      //                process.exit();
                }, 1000);
          }, 1000);
        }, 1000);
    } 

});

gulp.task('karma:integration', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.integration.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('karma:integration:chrome', function (done) {
  new KarmaServer({
    browsers: ['Chrome'],
    configFile: __dirname + '/karma.integration.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('karma:unit', function (done) {
  new KarmaServer({
    configFile: __dirname + '/karma.unit.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['client.js', 'less', 'lb-services.js'], function() {
  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
      gulp.watch('common/**/*', ['lb-services.js']);
      gulp.watch('client/**/!(*.spec).js', ['client.js']);
      gulp.watch('client/css/**/*.less', ['less']);
  }
});

gulp.task('client.js', function() {
    return gulp
        .src('client/**/!(*.spec).js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('.build/js'));
});

gulp.task('prod', function() {
    return gulp
        .src('client/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('.build/js'));
});

gulp.task('less', function () {
  return gulp.src('client/css/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('client/css'));
});

