"use strict";
var KoaRouter = require("koa-router");
var jwt = require("koa-jwt");
var jw = require("jsonwebtoken");
var BlueBankRouter = (function () {
    function BlueBankRouter(db, pubKey, privKey) {
        this.db = db;
        this.pubKey = pubKey;
        this.privKey = privKey;
        this.unprotected = new KoaRouter();
        this.protected = new KoaRouter();
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
    BlueBankRouter.prototype.sign = function (payload) {
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
