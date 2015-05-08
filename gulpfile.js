var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var header = require('gulp-header');
var fs = require('fs');
var _ = require('lodash');

var BANNER = fs.readFileSync('./banner.js') + '\n\n';
var pkg = require('./package.json');

gulp.task('jsmpeg', function() {
  browserify({
    entries: ['./jsmpeg/jsmpeg.js'],
    standalone: 'jsmpeg'
  })
    .bundle()
    .pipe(source('jsmpeg.js'))
    .pipe(header(
      BANNER,
      _.defaults({
        name: 'jsmpeg',
        description: 'A MPEG1 Video Decoder in JavaScript'
      }, pkg)
    ))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('scripts', function() {
  browserify({
    entries: ['./src/index.js'],
  })
    .bundle()
    .pipe(source('jsmpeg-inline.js'))
    .pipe(header(BANNER, pkg))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('watch', function () {
  gulp.watch(['./jsmpeg/*.js', './src/*.js'], ['jsmpeg', 'scripts']);
});
