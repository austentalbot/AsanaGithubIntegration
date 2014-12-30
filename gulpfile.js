var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
 
gulp.task('browserify', function() {
  return browserify('./client/app.js')
    .bundle()
    .pipe(source('./client/bundle.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('watchify', ['browserify'], function(){
  var bundleShare = function(b) {
    b.bundle()
      .pipe(source('./client/bundle.js'))
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

  b.add('./client/app.js');
  bundleShare(b);
});
