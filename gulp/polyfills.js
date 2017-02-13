import fs        from 'fs';
import path      from 'path';
import uglifyjs  from 'uglify-js';
import gulp      from 'gulp';
import gconcat   from 'gulp-concat';
import ghash     from 'gulp-hash';
import ggzip     from 'gulp-gzip';
import gminifier from 'gulp-uglify/minifier';
import grename   from 'gulp-rename';
import clear     from './clear';
import paths     from './paths';
import config    from './config';

const p    = gulp.parallel;
const s    = gulp.series;

export function polyfills() {
  var options = {
    mangle: true,
    compress: true
  };
  clear('dist',/polyfills(\.\w+)?(\.min)\.js(\.gz)?/);
  return gulp.src([
    'node_modules/@webcomponents/custom-elements/custom-elements.min.js',
    'node_modules/whatwg-fetch/fetch.js',
    'node_modules/idb/lib/idb.js'
  ])
    .pipe(gconcat('polyfills.js'))
    .pipe(gminifier(options, uglifyjs))
    .pipe(ghash({hashLength: 40, template:'<%= name %>.<%= hash %><%= ext %>'}))
    .pipe(grename(path => path.basename += '.min'))
    .pipe(gulp.dest('dist'))
    .pipe(ghash.manifest('polyfills.manifest.json'))
    .pipe(gulp.dest('dist'));
}

export function polyfills_leaflet(done){
  let pfManFilename = path.join(paths.pf.dest, config[global.env].pf.manifest);
  var pfManifest    = JSON.parse(fs.readFileSync(pfManFilename));
  let pfName        = pfManifest['polyfills.js'];
  return gulp.src([
    path.join(paths.pf.dest, pfName),
    'node_modules/leaflet/dist/leaflet.js'
  ]).pipe(gconcat(pfName))
    .pipe(gulp.dest('dist'));
}

export function polyfills_gzip(done){
  return gulp.src('dist/polyfills.*.min.js').pipe(ggzip()).pipe(gulp.dest('dist'));
}
