import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import { DriverService } from '../drivers/shared/driver.service';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Driver } from '../drivers/shared/driver.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { AuthService } from '../auth.service';
import { Observable } from 'rxjs/Observable';
import { Title } from '@angular/platform-browser';

import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Item} from "../reservation/reservation.component";
import {Router} from "@angular/router";
import {GeoFire} from "geofire";
import {GeofireService} from "../geofire.service";

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
  itemList: Item[];
  dataSource = new MatTableDataSource(this.itemList);
  displayedColumns = ['in1', 'user_firstname', 'user_lastname', 'user_email', 'actions', 'location'];
  noRecords: boolean;
  order: string;
  reverse: boolean = false;
  lat: number;
  lng: number;
  public markers: any;

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

  constructor(public authService: AuthService, public driverService : DriverService, public db: AngularFireDatabase, private titleService: Title, public dialog: MatDialog, fb: FormBuilder, public router: Router, private geo: GeofireService) {
    this.options = fb.group({
      'color': 'primary',
      'fontSize': [16, Validators.min(10)],
    });

    let data = db.list('drivers');
    this.itemList = [];

    data.snapshotChanges().subscribe(item => {
      this.itemList = [];
      let i = 1;
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json["in1"] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as Item);

        i++;

      });

      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

    this.driverList = db.list('drivers');
    this.drivers = this.driverList.snapshotChanges().map(actions => {
      return actions.map(action => ({ key: action.payload.key, ...action.payload.val() }));
    }).map(items => {
      return items.map(item => item.key);
    });

    this.setClickedRow = function(index){
      this.selectedRow = index;
    }

  }

  ngOnInit() {

    this.inlineOne = 'h-default';

    this.titleService.setTitle("Lakbay | Drivers List");

    const x = this.driverService.getData();
    x.snapshotChanges().subscribe(item => {
      this.driverlist = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y["$key"] = element.key;
        this.driverlist.push(y as Driver);
      });
    });

    this.ipp = 10;
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  openDialog(f1: string, f2: string): void {
    let dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '600px',
      data: { theKey: f1,
              theEmail: f2
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.theKey = result;
    });

  }

  onLocation(dElement, dFname, dLname) {
    this.router.navigate(['/drivers/table/location', dElement.$key]);
  }

  private getUserLocation() {
    /// locate the user

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.geo.getLocations(5000, [this.lat, this.lng]);
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
      this.driverService.insertDriver(form.value);
    else {
      this.driverService.updateDriver(form.value);
    }
  }

  onSubmit2(form: NgForm) {
    this.driverService.updateEmail(form.value);
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.driverService.selectedDriver = {
      $key: null,
      email: '',
      password: '',
      user_firstname : '',
      user_lastname : '',
      user_birthdate: '',
      user_mobile: 0,
      user_address : '',
    }
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
      this.driverService.deleteDriver(form.value.$key);
      this.resetForm(form);
    }
  }

  onItemClick(drv : Driver){
    this.driverService.selectedDriver = Object.assign({},drv);
  }

  resetAlert() {
    this.driverService.updriver = false;
    this.driverService.deldriver = false;
    this.driverService.indriver = false;
    this.driverService.emailadded = false;
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
    this.edits = this.driverEdit.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  changeH() {
    if(this.inlineOne == 'h-default') {
      this.inlineOne = 'highlight';
    } else {
      this.inlineOne = 'h-default';
    }
  }

}

export interface Item {
  in1: number;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {
  minDate = new Date(2000, 0, 1);
  maxDate = new Date();
  f11: Driver[];
  f1list: AngularFireList<any>;
  f1ss: Observable<any[]>

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public driverService : DriverService, public db2: AngularFireDatabase) {

    console.log(data.theKey);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(form: NgForm) {
    if (form.value.$key == null) {
      this.driverService.insertDriver(form.value);
      this.dialogRef.close();
    }
    else {
      this.driverService.updateDriver(form.value);
      this.dialogRef.close();
    }
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
