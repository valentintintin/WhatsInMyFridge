'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
 
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: 'www'
    },
  });

  gulp.watch("www/**/*").on('change', browserSync.reload);
});

gulp.task('build', function() {
  return gulp.src('www/index.html')
      .pipe(useref())
      .pipe(gulp.dest('www/'));
});

gulp.task('default', ['serve']);