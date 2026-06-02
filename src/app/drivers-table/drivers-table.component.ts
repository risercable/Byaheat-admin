
import {map} from 'rxjs/operators';
import {Component, OnInit, Inject, ViewChild, ChangeDetectorRef, ViewEncapsulation} from '@angular/core';
import { DriverService } from '../shared/driver.service';
import { DriverService as OldDriverSvc } from '../drivers/shared/driver.service';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Driver } from '../drivers/shared/driver.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort, MatSnackBar} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from "@angular/router";
import {GeoFire} from "geofire";
import * as firebase from "firebase";

declare var jsPDF: any; // Important

@Component({
  selector: 'app-drivers-table',
  templateUrl: './drivers-table.component.html',
  styleUrls: ['./drivers-table.component.scss']
})
export class DriversTableComponent implements OnInit {
  p: number = 1;
  email: string;
  password: string;
  driverlist: Driver[];
  driverList: AngularFireList<any>;
  driverEdit: AngularFireList<any>;
  drivers: Observable<any[]>
  edits: Observable<any[]>;
  selectedDriver : Driver = new Driver();
  emailadded: boolean = false;
  ipp: any;
  connectedRef: any;
  wasPreviouslyConnected = false;
  inlineOne: string;
  selectedRow : Number;
  setClickedRow : Function;
  theKey: string;
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  options: FormGroup;
  itemList: Item[] = [];
  itemRating: any[];
  dataSource = new MatTableDataSource(this.itemList);
  displayedColumns = ['in1', 'firstName', 'lastName', 'email', 'dispatched', 'actions'];
  noRecords: boolean;
  order: string;
  reverse: boolean = false;
  lat: number;
  lng: number;
  public markers: any;
  private detailsCache: { [key: string]: Driver } = {};

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if(this.dataSource.filteredData.length == 0) {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }
  }

  constructor(
    public authService: AuthService,
    public driverService: DriverService,
    public db: AngularFireDatabase,
    private titleService: Title,
    public dialog: MatDialog,
    fb: FormBuilder,
    public router: Router,
    private oldDriverSvc: OldDriverSvc,
    private cdr: ChangeDetectorRef
  ) {
    this.options = fb.group({
      'color': 'primary',
      'fontSize': [16, Validators.min(10)],
    });
  }

  ngOnInit() {

    this.inlineOne = 'h-default';

    this.titleService.setTitle("Lakbay | Drivers List");
    this.itemRating = [];

    // Get Drivers List
    this.getAll();
  }

  private getAll() {
    this.driverService.getAll().subscribe(data => {
      this.itemList = data;

      // Initialize MatTableDataSource with populated itemList
      this.dataSource = new MatTableDataSource(this.itemList);

      // Ensure the table is updated correctly
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.cdr.detectChanges();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  openDialog(f1: object, f2: string): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: { ...f1  }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.theKey = result;
    });

  }

  dispatchDetails(dk: string): void {
    let dialogRef = this.dialog.open(DpDetailsDialog, {
      width: '460px',
      data: { thedk: dk }
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDispatch(d1: any): void {
    let dialogRef = this.dialog.open(DispatchDialog, {
      width: '460px',
      data: { thed1: d1 }
    })

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onLocation(dElement, dFname, dLname) {
    this.router.navigate(['/drivers/table/location', dElement.$key, dElement.user_firstname  + ' ' + dElement.user_lastname]);
  }

  private getUserLocation() {
    /// locate the user

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        // this.geo.getLocations(5000, [this.lat, this.lng]);
      });
    }
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  onSubmit(form: NgForm) {
    if (form.value.$key == null)
      this.oldDriverSvc.insertDriver(form.value);
    else {
      this.oldDriverSvc.updateDriver(form.value);
    }
  }

  onSubmit2(form: NgForm) {
    this.oldDriverSvc.updateEmail(form.value);
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.reset();
    }

    this.oldDriverSvc.selectedDriver = {
      id: null,
      email: '',
      password: '',
      firstName : '',
      lastName : '',
      birthDate: '',
      mobile: 0,
    };
  }

  // signup(drv: Driver) {
  //   this.authService.signup(this.email, this.password);
  //   this.email = this.password = '';
  //
  //   this.driverList.update(drv.$key,{
  //     email: this.email,
  //     password: this.password
  //   });
  // }

  updateDriver(drv : Driver){
    this.driverList.update(drv.$key,{
      email: drv.email,
      password: drv.password});
  }

  onDelete(form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.oldDriverSvc.deleteDriver(form.value.$key);
      this.resetForm(form);
    }
  }

  onItemClick(drv : Driver){
    this.oldDriverSvc.selectedDriver = Object.assign({},drv);
  }

  resetAlert() {
    this.oldDriverSvc.updriver = false;
    this.oldDriverSvc.deldriver = false;
    this.oldDriverSvc.indriver = false;
    this.oldDriverSvc.emailadded = false;
  }

  onPrint(){
    var doc = new jsPDF('p', 'pt');
    doc.text("Drivers List", 40, 50);
    var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
    var columns = [res.columns[0], res.columns[1], res.columns[2], res.columns[3], res.columns[4]];
    doc.autoTable(columns, res.data, {tableWidth: 'auto', startY: false, margin: {top: 100}, theme: 'striped'});
    var pdfUrl = doc.output('datauri').substring(doc.output('datauri').indexOf(',')+1);
    var binary = atob(pdfUrl.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }

    var blob = new Blob( [view], { type: "application/pdf" });
    var url = URL.createObjectURL(blob);

    window.open(url);
  }
  onAll() {
    this.ipp = 9999;
  }

  onOptionSelected(event){
    console.log(event) //option value will be sent as event
    this.ipp = event;
  }

  passKey(theKey: string) {
    this.driverEdit = this.db.list('drivers');
    this.edits = this.driverEdit.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  changeH() {
    if(this.inlineOne == 'h-default') {
      this.inlineOne = 'highlight';
    } else {
      this.inlineOne = 'h-default';
    }
  }

  preloadDetails(key: string) {
    if (this.detailsCache[key]) {
      return;
    }

    this.driverService.getDetails(key).subscribe(data => {
      this.detailsCache[key] = data;
    });
  }
}

