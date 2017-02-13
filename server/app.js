"use strict";
var Koa = require("koa");
var serve = require("koa-static");
var bodyParser = require("koa-bodyparser");
var mount = require("koa-mount");
var enforceHttps = require("koa-sslify");
var dotenv = require("dotenv");
var fs = require("fs");
var http = require("http");
var db_1 = require("./db");
var router_1 = require("./router");
var cors = require("koa-cors");
dotenv.config();
// Get keys
var publicKey = process.env.PUBLICKEY || fs.readFileSync('public.pem');
var privateKey = process.env.PRIVATEKEY || fs.readFileSync('private.pem');
// Init main components
var db = new db_1.BlueBankDB();
var router = new router_1.BlueBankRouter(db, publicKey, privateKey);
var app = new Koa();
// function redirectSec(ctx: Koa.Context, next) {
//   if (ctx.request.headers['x-forwarded-proto'] == 'http') {
//       ctx.redirect('https://' + ctx.request.headers.host + ctx.request.path);
//   } else {
//       return next();
//   }
// }
if (process.env.ENFORCE_HTTPS)
    app.use(enforceHttps({ trustProtoHeader: true }));
app.use(cors({ origin: '*' }));
app.use(require('koa-conditional-get')());
app.use(require('koa-etag')());
app.use(bodyParser());
app.use(mount('/storage', serve(process.env.STORAGE_PATH || 'storage')));
app.use(serve('dist'));
router.use(app);
//var server_ssl = https.createServer(app.callback());
var server = http.createServer(app.callback());
// Create a Web Service
// const wss  = new Server({server});
// wss.on('connection', ws => {
//   ws.on('message', (message)=>JSON.parse(message))
// });
// Get Key and Certificate
// var options = {
//   key: fs.readFileSync('./new.cert.key'),
//   cert: fs.readFileSync('./new.cert.cert')
// };
// https.createServer(options, app.callback()).listen(3002).on("listening", () => {
//   console.log(`Application worker ${process.pid} started...`);
// });
server.listen(process.env.NODE_PORT || 3000, process.env.NODE_IP || 'localhost', function () {
    console.log("Application worker " + process.pid + " started...");
});
// import * as http      from 'http';
// import * as path      from 'path';
// import contentTypes = require('./utils/content-types');
// import * as sysInfo   from './utils/sys-info';
// let env = process.env;
// let server = http.createServer((req:http.IncomingMessage, res:http.ServerResponse) => {
//   let url = req.url;
//   if (url == '/') {
//     url += 'index.html';
//   }
//   // IMPORTANT: Your application HAS to respond to GET /health with status 200
//   //            for OpenShift health monitoring
//   if (url == '/health') {
//     res.writeHead(200);
//     res.end();
//   } else if (url == '/info/gen' || url == '/info/poll') {
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Cache-Control', 'no-cache, no-store');
//     res.end(JSON.stringify(sysInfo[url.slice(6)]()));
//   } else {
//     fs.readFile('./static' + url, function (err, data) {
//       if (err) {
//         res.writeHead(404);
//         res.end('Not found');
//       } else {
//         let ext:string = path.extname(url).slice(1);
//         res.setHeader('Content-Type', contentTypes[ext]);
//         if (ext === 'html') {
//           res.setHeader('Cache-Control', 'no-cache, no-store');
//         }
//         res.end(data);
//       }
//     });
//   }
// });
// server.listen(env.NODE_PORT || 3000, env.NODE_IP || 'localhost', function () {
//   console.log(`Application worker ${process.pid} started...`);
// });
