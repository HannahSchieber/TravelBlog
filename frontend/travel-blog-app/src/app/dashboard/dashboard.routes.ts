import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuardService} from '../guards/auth-guard.service';

export const dashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
    ]
  }
];
