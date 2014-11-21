var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
 
gulp.task('browserify', function() {
  return browserify('./app.js')
    .bundle()
    .pipe(source('./bundle.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watchify', function(){
  var bundleShare = function(b) {
    b.bundle()
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./'));
  };
  var b = browserify({
    cache: {},
    packageCache: {},
    fullPaths: true
  });
  b = watchify(b);
  b.on('update', function(){
    bundleShare(b);
  });

  b.add('./app.js');
  bundleShare(b);
});
