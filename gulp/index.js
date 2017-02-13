import fs from 'fs';
import path from 'path';
import paths from './paths';
import config from './config';
import gzip from './gzip';
import htmlmin from 'htmlmin';


export default function index(done){
  let jsKey       = path.join(paths.client.dest, config[global.env].client.dest);
  var jsManifest  = JSON.parse(fs.readFileSync(path.join(paths.client.dest, config[global.env].client.manifest)));
  var cssManifest = JSON.parse(fs.readFileSync(path.join(paths.css.dest, config[global.env].css.manifest)));
  var pfManifest  = JSON.parse(fs.readFileSync(path.join(paths.pf.dest, config[global.env].pf.manifest)));
  let jsName      = jsManifest[jsKey];
  let cssName     = cssManifest['ciclo.css'];
  let pfName      = pfManifest['polyfills.js'];
  let content     = fs.readFileSync(path.join(paths.html.src,'index.html'), "utf-8");
  content         = content.replace(/ciclo(\.[\w\d]+)*.min\.js/,jsName.replace(/^dist\//,''));
  content         = content.replace(/polyfills(\.[\w\d]+)?(.min)?\.js/,pfName.replace(/^dist\//,''));
  content         = content.replace(/ciclo(\.[\w\d]+)?(.min)?\.css/,cssName.replace(/^dist\//,''));
  if(global.env == 'prod') 
    content = htmlmin(content);
  fs.writeFileSync(path.join(paths.html.dest,'index.html'), content);
  if(global.end == 'prod')
    gzip(path.join(paths.html.dest,'index.html'), path.join(paths.html.dest, 'index.html.gz'));
  fs.createReadStream(path.join(paths.html.src,'favicon.ico')).pipe(fs.createWriteStream(path.join(paths.html.dest,'favicon.ico')));
  done();
}