var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
// var concat = require('gulp-concat');

gulp.task('jsmpeg', function() {
  browserify({
    entries: ['./src/jsmpeg.js'],
    standalone: 'jsmpeg'
  })
    .bundle()
    .pipe(source('jsmpeg.js'))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('ext', function() {
  browserify({
    entries: ['./ext/index.js'],
    // standalone: 'jsmpeg'
  })
    .bundle()
    .pipe(source('jsmpeg-ext.js'))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.js', './ext/*.js'], ['jsmpeg', 'ext']);
});
