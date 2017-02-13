import * as pg from 'pg';

import {Client} from './client';
import {Branch} from './branch';
import {Transaction} from './transaction';

export class BlueBankDB{
  private config: pg.PoolConfig;
  private pool: pg.Pool;
  constructor(){
    this.config = {
      user             : process.env.OPENSHIFT_POSTGRESQL_DB_USERNAME || 'acmt',   // env var: PGUSER
      database         : process.env.OPENSHIFT_POSTGRESQL_DB_DATABASE || 'ciclo',  // env var: PGDATABASE
      password         : process.env.OPENSHIFT_POSTGRESQL_DB_PASSWORD || 'secret', // env var: PGPASSWORD
      host             : process.env.OPENSHIFT_POSTGRESQL_DB_HOST     || 'localhost',                        // Server hosting the postgres database
      port             : process.env.OPENSHIFT_POSTGRESQL_DB_PORT     || 5432,     // env var: PGPORT
      max              : 10,                                 // max number of clients in the pool
      idleTimeoutMillis: 30000,                              // how long a client is allowed to remain idle before being closed
    };
    this.pool = new pg.Pool(this.config);
    this.pool.on('error', function (err, client) {
      // if an error is encountered by a client while it sits idle in the pool
      // the pool itself will emit an error event with both the error and
      // the client which emitted the original error
      // this is a rare occurrence but can happen if there is a network partition
      // between your application and the database, the database restarts, etc.
      // and so you might want to handle it and at least log it out
      console.error('idle client error', err.message, err.stack)
    });
  }

  async validateLogin(branch: number, account:number, password:string): Promise<any>{
    let client:pg.Client;
    let result:pg.QueryResult;
    client = await this.pool.connect();
    result = await client.query('UPDATE public.client SET lastlogindate=now() WHERE branch = $1 AND account = $2 AND password = $3 RETURNING id', [branch, account, password]);
    if(result.rows.length == 0){
      client.release();
      throw Error("Usuário e senha não existem");
    } 
    client.release();
    let returndata = {id:result.rows[0].id};
    return returndata;
  }
}