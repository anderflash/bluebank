import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';
import { RegisterModel } from './register.model';

@Injectable()
export class BluebankService {
  
  currentUser: any;

  constructor(private http:Http) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  private status(response: Response): Response | Promise<never> {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  private json(response): any {  
    return response.json()  
  }

  private storage(data:any):any {
    console.log(data);
    localStorage.setItem('currentUser', JSON.stringify({id: data.id, branch: data.branch, cpf: data.cpf, account: data.account, token:data.token}));
    this.currentUser = data;
    console.log(localStorage.getItem('currentUser'));
    return data;
  }

  get authenticated() {
    return this.currentUser != null;
  }

  /**
   * @brief      Just a wrapper for Fetch API post request
   *
   * @param      url      The url
   * @param      body     The body
   * @param      headers  The headers
   *
   * @return     { description_of_the_return_value }
   */
  private post(url:string, body: any, headers?: any): Promise<any>{
    return fetch(url, {method:'POST', headers: headers, body: JSON.stringify(body)});
  }
  /**
   * @brief      Just a wrapper for Fetch API get request
   *
   * @param      url      The url
   * @param      headers  The headers
   *
   * @return     { description_of_the_return_value }
   */
  private get(url:string, headers?:any): Promise<any>{
    return fetch(url, {method: 'GET', headers: headers})
  }

  /**
   * @brief      Registering the user
   *
   * @param      user  The user
   *
   * @return     { description_of_the_return_value }
   */
  register(user:RegisterModel): Promise <any>{
    console.log(user);
    return this.post('/api/client', user, this.addJson({}))
      .then(data => this.status(data))
      .then(data => this.json(data));
  }

  /**
   * @brief      Authentication by JWT
   *
   * @param      branch    The branch
   * @param      account   The account
   * @param      password  The password
   *
   * @return     { description_of_the_return_value }
   */
  login(cpf: string, password: string): Promise<any> {
    let obj = this.addJson({});
    return fetch('/api/login', { method: 'POST', headers: obj, body: JSON.stringify({ cpf: cpf, password: password }) })
      .then(data => this.status(data))
      .then(data => this.json(data))
      .then(data => this.storage(data));
  }

  /**
   * @brief      Logout
   *
   * @return     { description_of_the_return_value }
   */
  logout(){
    localStorage.removeItem('currentUser');
    this.currentUser = null;
  }

  private addJWT(object: any): any{
    if(this.currentUser){
      Object.assign(object,{'Authorization':'Bearer ' + this.currentUser.token});
    }
    return object;
  }
  private jsonJWT(){
    return this.addJWT(this.addJson({}));
  }
  private addJson(object: any): any{
    return Object.assign(object,{'Content-Type':'application/json', 'Accept': 'application/json'});
  }

  
}