export interface Item {
  in1?: number;
  firstName: string;
  lastName: string;
  email: string;
  total_rating?: number;
  dispatched?: boolean;
}

@Component({
  selector: 'dpdetails-dialog',
  templateUrl: 'dpdetails-dialog.html',
})
export class DpDetailsDialog {
  full_name: string;
  car_con: string;
  car_pnum: string;
  time_in: any;
  time_out: any;

  constructor(
    public dialogRef: MatDialogRef<DpDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public oldDriverSvc : OldDriverSvc, public db2: AngularFireDatabase) {

    let dete = firebase.database().ref('dispatches').child(data.thedk);

    dete.once('value', item => {
      this.full_name = item.val().driver_full_name;
      this.car_pnum = item.val().car_plate_number;
      this.time_in = item.val().time_in;
      this.time_out = item.val().time_out;
      this.car_con = item.val().car_condition;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'dispatch.dialog',
  templateUrl: 'dispatch.dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class DispatchDialog {
  tNow: any;
  tOut: any;

  constructor(
    public dialogRef: MatDialogRef<DispatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public oldDriverSvc : OldDriverSvc, public db2: AngularFireDatabase, public snackBar: MatSnackBar) {

    // let timestamp = +new Date();

    // this.tNow = new Date(timestamp).toLocaleString();
    // this.tNow = this.tNow.split(' ').slice(0, 6).join(' ');

    // let cpDate  = new Date(timestamp);

    // cpDate.setHours(cpDate.getHours()+8);

    // this.tOut = new Date(cpDate).toLocaleString();
    // this.tOut = this.tOut.split(' ').slice(0, 6).join(' ');

    // console.log(this.tNow);
  }

  openSnackBar(message: string) {
    this.snackBar.open("Success dispatch: " + message, "Ok", {
      duration: 2000,
    });
  }

  onNoClick() {
    // firebase.database().ref('drivers/' + this.data.thed1.$key).update({
    //   dispatched: x
    // })
    this.dialogRef.close();
  }

  onYes(x: boolean, cCon: string): void {
    firebase.database().ref('drivers/' + this.data.thed1.$key).update({
      dispatched: x
    })
    firebase.database().ref('dispatches/' + this.data.thed1.$key).update({
      driver_fullname: this.data.thed1.user_firstname + " " + this.data.thed1.user_lastname,
      car_plate_number: this.data.thed1.assigned_car.car_plate_number,
      car_condition: cCon,
      time_in: this.tNow,
      time_out: this.tOut
    })
    this.dialogRef.close();

    this.openSnackBar(this.data.thed1.user_firstname);
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  encapsulation: ViewEncapsulation.None,
})
export class DialogOverviewExampleDialog {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  f11: Driver[];
  f1list: AngularFireList<any>;
  f1ss: Observable<any[]>
  allData: any[];

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

  // onSubmit(form: NgForm) {
  //   if (form.value.$key == null) {
  //     this.oldDriverSvc.insertDriver(form.value);
  //     this.dialogRef.close();
  //   }
  //   else {
  //     this.oldDriverSvc.updateDriver(form.value);
  //     this.dialogRef.close();
  //   }
  // }

  onCancel(form: NgForm) {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'driver-location-dialog',
  templateUrl: 'driver-location-dialog.html',
})
export class DriverLocationDialog {
  constructor(
    public drlocationdialogRef: MatDialogRef<DriverLocationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  onNoClick(): void {
    this.drlocationdialogRef.close();
  }
}
