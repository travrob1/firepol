var gulp = require('gulp'),
    concat = require('gulp-concat'),
    livereload = require('gulp-livereload'),
    replace = require('gulp-replace'),
    tasks = [],
    filesToWatch = [],
    version = '0.' + process.pid;

Array.prototype.extend = function(stuff) {
    Array.prototype.push.apply(this, stuff);
}
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
String.prototype.startsWith = function(prefix) {
    return this.indexOf(prefix, 0) !== -1;
};

function combineAssets(destFolder, destBasename, files) {
    var tag = destFolder + destBasename
    gulp.task(tag, function() { 
        return gulp.src(files) 
            .pipe(concat(destBasename))
            .pipe(replace(/__gulp.Version__/g, version))
            .pipe(gulp.dest(destFolder))
            .pipe(livereload()); 
    });
    tasks.push(tag);
    filesToWatch.extend(files);
}

function copyAssets(destFolder, glob, files) {
    var tag = destFolder + ', ' + glob;
    var filesWGlob = files.map(function(x) { return x + glob });
    gulp.task(tag, function() {
        return gulp.src(filesWGlob)
            .pipe(replace(/__gulp.Version__/g, version))
            .pipe(gulp.dest(destFolder))
            .pipe(livereload()); 
    });
    tasks.push(tag);
    filesToWatch.extend(filesWGlob);
}

function copyBinaryAssets(destFolder, glob, files) {
    var tag = destFolder + ', ' + glob;
    var filesWGlob = files.map(function(x) { return x + glob });
    gulp.task(tag, function() {
        return gulp.src(filesWGlob)
            .pipe(gulp.dest(destFolder));
    });
    tasks.push(tag);
    filesToWatch.extend(files);
}

var mainStaticFiles = [
    // lodash                                                                                                                                                                                                       
    'main/bower_components/lodash/lodash.min.js',
    
    // jQuery library                                                                                                                                                                                               
    'main/bower_components/jquery/dist/jquery.min.js',
    'main/bower_components/jquery-ui/jquery-ui.min.js',
    
    // angular                                                                                                                                                                                                      
    'main/bower_components/angular/angular.js',
    'main/bower_components/angular-route/angular-route.min.js',
    'main/bower_components/angular-resource/angular-resource.min.js',
    'main/bower_components/angular-modal-service/dst/angular-modal-service.js',
    
    // Latest compiled JavaScript                                                                                                                                                                                   
    'main/bower_components/bootstrap/dist/js/bootstrap.min.js',
    
    // blueimp javascript                                                                                                                                                                                           
    // The Load Image plugin is included for the preview images and image resizing functionality                                                                                                                    
    'main/bower_components/blueimp-load-image/js/load-image.all.min.js',
    // The Canvas to Blob plugin is included for image resizing functionality                                                                                                                                       
    'main/bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.min.js',
    // blueimp Gallery script <script src=""></script>                                                                                                                                                              
    // The Iframe Transport is required for browsers without support for XHR file uploads                                                                                                                           
    // The basic File Upload plugin                                                                                                                                                                                 
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload.js',
    // The File Upload processing plugin                                                                                                                                                                            
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-process.js',
    // The File Upload image preview & resize plugin                                                                                                                                                                
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-image.js',
    // The File Upload audio preview plugin                                                                                                                                                                         
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-audio.js',
    // The File Upload video preview plugin                                                                                                                                                                         
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-video.js',
    // The File Upload validation plugin                                                                                                                                                                            
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-validate.js',
    // The File Upload Angular JS module                                                                                                                                                                            
    'main/bower_components/blueimp-file-upload/js/jquery.fileupload-angular.js',
    'main/excelsior_utilities.js',
].map(function(filename) {
    if (filename.endsWith('min.js') && ! (filename.endsWith('all.min.js')) )
        return filename.substr(0, filename.length-6) + 'js';
    else
        return filename;
});
console.log(mainStaticFiles);
combineAssets('main/static/', 'modules.js', mainStaticFiles);

var moduleScripts = [];
var moduleStyles = [];
var modules = ['excelsior', 'bio'];
for (var i = 0; i < modules.length; i++) {
    var moduleName = modules[i];

    moduleScripts.extend([moduleName + '/src/*.js',
                          moduleName + '/src/**/*.js']);
    moduleStyles.extend([moduleName + '/src/*.css',
               moduleName + '/src/**/*.css']);

    copyAssets(moduleName + '/static/' + moduleName + '/', '*.html',
               [moduleName + '/src/',
                moduleName + '/src/**/']);

    copyBinaryAssets(moduleName + '/static/' + moduleName + '/', '*.{png,jpeg}',
                     [moduleName + '/src/',
                      moduleName + '/src/**/']);
}
combineAssets('main/static/', 'style.css', moduleStyles);

moduleScripts.extend([
    'main/src/*.js',
    'main/src/**/*.js'
]);
combineAssets('excelsior/static/', 'excelsior.js', moduleScripts);


copyAssets('main/static/', '*.{html,css}',
           ['main/src/',
            'main/src/**/']);

copyBinaryAssets('main/static/', '*.{png,jpeg}',
           ['main/src/',
            'main/src/**/']);

gulp.task('default', tasks);

console.log(filesToWatch);
gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(filesToWatch, tasks);
});
