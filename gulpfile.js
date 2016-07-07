'use strict';

var plugins = require('gulp-load-plugins')();

var browserSync = require('browser-sync').create();
var del = require('del');
var gulp = require('gulp');
var reload = browserSync.reload;
var spritesmith = require('gulp.spritesmith');
var dirSep = require('path').sep;

// Develop
// _______

gulp.task('browserSync', function() {
  browserSync.init({
    server: 'dev' 
  });
});

gulp.task('pug', function() {
  return gulp.src('src/index.pug')
    .pipe(plugins.plumber())
    .pipe(plugins.pug({
      pretty: true
    }))
    .pipe(gulp.dest('dev'));
});

gulp.task('stylus', function () {
  return gulp.src('src/main.styl')
    .pipe(plugins.plumber())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus())
    .pipe(plugins.autoprefixer())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest('dev/css'));
});

gulp.task('images', function () {
  return gulp.src(['src/**/*.{png,jpg}', '!src/**/sprite*.{png,jpg}'])
    .pipe(plugins.rename(function(path) {
      var dirs = path.dirname.split(dirSep);
      dirs.splice(0, 2);
      path.dirname = dirs.join(dirSep)
    }))
    .pipe(gulp.dest('dev/img'));
});

gulp.task('sprite', ['clean:sprite'], function () {
  var spriteData = gulp.src('src/**/sprite-*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.styl'
  }));
  spriteData.img.pipe(gulp.dest('dev/img'));
  spriteData.css.pipe(gulp.dest('src/blocks/common'));
});

gulp.task('clean:sprite', function() {
  return del.sync('dev/img/sprite.png');
})

gulp.task('develop', ['browserSync'], function () {
  gulp.watch('src/**/*.{png,jpg}', ['images', reload]);
  gulp.watch('src/**/*.pug', ['pug', reload]);
  gulp.watch('src/**/sprite-*.png', ['sprite', reload]);
  gulp.watch('src/**/*.styl', ['stylus', reload]);
});

// Build
// _____

gulp.task('clean:build', function() {
  return del.sync('build');
});

gulp.task('css', function() {
  return gulp.src('src/main.styl')
  .pipe(plugins.stylus())
  .pipe(plugins.autoprefixer())
  .pipe(plugins.cssnano())
  .pipe(gulp.dest('build/css'));
});

gulp.task('html', function() {
  return gulp.src('src/index.pug')
  .pipe(plugins.pug())
  .pipe(plugins.htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'));
});

gulp.task('imagemin', function(){
  return gulp.src('dev/img/*.{png,jpg}')
  .pipe(plugins.imagemin())
  .pipe(gulp.dest('build/img'));
});

gulp.task('build', [
  'clean:build',
  'css',
  'html',
  'imagemin'
  ], function () {
});

gulp.task('default', function () {
  console.log('Default task is null \n' +
    'gulp develop - develop project \n' +
    'gulp build - build project'
  );
})