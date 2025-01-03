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
import {ClientHistoryComponent} from './client-history/client-history.component';
import { LoginLayoutComponent } from './layouts/login-layout/login-layout.component';
import {TableComponent} from './payments/table/table.component';
import {ClientComponent} from './payments/client/client.component';
import {DriversMapComponent} from './drivers-map/drivers-map.component';
import {SendEmailComponent} from './send-email/send-email.component';
import {NotcComponent} from './notc/notc.component';
import {NotFoundLayoutComponent} from './layouts/not-found-layout/not-found-layout.component';
import {DriverLocationComponent} from './driver-location/driver-location.component';
import {RemitsComponent} from './remits/remits.component';
import {RemitsHistoryComponent} from './remits-history/remits-history.component';
import {RatespageComponent} from './ratespage/ratespage.component';
import {DispatchingComponent} from './dispatching/dispatching.component';
import {ChatPageComponent} from './chat-page/chat-page.component';
import {DriverNewComponent} from './driver-new/driver-new.component';
import { DriverExistComponent } from './driver-exist/driver-exist.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'driver-register', // Default route
    pathMatch: 'full',
  },
  {
    path: 'login',
    pathMatch: 'full',
    component: DriverExistComponent
  },
  {
    path: 'driver-register',
    component: DriverNewComponent, // Driver registration page
  },
  {
    path: 'admin',
    component: LoginLayoutComponent, // Admin layout if you have one
    canActivate: [AuthGuard], // Protect admin routes
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home', component: HomeComponent },
      { path: 'clients/table', component: AccountComponent },
      { path: 'clients/table/history/:key/:fullname', component: ClientHistoryComponent },
      { path: 'payments/table', component: ClientComponent },
      { path: 'payments/table/client/:key', component: TableComponent },
      { path: 'cars/table', component: CarslistComponent },
      { path: 'chatpage', component: ChatPageComponent },
      { path: 'reservations', component: ReservationComponent },
      { path: 'cars/add-car', component: AddCarComponent },
      { path: 'packages', component: PackagesComponent },
      { path: 'drivers/add-driver', component: DriversComponent },
      { path: 'assign', component: AssignDriverComponent },
      { path: 'drivers/dispatch', component: DispatchingComponent },
      { path: 'drivers/table', component: DriversTableComponent },
      { path: 'drivers/table/location/:key/:firstname', component: DriversMapComponent },
      { path: 'drivers/map', component: DriversMapComponent },
      { path: 'drivers/ratings', component: RatespageComponent },
      { path: 'remit-page', component: RemitsComponent },
      { path: 'remit-page/cash/by/:key/:fullname', component: RemitsHistoryComponent },
      { path: 'sendemail', component: SendEmailComponent },
      { path: 'this', component: ThisdriverComponent },
      { path: 'not-found', component: NotFoundComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'not-connected',
    component: NotcComponent,
  },
  {
    path: '**',
    component: NotFoundComponent, // Catch-all for unknown routes
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
