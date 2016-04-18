var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var mocha = require('gulp-mocha');

gulp.task('tests:integration', function() {
    return gulp
        .src('common/**/*integration.spec.js')
        .pipe(mocha({reporter:'nyan'}));
});

gulp.task('tests:unit', function() {
    console.log('we need to get to work on this');
});
