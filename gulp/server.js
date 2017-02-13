import path       from 'path';
import ts         from 'typescript';
import { minify } from 'uglify-js';
import gulp       from 'gulp';
import gts        from 'gulp-typescript';
// import grollup    from 'gulp-rollup';
// import { rollup } from 'rollup';
// import rts        from 'rollup-plugin-typescript';
// import ruglify    from 'rollup-plugin-uglify';
import paths      from './paths.js';
import config     from './config.js';
import {spawn}    from 'child_process';


const  tsProjectS   = gts.createProject('src/server/tsconfig.json');

/**
 * Transpile server typescript files to javascript
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
export function server_bundle() {
  return gulp.src(paths.server.src, {since: gulp.lastRun(server_bundle)})
             .pipe(tsProjectS())
             .pipe(gulp.dest(paths.server.dest));
}

var node = null;
export function server_run() {
  var empty = node == null;
  if (node) node.kill();
  node = spawn('node', ['--use_strict','server/start.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
  //if(!empty) browserSync.reload;
}

// export function server_rollup() {
//   rollup({
//     entry: paths.server.entry,
//     sourceMap: global.env =='dev'?true:false,
//     plugins: [rts({typescript: ts, tsconfig:'server/tsconfig.json'})]
//   }).then(bundle => bundle.write({
//     sourceMap: global.env == 'dev'?true:false,
//     format: 'cjs',
//     dest: path.join(paths.server.dest, config[global.env].server_js)
//   }));

//   return rollup({
//     entry: paths.server.app,
//     sourceMap: global.env =='dev'?true:false,
//     plugins: [rts({typescript: ts, tsconfig:'server/tsconfig.json'})]
//   }).then(bundle => bundle.write({
//     sourceMap: global.env == 'dev'?true:false,
//     format: 'cjs',
//     dest: path.join(paths.server.dest, config[global.env].server_app_js)
//   }));
  
// }