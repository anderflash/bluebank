import * as Koa       from 'koa';
import * as bodyparser from 'koa-bodyparser';
import * as KoaRouter from 'koa-router';
import * as jwt       from 'koa-jwt';
import * as jw        from 'jsonwebtoken';
import * as fs        from 'fs';
import { BlueBankDB } from './db';

function readFileThunk(src:string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(src, {'encoding': 'utf8'}, (err, data) => {
      if(err) return reject(err);
      resolve(data);
    });
  });
}
async function validatePassword (ctx, next): Promise<any>{
  let password:string = ctx.query.password || ctx.request.body.password;
  if(!password || password.length != 6) return ctx.throw("Password inválido", 400);
  await next();
};

export class BlueBankRouter {
  unprotected:KoaRouter;
  protected:KoaRouter;
  constructor(private db: BlueBankDB, private pubKey: string, private privKey: string) {
    this.unprotected = new KoaRouter();
    this.protected = new KoaRouter();

    var index = async (ctx:Koa.Context): Promise<any> => ctx.body = await readFileThunk(__dirname + '/../dist/index.html');
    this.unprotected.get('/login'        , index)
                    .get('/register'     , index)
                    .get('/dashboard'    , index)
                    .get('/transfer'     , index)
                    .get('/transfer/new' , index)
                    .get("/health", (ctx, next) => ctx.status = 200);


    this.unprotected
      .post('/api/client', async (ctx, next) => {
        try{
          let data = ctx.request.body;
          ctx.body = await this.db.register(data.name, data.cpf, data.branch, data.amount,  data.password); 
        }catch(e){
          ctx.throw("Registration error", 401);
        }
      })
      .post("/api/login", validatePassword, async (ctx, next) => {
        let data  = ctx.request.body;
        let result;
        try{
          result  = await this.db.login(data.cpf, data.password);
          result.token = this.sign({sub:result.id, cpf: data.cpf, account: data.account, branch: data.branch});
          console.log(result);
          ctx.body = result;
        }catch(e){
          ctx.throw("login não realizado", 401);
        }
      })
      .get("/api/amount", async (ctx, next) => {
        try{
          ctx.body = await this.db.getAmount(this.getId(this.getPayload(ctx)));
        }catch(e){
          ctx.throw("Erro ao obter balanço",401);
        }
      })
      .get("/api/transfer", async (ctx, next) => {
        try{
          ctx.body = await this.db.getTransferList(this.getId(this.getPayload(ctx)));
        }catch(e){
          ctx.throw("Erro ao obter balanço",401);
        }
      })
      .post("/api/transfer", async (ctx, next) => {
        try{
          let data = ctx.request.body;
          ctx.body = await this.db.transfer(this.getId(this.getPayload(ctx)), data.branch, data.account, data.amount);
        }catch(e){

        }
      });
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

  private getId(payload: any){
    return payload.sub;
  }

  private sign(payload: Object){
    return jw.sign(payload, this.privKey, {
      algorithm: 'RS256', 
      expiresIn:'7d'
    });
  }

  use(app:Koa){
    app.use(this.unprotected.routes());
    app.use(this.unprotected.allowedMethods());
    app.use(jwt({secret: this.pubKey}));
    app.use(this.protected.routes());
    app.use(this.protected.allowedMethods());
  }
}