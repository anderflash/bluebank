import path from 'path';
import gulp from 'gulp';
import paths from './paths';
export default function fontawesome(){
  return gulp.src('node_modules/font-awesome/fonts/*', {since: gulp.lastRun(fontawesome)})
    .pipe(gulp.dest(path.join(paths.assets.dest,'fonts')));
}