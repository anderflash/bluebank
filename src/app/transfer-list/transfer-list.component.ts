import { Component, OnInit } from '@angular/core';

import { BluebankService } from '../bluebank.service';

@Component({
  selector: 'app-transfer-list',
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  private list: any[];
  constructor(private bb: BluebankService) { 
    this.list = null;
  }

  ngOnInit() {
    this.bb.transferList.then(values => {
      this.list = values;
    });
  }

}
