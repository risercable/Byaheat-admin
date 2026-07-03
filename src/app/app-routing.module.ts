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
import {DriverComponent} from './profiles/driver/driver.component';

const routes: Routes = [
  // Default landing
  { path: '', redirectTo: 'driver-register', pathMatch: 'full' },

  // --- Driver-facing auth ---
  { path: 'login', component: DriverExistComponent },
  { path: 'driver-register', component: DriverNewComponent },
  { path: 'signup', component: SignupComponent },

  // --- Driver profile (protected) ---
  { path: 'profile', component: DriverComponent, canActivate: [AuthGuard] },
  { path: 'this', component: ThisdriverComponent, canActivate: [AuthGuard] },

  // --- Admin auth ---
  { path: 'admin-login', component: LoginComponent },

  // --- Admin dashboard (protected) ---
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

  // --- Admin: clients ---
  { path: 'clients/table', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'clients/table/history/:key/:fullname', component: ClientHistoryComponent, canActivate: [AuthGuard] },

  // --- Admin: payments ---
  { path: 'payments/table', component: ClientComponent, canActivate: [AuthGuard] },
  { path: 'payments/table/client/:key', component: TableComponent, canActivate: [AuthGuard] },

  // --- Admin: cars ---
  { path: 'cars/table', component: CarslistComponent, canActivate: [AuthGuard] },
  { path: 'cars/add-car', component: AddCarComponent, canActivate: [AuthGuard] },

  // --- Admin: drivers ---
  { path: 'drivers/add-driver', component: DriversComponent, canActivate: [AuthGuard] },
  { path: 'drivers/dispatch', component: DispatchingComponent, canActivate: [AuthGuard] },
  { path: 'drivers/table', component: DriversTableComponent, canActivate: [AuthGuard] },
  { path: 'drivers/table/location/:key/:firstname', component: DriversMapComponent, canActivate: [AuthGuard] },
  { path: 'drivers/map', component: DriversMapComponent, canActivate: [AuthGuard] },
  { path: 'drivers/ratings', component: RatespageComponent, canActivate: [AuthGuard] },

  // --- Admin: assignment / dispatch ---
  { path: 'assign', component: AssignDriverComponent, canActivate: [AuthGuard] },

  // --- Admin: remittances ---
  { path: 'remit-page', component: RemitsComponent, canActivate: [AuthGuard] },
  { path: 'remit-page/cash/by/:key/:fullname', component: RemitsHistoryComponent, canActivate: [AuthGuard] },

  // --- Admin: misc ---
  { path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] },
  { path: 'reservations', component: ReservationComponent, canActivate: [AuthGuard] },
  { path: 'chatpage', component: ChatPageComponent, canActivate: [AuthGuard] },
  { path: 'sendemail', component: SendEmailComponent, canActivate: [AuthGuard] },

  // --- Error / status pages ---
  { path: 'not-connected', component: NotcComponent },
  { path: 'not-found', component: NotFoundComponent },

  // Wildcard MUST be last
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
