var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', function() {
    return gulp
        .src('public/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./.build/js'));
});

gulp.task('prod', function() {
    return gulp
        .src('public/**/*.js')
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./.build/js'));
});



if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
     gulp.watch('public/**/*.js', ['default']);
}
