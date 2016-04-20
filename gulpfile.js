'use strict';

/* globals __dirname */

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');
var less = require('gulp-less');
var path = require('path');
var Server = require('karma').Server;



gulp.task('karma:integration', function (done) {
  new Server({
    configFile: __dirname + '/karma.integration.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('karma:unit', function (done) {
  new Server({
    configFile: __dirname + '/karma.unit.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['less'], function() {
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
     gulp.watch('client/**/*', ['default']);
}
