'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
 
gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: 'www'
    },
  });

  gulp.watch("www/**/*").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);