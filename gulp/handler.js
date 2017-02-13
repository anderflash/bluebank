import fs from 'fs';
import path from 'path';
import paths from './paths';
import config from './config';
import gzip from './gzip';
import htmlmin from 'htmlmin';


export default function handler(done){
  let content     = fs.readFileSync(path.join(paths.html.src,'handler.html'), "utf-8");
  if(global.env == 'prod'){
    content = htmlmin(content);
  }
  fs.writeFileSync(path.join(paths.html.dest,'handler.html'), content);
  if(global.env == 'prod')
    gzip(path.join(paths.html.dest,'handler.html'), path.join(paths.html.dest, 'handler.html.gz'));
  done();
}