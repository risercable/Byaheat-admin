import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { CrisisListComponent }   from './crisis-list.component';
// import { HeroListComponent }  from './hero-list.component';  // <-- delete this line
import { PageNotFoundComponent } from './not-found.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './login.guard';
import { PackagesComponent } from './packages/packages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DriversComponent } from './drivers/drivers.component';
import { DriversTableComponent } from './drivers-table/drivers-table.component';
import { SignupComponent } from './signup/signup.component';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { ThisdriverComponent } from './thisdriver/thisdriver.component';
import { CarslistComponent } from './carslist/carslist.component';
import { AddCarComponent } from './add-car/add-car.component';
import { ReservationComponent } from './reservation/reservation.component';
import {ClientHistoryComponent} from "./client-history/client-history.component";

const routes: Routes = [
  { path:'',   component: HomeComponent, canActivate: [AuthGuard] },
  { path:'users/table', component: AccountComponent, canActivate: [AuthGuard] },
  { path:'user/history/:$key', component:ClientHistoryComponent, canActivate: [AuthGuard]},
  { path:'login',   component: LoginComponent},
  { path:'cars/table', component: CarslistComponent, canActivate: [AuthGuard]},
  { path:'reservations', component: ReservationComponent, canActivate: [AuthGuard]},
  { path:'cars/add-car', component: AddCarComponent, canActivate: [AuthGuard] },
  { path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] },
  { path: 'drivers/add-driver', component: DriversComponent, canActivate: [AuthGuard] },
  { path: 'assign', component: AssignDriverComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  { path: 'drivers/table', component: DriversTableComponent, canActivate: [AuthGuard] },
  { path: 'this', component: ThisdriverComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
