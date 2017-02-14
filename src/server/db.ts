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
      database         : process.env.OPENSHIFT_POSTGRESQL_DB_DATABASE || 'bluebank',  // env var: PGDATABASE
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

  async login(cpf:string, password:string): Promise<any>{
    let client:pg.Client;
    let result:pg.QueryResult;
    client = await this.pool.connect();
    console.log(cpf, password);
    result = await client.query('UPDATE public.client SET lastlogindate=now() WHERE cpf = $1 AND password = $2 RETURNING id, account, branch, name, registerdate', [cpf, password]);
    client.release();
    if(result.rows.length == 0)
      throw Error("Usuário e senha não existem");
    return result.rows[0];
  }

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
  async register(name: string, cpf: string, branch: number, amount: number, password: string): Promise<any>{
    let client:pg.Client = await this.pool.connect();
    let result:pg.QueryResult = await client.query('INSERT INTO client (name, cpf, branch, amount, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, account', [name, cpf, branch, amount, password]);
    client.release();
    console.log(result.rows[0]);
    return result.rows[0];
  }

  /**
   * @brief      Make a transfer between different accounts
   *
   * @param      origin   The origin
   * @param      destiny  The destiny
   * @param      amount   The amount
   *
   * @return     true if success and false if failure
   */
  async transfer(origin: number, destiny: number, amount: number): Promise<any>{
    // let client:pg.Client = await this.pool.connect();
    // let result:pg.QueryResult = await client.query(`BEGIN;UPDATE public.client SET amount = amount - $1 WHERE account= $2; publi COMMIT; INSERT INTO client (cpf, branch, amount, password) VALUES ($1, $2, $3, $4) RETURNING id, account
    //   `, [data.cpf, data.branch, data.amount, data.password]);
    // client.release();
    // return result.rows[0];
  }
}