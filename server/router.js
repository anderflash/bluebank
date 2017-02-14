"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var KoaRouter = require("koa-router");
var jwt = require("koa-jwt");
var jw = require("jsonwebtoken");
var fs = require("fs");
function readFileThunk(src) {
    return new Promise(function (resolve, reject) {
        fs.readFile(src, { 'encoding': 'utf8' }, function (err, data) {
            if (err)
                return reject(err);
            resolve(data);
        });
    });
}
function validatePassword(ctx, next) {
    return __awaiter(this, void 0, void 0, function () {
        var password;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    password = ctx.query.password || ctx.request.body.password;
                    if (!password || password.length != 6)
                        return [2 /*return*/, ctx.throw("Password inválido", 400)];
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
;
var BlueBankRouter = (function () {
    function BlueBankRouter(db, pubKey, privKey) {
        var _this = this;
        this.db = db;
        this.pubKey = pubKey;
        this.privKey = privKey;
        this.unprotected = new KoaRouter();
        this.protected = new KoaRouter();
        var index = function (ctx) { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = ctx;
                    return [4 /*yield*/, readFileThunk(__dirname + '/../dist/index.html')];
                case 1: return [2 /*return*/, _a.body = _b.sent()];
            }
        }); }); };
        this.unprotected.get('/login', index)
            .get('/register', index)
            .get('/dashboard', index)
            .get('/transfer', index)
            .get('/transfer/new', index)
            .get("/health", function (ctx, next) { return ctx.status = 200; });
        this.unprotected
            .post('/api/client', function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var data, _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        data = ctx.request.body;
                        _a = ctx;
                        return [4 /*yield*/, this.db.register(data.name, data.cpf, data.branch, data.amount, data.password)];
                    case 1:
                        _a.body = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        ctx.throw("Registration error", 401);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); })
            .post("/api/login", validatePassword, function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var data, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = ctx.request.body;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.db.login(data.cpf, data.password)];
                    case 2:
                        result = _a.sent();
                        result.token = this.sign({ sub: result.id, cpf: data.cpf, account: data.account, branch: data.branch });
                        console.log(result);
                        ctx.body = result;
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        ctx.throw("login não realizado", 401);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); })
            .get("/api/amount", function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, e_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        _a = ctx;
                        return [4 /*yield*/, this.db.getAmount(this.getId(this.getPayload(ctx)))];
                    case 1:
                        _a.body = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        e_3 = _b.sent();
                        ctx.throw("Erro ao obter balanço", 401);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    }
    BlueBankRouter.prototype.getPayload = function (ctx) {
        var parts = ctx.header.authorization.split(' ');
        var token;
        if (parts.length == 2) {
            var scheme = parts[0];
            var credentials = parts[1];
            if (/^Bearer$/i.test(scheme))
                return jw.verify(credentials, this.pubKey);
            else
                throw "Credenciais mal-formados";
        }
        else {
            throw "Credenciais mal-formados";
        }
    };
    BlueBankRouter.prototype.getId = function (payload) {
        return payload.sub;
    };
    BlueBankRouter.prototype.sign = function (payload) {
        return jw.sign(payload, this.privKey, {
            algorithm: 'RS256',
            expiresIn: '7d'
        });
    };
    BlueBankRouter.prototype.use = function (app) {
        app.use(this.unprotected.routes());
        app.use(this.unprotected.allowedMethods());
        app.use(jwt({ secret: this.pubKey }));
        app.use(this.protected.routes());
        app.use(this.protected.allowedMethods());
    };
    return BlueBankRouter;
}());
exports.BlueBankRouter = BlueBankRouter;
