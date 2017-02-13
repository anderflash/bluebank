import {create} from 'browser-sync';

export var browserSync = create();

export function initSync(){
  return browserSync.init(null, {
    proxy: "http://localhost:3000",
    port: 7000,
    browser: 'chromium',
    reloadDelay: 1000
  });  
}