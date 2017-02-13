import fs         from 'fs';
import path       from 'path';
import ts         from 'typescript';
import uglify     from 'uglify-js';
import gulp       from 'gulp';
import gts        from 'gulp-typescript';
import { rollup } from 'rollup';
import rts        from 'rollup-plugin-typescript';
import ruglify    from 'rollup-plugin-uglify';
import rhash      from 'rollup-plugin-hash';
import paths      from './paths';
import config     from './config';
import keywords   from './keywords';
import clear      from './clear';
import gzip       from './gzip';

const  tsProject = gts.createProject('tsconfig.json');

// /**
//  * Transpile clients (no polyfills and service worker)
//  *
//  * @return     {<type>}  { description_of_the_return_value }
//  */
// export function client_bundle() {
//   return gulp.src(paths.client_ts.src, {since: gulp.lastRun(client_bundle)})
//            .pipe(tsProject())
//            .pipe(gulp.dest(paths.client_ts.dest));
// }

/**
 * Bundle all client js files to just one file.
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
export function client_rollup() {
  clear(paths.client.dest, /ciclo(\.\w+)?(\.min)?\.js(\.gz)?$/);
  return rollup({
    entry: config[global.env].client.entry,
    sourceMap: global.env =='dev'?true:false,
    plugins: config[global.env].client.rollup_plugins
  }).then(bundle => bundle.write({
    sourceMap: global.env == 'dev'?true:false,
    format: 'es',
    dest: path.join(paths.client.dest, config[global.env].client.dest)
  }));
}

export function client_fix(done) {
  let jsKey = path.join(paths.client.dest, config[global.env].client.dest);
  let swKey = path.join(paths.sw.dest, config[global.env].sw.dest);
  var jsManifest  = JSON.parse(fs.readFileSync(path.join(paths.client.dest, config[global.env].client.manifest)));
  //var swManifest  = JSON.parse(fs.readFileSync(path.join(paths.sw.dest, config[global.env].sw.manifest)));
  let jsName      = jsManifest[jsKey];
  //let swName      = swManifest[swKey];
  let jsContent   = fs.readFileSync(jsName, "utf-8");
  jsContent       = jsContent.replace(/sw(\.[\w\d]+)*.min\.js/,config[global.env].sw.dest.replace(/^dist\//,''));
  if(global.env == 'dev'){
    jsContent      += "//# sourceMappingURL=ciclo.js.map";
  }
  fs.writeFileSync(jsName, jsContent);
  done();
}

export function client_gzip(done){
  if(global.env == 'prod'){
    var jsManifest   = JSON.parse(fs.readFileSync(path.join(paths.client.dest, config[global.env].client.manifest)));
    let jsKey        = path.join(paths.client.dest, config[global.env].client.dest);
    let jsName       = jsManifest[jsKey];
    gzip(jsName, jsName+'.gz');
  }else{
    // let jsMapName    = 'dist/ciclo.js.map';
    // gzip(jsMapName, jsMapName+'.gz');
  }
  done();
}