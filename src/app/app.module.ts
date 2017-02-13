import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { LandpageComponent } from './landpage/landpage.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferComponent } from './transfer/transfer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BluebankService } from './bluebank.service';
import { routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    LandpageComponent, 
    RegisterComponent,
    LoginComponent,
    TransferComponent, 
    TransferListComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    MaterialModule.forRoot()
  ],
  providers: [BluebankService],
  bootstrap: [AppComponent]
})
export class AppModule { }
