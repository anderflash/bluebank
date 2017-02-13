import fs from 'fs';
import path from 'path';
import Q from 'q';
import gulp from 'gulp';
import gcompass from 'gulp-compass';
import ghash from 'gulp-hash';
import {default as gulpFunction} from 'gulp-function';
import grename   from 'gulp-rename';
import ggzip from 'gulp-gzip';
import clear from './clear';
import gzip from './gzip';
import { browserSync } from './browsersync';

function removeCSS(file, enc){
  let done = Q.defer();
  fs.unlinkSync('dist/ciclo.css');
  done.resolve();
  return done.promise;
}

export function styles_bundle () {
  clear('dist',/ciclo(\.\w+)?(\.min)?\.css/);
  return gulp.src(['client/scss/ciclo.scss'])
    .pipe(gcompass({
      sourcemap: global.env == 'prod'?false:true,
      style: global.env == 'prod'?'compressed':'nested',
      sass: 'client/scss',
      css: 'dist',
      image: 'client/assets',
      import_path: [
        "node_modules"
      ]
    }))
    .pipe(ghash({hashLength: 40, template:'<%= name %>.<%= hash %><%= ext %>'}))
    .pipe(grename(path => {
      if(global.env == 'prod')
        path.basename += '.min'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(ghash.manifest('css.manifest.json'))
    .pipe(gulp.dest('dist'))
    .pipe(gulpFunction(removeCSS))
    .pipe(browserSync.stream({match: 'dist/*.css'}));
}

export function styles_gzip(done) {
  if(global.env == 'prod'){
    return gulp.src('dist/ciclo.*.css')
      .pipe(ggzip())
      .pipe(gulp.dest('dist'));
  } else {
    done();
  }
}

export function styles_sourcemap_gzip(done){
  if(global.env == 'dev'){
    // gzip('dist/ciclo.css.map', 'dist/ciclo.css.map.gz');
  }
  return done();
}