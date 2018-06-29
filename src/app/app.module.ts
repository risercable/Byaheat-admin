import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import * as firebase from 'firebase/app';
import { DataTablesModule } from 'angular-datatables';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogOverviewExampleDialog } from './drivers-table/drivers-table.component';
import { ViewDetailsDialog } from './reservation/reservation.component';
import { PlateExistExampleDialog } from './add-car/add-car.component';
import { PizzaPartyComponent } from './add-car/add-car.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { StarRatingModule } from 'angular-star-rating';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material';
import {MatSortModule} from "@angular/material"

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import { FilterPipe} from './filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {MatButtonModule, MatCheckboxModule, MatNativeDateModule, MatCardModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { AngularFireDatabaseModule } from 'angularfire2/database';
import { HttpModule } from '@angular/http';

import { CrisisListComponent }   from './crisis-list.component';
import { PageNotFoundComponent } from './not-found.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng4-validators'

import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AuthGuard } from './auth/auth.guard';
import { LoginGuard } from './login.guard';
import { AngularFireModule } from 'angularfire2';
import angularLoad from 'angular-load';
import { Location } from '@angular/common';
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

import { StorageService } from './storage.service';
import { ReservationComponent } from './reservation/reservation.component';

import { AngularFireStorageModule } from 'angularfire2/storage';

import { OrderModule } from 'ngx-order-pipe';

@NgModule({
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    AppRoutingModule,
    AngularFireAuthModule,
    DataTablesModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxPaginationModule,
    FilterPipeModule,
    Ng2SearchPipeModule,
    CustomFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    AngularFireStorageModule,
    StarRatingModule.forRoot(),
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
    AssignDriverComponent,
    ThisdriverComponent,
    CarslistComponent,
    AddCarComponent,
    FilterPipe,
    ReservationComponent,
    DialogOverviewExampleDialog,
    PizzaPartyComponent,
    PlateExistExampleDialog,
    ViewDetailsDialog
  ],
  entryComponents: [DialogOverviewExampleDialog, PizzaPartyComponent, PlateExistExampleDialog, ViewDetailsDialog],
  providers: [AuthService, AuthGuard, AngularFireDatabase, LoginGuard, DriverService, CarService, ClientService, StorageService, MatDatepickerModule],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
