import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import { DataTablesModule } from 'angular-datatables';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  DialogOverviewExampleDialog,
  DispatchDialog, DpDetailsDialog,
  DriverLocationDialog
} from './drivers-table/drivers-table.component';
import { ViewDetailsDialog } from './reservation/reservation.component';
import { PlateExistExampleDialog } from './add-car/add-car.component';
import { PizzaPartyComponent } from './add-car/add-car.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatIconModule, MatInputModule} from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material';
import {MatSortModule} from "@angular/material";
import {ClientDetailsDialog, PrintOptsDialog} from "./account/account.component";
import {AssignCarDialog, CarDetailsDialog} from "./carslist/carslist.component";

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe} from './filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatButtonModule, MatCheckboxModule, MatNativeDateModule, MatCardModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatTooltipModule} from '@angular/material/tooltip';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpModule } from '@angular/http';

import { CrisisListComponent }   from './crisis-list.component';
import { PageNotFoundComponent } from './not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { FormsModule } from '@angular/forms';

import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './login.guard';
import { AngularFireModule } from 'angularfire2';
import { PackagesComponent } from './packages/packages.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DriversComponent } from './drivers/drivers.component';
import { AddDriverComponent } from './drivers/add-driver/add-driver.component';
import { DriversListComponent } from './drivers/drivers-list/drivers-list.component';
import { DriverService } from './drivers/shared/driver.service';
import { CarService } from './drivers/shared/car.service';
import { ClientService } from './drivers/shared/client.service';
import { DriversTableComponent } from './drivers-table/drivers-table.component';
import { SignupComponent } from './signup/signup.component';
import { AssignDriverComponent } from './assign-driver/assign-driver.component';
import { ThisdriverComponent } from './thisdriver/thisdriver.component';
import { CarslistComponent } from './carslist/carslist.component';
import { AddCarComponent } from './add-car/add-car.component';
import { TruncatePipe } from "./limit.pipe";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { StorageService } from './storage.service';
import { ReservationComponent, PrintMenuDialog } from './reservation/reservation.component';

import { AngularFireStorageModule } from 'angularfire2/storage';

import { OrderModule } from 'ngx-order-pipe';
import { ClientHistoryComponent } from './client-history/client-history.component';
import { SidebarModule } from 'ng-sidebar';
import {NgxMaskModule} from 'ngx-mask';

import {DriversMapComponent} from "./drivers-map/drivers-map.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { PlotlyModule } from 'angular-plotly.js';
import {ClientComponent} from './payments/client/client.component';
import {TableComponent} from './payments/table/table.component';
import {ChatPageComponent} from './chat-page/chat-page.component';
import {DispatchingComponent} from './dispatching/dispatching.component';
import {RatespageComponent} from './ratespage/ratespage.component';
import {RemitsComponent} from './remits/remits.component';
import {RemitsHistoryComponent} from './remits-history/remits-history.component';
import {SendEmailComponent} from './send-email/send-email.component';
import {LoginLayoutComponent} from './layouts/login-layout/login-layout.component';
import {NotFoundLayoutComponent} from './layouts/not-found-layout/not-found-layout.component';
import {NotcComponent} from './notc/notc.component';
import {HomeLayoutComponent} from './layouts/home-layout/home-layout.component';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    AngularFireAuthModule,
    DataTablesModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    NgxPaginationModule,
    FilterPipeModule,
    Ng2SearchPipeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatIconModule,
    MatSnackBarModule,
    MatTableModule,
    MatSnackBarModule,
    MatPaginatorModule,
    HttpClientModule,
    MatSortModule,
    MatCardModule,
    PlotlyModule,
    NgbModule.forRoot(),
    AngularFireStorageModule,
    SidebarModule.forRoot(),
    NgxMaskModule.forRoot(),
    OrderModule
  ],
  declarations: [
    AppComponent,
    CrisisListComponent,
    PageNotFoundComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    PackagesComponent,
    NotFoundComponent,
    DriversComponent,
    AddDriverComponent,
    DriversListComponent,
    DriversTableComponent,
    SignupComponent,
    DriversMapComponent,
    AssignDriverComponent,
    ThisdriverComponent,
    CarslistComponent,
    AddCarComponent,
    FilterPipe,
    ReservationComponent,
    DialogOverviewExampleDialog,
    DispatchDialog,
    DpDetailsDialog,
    PrintOptsDialog,
    ClientDetailsDialog,
    PizzaPartyComponent,
    PlateExistExampleDialog,
    ViewDetailsDialog,
    CarDetailsDialog,
    AssignCarDialog,
    ClientHistoryComponent,
    TruncatePipe,
    ClientComponent,
    TableComponent,
    ChatPageComponent,
    DispatchingComponent,
    RatespageComponent,
    RemitsComponent,
    RemitsHistoryComponent,
    SendEmailComponent,
    LoginLayoutComponent,
    NotFoundLayoutComponent,
    NotcComponent,
    HomeLayoutComponent
  ],
  entryComponents: [
    DialogOverviewExampleDialog,
    PizzaPartyComponent,
    PlateExistExampleDialog,
    ViewDetailsDialog,
    ClientDetailsDialog,
    CarDetailsDialog,
    ClientComponent,
    TableComponent,
    ChatPageComponent,
    DispatchingComponent,
    RatespageComponent,
    RemitsComponent,
    RemitsHistoryComponent,
    SendEmailComponent,
    LoginLayoutComponent,
    NotFoundLayoutComponent,
    NotcComponent
  ],
  providers: [AuthService, AuthGuard, AngularFireDatabase, LoginGuard, DriverService, CarService, ClientService, StorageService, MatDatepickerModule],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
