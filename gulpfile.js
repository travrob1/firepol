'use strict';

/* globals __dirname, process */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var less = require('gulp-less');
var path = require('path');
var Server = require('karma').Server;

var rename = require('gulp-rename');
var loopbackAngular = require('gulp-loopback-sdk-angular');

gulp.task('lb-services.js', function () {
    return gulp.src('./server/server.js')
    .pipe(loopbackAngular())
    .pipe(rename('lb-services.js'))
    .pipe(gulp.dest('.build/js'));
});

gulp.task('karma:integration', function (done) {
  new Server({
    configFile: __dirname + '/karma.integration.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('karma:integration:chrome', function (done) {
  new Server({
    browsers: ['Chrome'],
    configFile: __dirname + '/karma.integration.conf.js',
    singleRun: false
  }, done).start();
});

gulp.task('karma:unit', function (done) {
  new Server({
    configFile: __dirname + '/karma.unit.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['client', 'lb-services.js']);

gulp.task('client', ['less'], function() {
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

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
     gulp.watch('common/**/*', ['lb-services.js']);
     gulp.watch('client/**/*', ['client']);
}
