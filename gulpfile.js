var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var header = require('gulp-header');
var fs = require('fs');
// var concat = require('gulp-concat');

var BANNER = fs.readFileSync('./banner.js');
var pkg = require('./package.json');

gulp.task('jsmpeg', function() {
  browserify({
    entries: ['./src/jsmpeg.js'],
    standalone: 'jsmpeg'
  })
    .bundle()
    .pipe(source('jsmpeg.js'))
    .pipe(header(BANNER + '\n\n', { pkg: pkg }))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('ext', function() {
  browserify({
    entries: ['./ext/index.js'],
  })
    .bundle()
    .pipe(source('jsmpeg-ext.js'))
    .pipe(header(BANNER + '\n\n', { pkg: pkg }))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.js', './ext/*.js'], ['jsmpeg', 'ext']);
});
