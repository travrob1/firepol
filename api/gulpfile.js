'use strict';

/* globals __dirname */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var Server = require('karma').Server;



gulp.task('karma:integration', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('mocha:integration', function() {
    return gulp
        .src('common/**/*integration.spec.js')
        .pipe(mocha({reporter:'nyan'}));
});

gulp.task('tests:integration', function() {
    return gulp
        .src('common/**/*integration.spec.js')
        .pipe(mocha({reporter:'nyan'}));
});

gulp.task('tests:unit', function() {
    console.log('we need to get to work on this');
});
