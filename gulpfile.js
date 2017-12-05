var gulp          = require('gulp');
var sass          = require('gulp-sass');
var rename        = require('gulp-rename');
var buffer        = require('vinyl-buffer');
var bro           = require('gulp-bro');
var cleanCSS      = require('gulp-clean-css');
var browserSync   = require('browser-sync').create();
var uglify        = require('gulp-uglify');


gulp.task('copy', function() {
  gulp.src(['./src/**/*.html','./src/**/*.csv'])
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('./src/app/app.js')
    .pipe(bro())
    // .pipe(buffer())
    // .pipe(uglify({ mangle: false }))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('scss', function() {
  gulp.src('./src/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/assets/css'));
});

gulp.task('browser-sync', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './dist',
      routes: {
        '/node_modules': 'node_modules'
      }
    },
    browser: 'google chrome'
  });
});

gulp.task('build',['scripts', 'scss', 'copy']);

gulp.task('default', ['browser-sync'], function(){
  gulp.watch('./src/**/*.*', ['build']);
  gulp.watch('./dist/**/*.*').on('change', browserSync.reload);
});
