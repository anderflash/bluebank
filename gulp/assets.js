import gulp from 'gulp';
import paths from './paths';
export default function assets(){
  return gulp.src(paths.assets.src, {since: gulp.lastRun(assets)})
    .pipe(gulp.dest(paths.assets.dest));
}