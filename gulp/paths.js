export default {
  server: {
    src: './src/server/**/*.ts',
    entry: './src/server/start.ts',
    app: './src/server/app.ts',
    dest: './server',
  },
  client: {
    src: './client/app/**/*.ts',
    dest: './dist'
  },
  // client_ts: {
  //   src: './client/app/**/*.ts',
  //   dest: './tmp/client/app',
  // },
  sw: {
    src: './client/sw/**/*.ts',
    dest: './dist'
  },
  css:{
    src: './client/scss/**/*.scss',
    dest: './dist'
  },
  html:{
    src: './client',
    dest: './dist'
  },
  handler:{
    src: './client',
    dest: './dist'
  },
  pf: {
    dest: './dist'
  },
  assets: {
    src: './client/assets/**/*',
    dest: './dist/assets'
  }

}