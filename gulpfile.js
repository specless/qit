const gulp = require('gulp');
const replace = require('gulp-replace');
const qit = require('./qit.js');

gulp.task('pre', (done) => {
  qit(() => {done()}, true, true, false);
});
gulp.task('sass', () => {
  return gulp.src('./build/qit.css')
    .pipe(replace(/assets/gi, '..'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy', () => {
  return gulp.src('./build/assets/?(fonts|img|svg)/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', () => {
    return gulp.src('./dist/**/*')
        .pipe(gulp.dest('../styleguide/assets'));
});

gulp.task('build', gulp.series('pre','copy', 'sass', 'deploy'));
gulp.task('build:watch', () => {
  return gulp.watch('./src/**/*.scss', gulp.series('build'));
});

gulp.task('compile', gulp.series('build'));
gulp.task('compile:watch', () => {
    return gulp.watch('./src/**/*.scss', gulp.series('build'));
});

