import * as Koa       from 'koa';
import * as KoaRouter from 'koa-router';
import * as jwt       from 'koa-jwt';
import * as jw        from 'jsonwebtoken';
import { BlueBankDB } from './db';


export class BlueBankRouter {
  unprotected:KoaRouter;
  protected:KoaRouter;
  constructor(private db: BlueBankDB, private pubKey: string, private privKey: string) {
    this.unprotected = new KoaRouter();
    this.protected = new KoaRouter();
  }

  private getPayload(ctx:KoaRouter.IRouterContext){
    let parts: string[] = ctx.header.authorization.split(' ');
    let token: string;
    if (parts.length == 2) {
      let scheme = parts[0];
      let credentials = parts[1];

      if (/^Bearer$/i.test(scheme))
        return jw.verify(credentials, this.pubKey);
      else                          
        throw "Credenciais mal-formados";
    } else {
      throw "Credenciais mal-formados";
    }
  }

  private sign(payload: Object){

  }

  use(app:Koa){
    app.use(this.unprotected.routes());
    app.use(this.unprotected.allowedMethods());
    app.use(jwt({secret: this.pubKey}));
    app.use(this.protected.routes());
    app.use(this.protected.allowedMethods());
  }
}