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
    redirectTo: 'driver-register',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: DriverExistComponent,
    pathMatch: 'full',
  },
  {
    path: 'driver-register',
    component: DriverNewComponent,
    pathMatch: 'full',
  },
  {
      path: 'admin-login',
      component: LoginComponent,
      pathMatch: 'full',
    },
    { path: 'home', component: HomeComponent, pathMatch: 'full', },
    { path: 'clients/table', component: AccountComponent, pathMatch: 'full', },
    { path: 'clients/table/history/:key/:fullname', component: ClientHistoryComponent, pathMatch: 'full', },
    { path: 'payments/table', component: ClientComponent, pathMatch: 'full', },
    { path: 'payments/table/client/:key', component: TableComponent, pathMatch: 'full', },
    { path: 'cars/table', component: CarslistComponent, pathMatch: 'full', },
    { path: 'chatpage', component: ChatPageComponent, pathMatch: 'full', },
    { path: 'reservations', component: ReservationComponent, pathMatch: 'full', },
    { path: 'cars/add-car', component: AddCarComponent, pathMatch: 'full', },
    { path: 'packages', component: PackagesComponent, pathMatch: 'full', },
    { path: 'drivers/add-driver', component: DriversComponent, pathMatch: 'full', },
    { path: 'assign', component: AssignDriverComponent, pathMatch: 'full', },
    { path: 'drivers/dispatch', component: DispatchingComponent, pathMatch: 'full', },
    { path: 'drivers/table', component: DriversTableComponent, pathMatch: 'full', },
    { path: 'drivers/table/location/:key/:firstname', component: DriversMapComponent, pathMatch: 'full', },
    { path: 'drivers/map', component: DriversMapComponent, pathMatch: 'full', },
    { path: 'drivers/ratings', component: RatespageComponent, pathMatch: 'full', },
    { path: 'remit-page', component: RemitsComponent, pathMatch: 'full', },
    { path: 'remit-page/cash/by/:key/:fullname', component: RemitsHistoryComponent, pathMatch: 'full', },
    { path: 'sendemail', component: SendEmailComponent, pathMatch: 'full', },
    { path: 'this', component: ThisdriverComponent, pathMatch: 'full', },
    { path: 'not-found', component: NotFoundComponent, pathMatch: 'full', },
  {
    path: 'signup',
    component: SignupComponent,
    pathMatch: 'full',
  },
  {
    path: 'not-connected',
    component: NotcComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
