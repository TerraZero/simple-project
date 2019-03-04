const config = require('./gulpfile.config.json');
const libs = require('./libs/register.json');

const gulp = require('gulp');

const sass = require('gulp-sass');
const pug = require('gulp-pug');

const glob = require('glob');
const browserSync = require('browser-sync').create();

const errorHandler = function (name) {
  return function (err) {
    console.error('########### ERROR ' + name.toUpperCase() + ' ############');
    // err.showStack = true;
    err.showProperties = true;
    console.error(err.toString());
    console.error('########### ERROR ' + name.toUpperCase() + ' ############');
    this.emit('end')
  };
};

gulp.task('css', function () {
  return gulp.src(config.paths.css.files)
    .pipe(sass())
    .on('error', errorHandler('sass'))
    .pipe(gulp.dest(config.paths.css.dest))
    .pipe(browserSync.stream());
});

gulp.task('html', function () {
  return gulp.src(config.paths.html.files)
    .pipe(pug({
      basedir: __dirname + '/html',
      locals: {
        lib: {
          css: glob.sync('lib/**/*.css', {
            cwd: 'web',
          }),
          js: glob.sync('lib/**/*.js', {
            cwd: 'web',
          }),
        },
        src: {
          css: glob.sync('src/**/*.css', {
            cwd: 'web',
          }),
          js: glob.sync('src/**/*.js', {
            cwd: 'web',
          }),
        },
      },
    }))
    .on('error', errorHandler('pug'))
    .pipe(gulp.dest(config.paths.html.dest));
});

gulp.task('js', function () {
  return gulp.src(config.paths.js.files)
    .on('error', errorHandler('js'))
    .pipe(gulp.dest(config.paths.js.dest));
});

gulp.task('lib', function () {
  return gulp.src(libs)
    .pipe(gulp.dest('web/lib'));
});

gulp.task('watch', gulp.parallel(['css', 'html', 'js', 'lib'], function () {
  browserSync.init({
    server: {
      baseDir: "./web",
    },
  });

  gulp.watch(config.paths.css.watch, gulp.series('css'));
  gulp.watch(config.paths.html.watch, gulp.series('html'));
  gulp.watch(config.paths.js.watch, gulp.series('js'));
  gulp.watch(['libs/register.json'], gulp.series('lib'));

  gulp.watch(['web/**/*.html', 'web/**/*.js']).on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('watch', function (done) {
  done();
}));
