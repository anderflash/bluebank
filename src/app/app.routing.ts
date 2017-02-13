import { Routes, RouterModule } from '@angular/router';

// Our components
import { LandpageComponent } from './landpage/landpage.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TransferListComponent } from './transfer-list/transfer-list.component';
import { TransferComponent } from './transfer/transfer.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const appRoutes: Routes = [
  {
    path: '',
    component: LandpageComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'transfer',
    component: TransferListComponent
  },
  {
    path: 'transfer/new',
    component: TransferComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

export const routing = RouterModule.forRoot(appRoutes);