import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BluebankService } from './bluebank.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private bb:BluebankService, private router:Router){
    this.bb.logout();
    this.router.navigate(['/']);
  }
  logout(){

  }
}
