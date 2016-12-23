
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import {version} from './package.json';

const $ = gulpLoadPlugins();

gulp.task('manifest', () => {
  return gulp.src('src/manifest.json')
    .pipe($.jsonEditor({ version: version }))
    .pipe(gulp.dest('build/'));
});

gulp.task('clean', () => {
  return del(['build']);
});
