import path       from 'path';
import ts         from 'typescript';
// import rts        from 'rollup-plugin-typescript';
// import ruglify    from 'rollup-plugin-uglify';
// import rhash      from 'rollup-plugin-hash';
import paths      from './paths.js';
import keywords   from './keywords.js';

// function plugins(env, dest, hash, manifest){
//   var list = [
//     rts({typescript: ts}),
//   ];
//   if(env == 'prod'){
//     list.push(ruglify({mangle:{except:keywords}, mangleProperties:{reserved:keywords}}));
//   }
//   if(hash){
//     list.push(rhash({ 
//       dest: path.join(dest, hash),
//       manifest: path.join(dest, manifest),
//       replace: true
//     }))
//   }
//   return list;
// }

export default {
  'dev':{
    'client':{
      // 'rollup_plugins': plugins('dev',paths.client.dest, 'ciclo.[hash].js', 'js.manifest.json'),
      'dest': 'ciclo.js',
      'manifest': 'js.manifest.json',
      'entry': './client/app/ciclo.ts'
    },
    'sw':{
      // 'rollup_plugins': plugins('dev',paths.client.dest),
      'dest': 'sw.js',
      'manifest': 'sw.manifest.json',
      'entry': './client/sw/service.worker.ts'
    },
    'css':{
      'dest':'ciclo.css',
      'manifest': 'css.manifest.json',
    },
    'pf':{
      'dest': 'polyfills.min.js',
      'manifest': 'polyfills.manifest.json'
    },
    'server':{
    }
  },
  'prod':{
    'client':{
      // 'rollup_plugins': plugins('prod',paths.client.dest, 'ciclo.[hash].min.js', 'js.manifest.json'),
      'dest': 'ciclo.min.js',
      'manifest': 'js.manifest.json',
      'entry': './client/app/ciclo.ts'
    },
    'sw':{
      // 'rollup_plugins': plugins('prod',paths.sw.dest), 
      'dest':'sw.min.js',
      'manifest': 'sw.manifest.json',
      'entry': './client/sw/service.worker.ts'
    },
    'css':{
      'dest':'ciclo.min.css',
      'manifest': 'css.manifest.json',
    },
    'pf':{
      'dest': 'polyfills.min.js',
      'manifest': 'polyfills.manifest.json'
    },
    'server':{
      
    }
  }
}