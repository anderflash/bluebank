import { Component, OnInit } from '@angular/core';

import { BluebankService } from '../bluebank.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  model: {name:string, amount: number, registerdate: Date};
  constructor(private bb: BluebankService ) {
    this.model = {name: null, amount: null, registerdate: null};
  }

  ngOnInit() {
    console.log(this.bb.currentUser);
    this.model.name = this.bb.currentUser.name;
    this.model.amount = this.bb.currentUser.amount;
    this.model.registerdate = new Date((<any>this.bb.currentUser.registerdate).replace(' ', 'T'));
    this.bb.amount.then(value => this.model.amount = value.amount);
  }
}
