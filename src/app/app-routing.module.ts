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
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import {TableComponent} from "./payments/table/table.component";
import {ClientComponent} from "./payments/client/client.component";
import {DriversMapComponent} from "./drivers-map/drivers-map.component";
import {SendEmailComponent} from "./send-email/send-email.component";
import {NotcComponent} from "./notc/notc.component";
import {NotFoundLayoutComponent} from "./layouts/not-found-layout/not-found-layout.component";
import {DriverLocationComponent} from "./driver-location/driver-location.component";

const routes: Routes = [
  // { path:'', redirectTo: 'home', pathMatch: 'full', canActivate: [AuthGuard] },
  // { path:'home',   component: HomeComponent, canActivate: [AuthGuard] },
  // { path:'users/table', component: AccountComponent, canActivate: [AuthGuard] },
  // { path:'user/history/:$key', component:ClientHistoryComponent, canActivate: [AuthGuard]},
  // { path:'payments/table', component:ClientComponent, canActivate: [AuthGuard]},
  // { path:'payments/table/client/:$key', component:TableComponent, canActivate: [AuthGuard]},
  // { path:'login',   component: LoginComponent},
  // { path:'cars/table', component: CarslistComponent, canActivate: [AuthGuard]},
  // { path:'reservations', component: ReservationComponent, canActivate: [AuthGuard]},
  // { path:'cars/add-car', component: AddCarComponent, canActivate: [AuthGuard] },
  // { path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] },
  // { path: 'drivers/add-driver', component: DriversComponent, canActivate: [AuthGuard] },
  // { path: 'assign', component: AssignDriverComponent, canActivate: [AuthGuard] },
  // { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] },
  // { path: 'drivers/table', component: DriversTableComponent, canActivate: [AuthGuard] },
  // { path: 'this', component: ThisdriverComponent, canActivate: [AuthGuard] },
  // { path: 'not-found', component: NotFoundComponent },
  // { path: '**', redirectTo: 'not-found' }
  {
    path: '',                       // {1}
    component: HomeLayoutComponent,
    canActivate: [AuthGuard],       // {2}
    children: [
      {
        path: '',
        component: HomeComponent   // {3}
      },
      { path:'users/table', component: AccountComponent},
      { path:'user/history/:$key', component:ClientHistoryComponent},
      { path:'payments/table', component:ClientComponent},
      { path:'payments/table/client/:$key', component:TableComponent},
      { path:'cars/table', component: CarslistComponent},
      { path:'reservations', component: ReservationComponent},
      { path:'cars/add-car', component: AddCarComponent},
      { path: 'packages', component: PackagesComponent},
      { path: 'drivers/add-driver', component: DriversComponent},
      { path: 'assign', component: AssignDriverComponent},
      { path: 'signup', component: SignupComponent},
      { path: 'drivers/table', component: DriversTableComponent},
      { path: 'drivers/table/location/:$key', component: DriverLocationComponent},
      { path: 'drivers/map', component: DriversMapComponent},
      { path: 'sendemail', component: SendEmailComponent},
      { path: 'this', component: ThisdriverComponent},
    ]
  },
  {
    path: '',
    component: LoginLayoutComponent, // {4}
    children: [
      {
        path: 'login',
        component: LoginComponent   // {5}
      }
    ]
  },
  {
    path: 'not-connected',
    component: NotFoundLayoutComponent,
    children: [
      {
        path: 'not-connected',
        component: NotcComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
