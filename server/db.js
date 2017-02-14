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
var pg = require("pg");
var BlueBankDB = (function () {
    function BlueBankDB() {
        this.config = {
            user: process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME || 'acmt',
            database: process.env.OPENSHIFT_POSTGRESQL_DB_DATABASE || 'bluebank',
            password: process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD || 'secret',
            host: process.env.OPENSHIFT_POSTGRESQL_DB_HOST || 'localhost',
            port: process.env.OPENSHIFT_POSTGRESQL_DB_PORT || 5432,
            max: 10,
            idleTimeoutMillis: 30000,
        };
        this.pool = new pg.Pool(this.config);
        this.pool.on('error', function (err, client) {
            // if an error is encountered by a client while it sits idle in the pool
            // the pool itself will emit an error event with both the error and
            // the client which emitted the original error
            // this is a rare occurrence but can happen if there is a network partition
            // between your application and the database, the database restarts, etc.
            // and so you might want to handle it and at least log it out
            console.error('idle client error', err.message, err.stack);
        });
    }
    BlueBankDB.prototype.login = function (cpf, password) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        console.log(cpf, password);
                        return [4 /*yield*/, client.query('UPDATE public.client SET lastlogindate=now() WHERE cpf = $1 AND password = $2 RETURNING id, account, branch, name, registerdate', [cpf, password])];
                    case 2:
                        result = _a.sent();
                        client.release();
                        if (result.rows.length == 0)
                            throw Error("Usuário e senha não existem");
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    /**
     * @brief      Register a new bank account
     *
     * @param      cpf       The cpf
     * @param      branch    The branch
     * @param      amount    The amount
     * @param      password  The password
     *
     * @return     { description_of_the_return_value }
     */
    BlueBankDB.prototype.register = function (name, cpf, branch, amount, password) {
        return __awaiter(this, void 0, void 0, function () {
            var client, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pool.connect()];
                    case 1:
                        client = _a.sent();
                        return [4 /*yield*/, client.query('INSERT INTO client (name, cpf, branch, amount, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, account', [name, cpf, branch, amount, password])];
                    case 2:
                        result = _a.sent();
                        client.release();
                        console.log(result.rows[0]);
                        return [2 /*return*/, result.rows[0]];
                }
            });
        });
    };
    /**
     * @brief      Make a transfer between different accounts
     *
     * @param      origin   The origin
     * @param      destiny  The destiny
     * @param      amount   The amount
     *
     * @return     true if success and false if failure
     */
    BlueBankDB.prototype.transfer = function (origin, destiny, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return BlueBankDB;
}());
exports.BlueBankDB = BlueBankDB;
