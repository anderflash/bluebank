import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import { server_bundle, server_run } from './gulp/server';
// import { client_rollup, client_fix, client_gzip } from './gulp/client';
// import { sw_rollup, sw_fix, sw_gzip } from './gulp/service.worker';
// import { polyfills, polyfills_gzip, polyfills_leaflet } from './gulp/polyfills';
// import { styles_bundle, styles_gzip, styles_sourcemap_gzip } from './gulp/styles';
// import index from './gulp/index';
// import handler from './gulp/handler';
// import assets from './gulp/assets';
// import fontawesome from './gulp/fontawesome';
import paths from './gulp/paths';
import {browserSync, initSync} from './gulp/browsersync';

// Create dist && tmp folders
!fs.existsSync('./dist') && fs.mkdirSync('./dist');
!fs.existsSync('./tmp')  && fs.mkdirSync('./tmp');

global.env = gutil.env.env || 'dev';
const p    = gulp.parallel;
const s    = gulp.series;

function watch(){
  gulp.watch(paths.server.src).on('change', s(server_bundle, server_run, browserSync.reload));
  // gulp.watch(paths.client.src).on('change', s(client_rollup, gzip, browserSync.reload));
  // gulp.watch(paths.sw.src).on('change', s(sw_rollup    , gzip, browserSync.reload));
  // gulp.watch(paths.assets.src).on('change', s(assets, browserSync.reload));
  // gulp.watch(path.join(paths.html.src,'index.html')).on('change', s(index, browserSync.reload));
  // gulp.watch(path.join(paths.handler.src, 'handler.html')).on('change', s(handler, browserSync.reload));
  // gulp.watch(paths.css.src).on('change', s(styles_bundle, p(s(sw_fix, sw_gzip), index, styles)));
  gulp.watch(['dist/**/*.js','dist/**/*.html']).on('change', browserSync.reload);
}

// const sw       = s(sw_rollup);
const server   = s(server_bundle, server_run);
// const server_w = p(server, watch);
// const client   = s(client_rollup);
// const client_w = p(client, watch);
// const polyfills_post= s(polyfills_leaflet, polyfills_gzip);
// const rollup   = p(client_rollup, sw_rollup, polyfills, styles_bundle);
// const styles   = p(styles_gzip, styles_sourcemap_gzip);
// const gzip     = p(s(client_fix, client_gzip), s(sw_fix, sw_gzip), index, handler);
// const all      = p(server, s(p(s(rollup, p(gzip, polyfills_post, styles), initSync), assets, fontawesome)), watch);
const all = p(server, watch, initSync);
// export { client, client_w, server, server_w, polyfills, sw, rollup, gzip, all, styles_bundle, styles_gzip};
export default all;

