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

gulp.task('default', function() {
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

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
     gulp.watch('client/**/*.js', ['default']);
}
