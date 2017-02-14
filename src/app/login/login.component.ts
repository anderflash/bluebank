import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';

import { LoginModel } from '../login.model';
import { BluebankService } from '../bluebank.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model: LoginModel
  constructor(private bb:BluebankService, private router: Router, public snackBar: MdSnackBar) { 
    this.model = { cpf: null, password: null};
  }

  ngOnInit() {
    console.log(this.bb.authenticated);
  }
  onSubmit() {
    this.bb.login(this.model.cpf.slice(0, 9), this.model.password).then(data => {
      if(this.bb.authenticated){
        this.router.navigate(['dashboard']);
      }
    }).catch(e=>{
      this.snackBar.open("Autenticação falhou.", "OK");
    });
  }
}
