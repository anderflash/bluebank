import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BluebankService } from '../bluebank.service';
import { TransferModel } from '../transfer.model';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit {
  model: TransferModel;

  constructor(private bb:BluebankService, private router:Router) {
    this.model = {
      branch: null,
      account: null,
      amount: null
    };
  }

  ngOnInit() {
  }

  onSubmit(){
    this.bb.transfer(this.model).then(value=>{
      this.router.navigate(['transfer']);
    });
  }

}
