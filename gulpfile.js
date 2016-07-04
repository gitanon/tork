'use strict';

var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var cssnano = require('gulp-cssnano');
var del = require('del');
var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var stylus = require('gulp-stylus');

// Develop
// _______

gulp.task('browserSync', function() {
  var files = [
    'css/main.css',
    'index.html'
  ];

  browserSync.init(files, {
    server: {
      baseDir: 'dev'
    },
  });
});

gulp.task('pug', function() {
  return gulp.src('src/index.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('dev'));
});

gulp.task('stylus', function () {
  return gulp.src('src/main.styl')
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dev/css'));
});

gulp.task('images', function(){
  return gulp.src(['src/**/*.{png,jpg}', '!src/**/sprite*.{png,jpg}'])
  .pipe(gulp.dest('dev/img'));
});

gulp.task('sprite:dev', ['clean:sprite'], function () {
  var spriteData = gulp.src('src/**/sprite-*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl',
    imgPath: '../img/sprite.png'
  }));
  spriteData.img.pipe(gulp.dest('dev/img'));
  spriteData.css.pipe(gulp.dest('src/blocks/common'));
});

gulp.task('clean:sprite', function() {
  return del.sync('dev/img/sprite.png');
})

gulp.task('develop', ['browserSync'], function () {
  gulp.watch('src/**/*.pug', ['pug', reload]);
  gulp.watch('src/**/*.styl', ['stylus', reload]);
  gulp.watch('src/**/*.{png,jpg}', ['images', reload]);
});

// Build
// _____

gulp.task('clean:build', function() {
  return del.sync('build');
});

gulp.task('minify:css', function() {
  return gulp.src('dev/css/*.css')
  .pipe(cssnano())
  .pipe(gulp.dest('build/css'));
});

gulp.task('minify:html', function() {
  return gulp.src('dev/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
});

gulp.task('imagemin', function(){
  return gulp.src('dev/img/*.{png,jpg}')
  .pipe(imagemin())
  .pipe(gulp.dest('build/img'));
});

gulp.task('build', [
  'clean:build',
  'minify:css',
  'minify:html',
  'imagemin'
  ], function () {
  console.log('Done');
});
