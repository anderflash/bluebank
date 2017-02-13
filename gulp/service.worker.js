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


/**
 * Transpile clients (no polyfills and service worker)
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
// export function sw_bundle() {
//   return gulp.src(paths.sw.src, {since: gulp.lastRun(sw_bundle)})
//            .pipe(tsProject())
//            .pipe(gulp.dest(paths.sw.dest));
// }

/**
 * Bundle all client js files to just one file.
 *
 * @return     {<type>}  { description_of_the_return_value }
 */
export function sw_rollup() {
  clear(paths.sw.dest, /sw(\.\w+)?(\.min)?.js(\.gz)?$/);
  return rollup({
    entry: config[global.env].sw.entry,
    sourceMap: global.env =='dev'?true:false,
    plugins: config[global.env].sw.rollup_plugins
  }).then(bundle => bundle.write({
      sourceMap: global.env == 'dev'?true:false,
      format: 'es',
      dest: path.join(paths.sw.dest, config[global.env].sw.dest)
    })
  );
}

export function sw_fix(done) {
  let jsKey       = path.join(paths.client.dest, config[global.env].client.dest);
  let swKey       = path.join(paths.sw.dest, config[global.env].sw.dest);
  var jsManifest  = JSON.parse(fs.readFileSync(path.join(paths.client.dest, config[global.env].client.manifest)));
  //var swManifest  = JSON.parse(fs.readFileSync(path.join(paths.sw.dest, config[global.env].sw.manifest)));
  var cssManifest = JSON.parse(fs.readFileSync(path.join(paths.css.dest, config[global.env].css.manifest)));
  var pfManifest  = JSON.parse(fs.readFileSync(path.join(paths.pf.dest, config[global.env].pf.manifest)));
  let jsName      = jsManifest[jsKey];
  //let swName      = swManifest[swKey];
  let swName      = path.join(paths.sw.dest, config[global.env].sw.dest);
  let cssName     = cssManifest['ciclo.css'];
  let pfName      = pfManifest['polyfills.js'];
  let swContent   = fs.readFileSync(swName, "utf-8");
  swContent       = swContent.replace(/ciclo(\.[\w\d]+)*.min\.js/,jsName.replace(/^dist\//,''));
  swContent       = swContent.replace(/polyfills(\.[\w\d]+)?(.min)?\.js/,pfName.replace(/^dist\//,''));
  swContent       = swContent.replace(/ciclo(\.[\w\d]+)?(.min)?\.css/,cssName.replace(/^dist\//,''));
  fs.writeFileSync(swName, swContent);
  done();
}

export function sw_gzip(done){
  //var swManifest   = JSON.parse(fs.readFileSync(path.join(paths.sw.dest, config[global.env].sw.manifest)));
  //let swName       = swManifest[swKey];
  if(global.env == 'prod'){
    let swKey        = path.join(paths.sw.dest, config[global.env].sw.dest);
    let swName       = swKey;
    gzip(swName, swName+'.gz');
  }else{
    // let swMapName    = 'dist/sw.js.map';
    // gzip(swMapName, swMapName+'.gz');
  }
  done();
}