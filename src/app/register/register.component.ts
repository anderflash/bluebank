import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BluebankService } from '../bluebank.service';
import { RegisterModel } from '../register.model';
import { MdSnackBar } from '@angular/material';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  model: RegisterModel;
  constructor(private bb:BluebankService, private router:Router, public snackBar: MdSnackBar) { 
    this.model = {name:null, cpf:null, branch: null, amount:null, password:null};
  }

  ngOnInit() {

  }
  onSubmit(){
    let branchStr:string = <any>this.model.branch;
    this.model.cpf = this.model.cpf.replace(/[\.\-]/,'').slice(0,9);
    this.model.branch = parseInt(branchStr.slice(0,4));

    this.bb.register(this.model).then(data => {
      if(data.id){
        this.router.navigate(['/']);
        this.snackBar.open("Conta registrada (anote): " + data.account, "OK");
      }else{
        this.snackBar.open("Conta não registrada.", "OK");
      }
    });
  }
}
