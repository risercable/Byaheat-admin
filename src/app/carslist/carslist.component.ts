
import {map} from 'rxjs/operators';
import {Component, Inject, OnInit, ViewChild, ViewEncapsulation, AfterViewInit} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { CarService } from '../drivers/shared/car.service';
import { Car } from '../drivers/shared/car.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Title } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {ClientDetailsDialog} from "../account/account.component";
import * as firebase from "firebase";
import { Car as PerCar } from '../shared/models/car.model';
import {CarService as CarService2} from '../shared/car.service';

declare var jsPDF: any; // Important

@Component({
  selector: 'app-carslist',
  templateUrl: './carslist.component.html',
  styleUrls: ['./carslist.component.scss']
})
export class CarslistComponent implements OnInit, AfterViewInit {
  p: number = 1;
  carList: AngularFireList<any>;
  cars: Observable<any>;
  adriversList: AngularFireList<any>;
  adrivers: Observable<any>;
  undrivers: Observable<any>;
  carlist: Car[];
  selectedCar: Car = new Car();
  ipp: any;
  keyToPass: string;
  pnumberToPass: string;
  typeToPass: string;
  driversList: AngularFireList<any>;
  unDriverList: AngularFireList<any>;
  drvList: AngularFireList<any>;
  cList: AngularFireList<any>;
  brand: string;
  model: string;
  capacity: number;
  color: string;
  theDriver: string;
  notAssigned: AngularFireList<any[]>;
  length: number;
  itemList: PerCar[];
  isGreen: boolean = false;
  carSource = new MatTableDataSource<PerCar>();
  displayedColumns = [
    'carBrand',
    'carModel',
    'carType',
  ];
  noRecords: boolean;
  // const
  carColumnsToDisplay: [
    'carBrand',
    'carModel',
    'carType'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  elementsCar: any;

  ngAfterViewInit() {
    this.carSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    // Extract the value from the input event
    const filterVal = !filterValue ? (event.target as HTMLInputElement).value : filterValue;

    // Apply the filter: trim whitespace and convert to lowercase
    // MatTableDataSource expects a lowercase string for its internal search
    this.carSource.filter = filterVal.trim().toLowerCase();

    // If you have pagination, reset to the first page after filtering
    if (this.carSource.paginator) {
      this.carSource.paginator.firstPage();
    }
  }


  constructor(
    private db: AngularFireDatabase,
    private carService: CarService,
    private titleService: Title,
    public dialog: MatDialog,
    private carService2: CarService2,
  ) {
    this.carService2.getAll().subscribe(cars => {
      // Assign the data array to the dataSource.data property
      this.carSource.data = cars;
      this.carSource.paginator = this.paginator;
      this.carSource.sort = this.sort;
    });
   }

  openDialog(i: any): void {
    let dialogRef = this.dialog.open(ClientDetailsDialog, {
      width: 'auto',
      data: { cararray: i }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openAssign(i: any): void {
    let dbRef = this.db.list('drivers', ref => ref.orderByChild('assigned_car').equalTo('none'));
    let dialogRef = this.dialog.open(AssignCarDialog, {
      width: 'auto',
      data: { drarray: dbRef }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // showX(i) {
  //   i.popover('show');
  // }

  ngOnInit() {
    this.setTitle("Lakbay | Cars List");
    const x = this.carService.getData();
    x.snapshotChanges().subscribe(item => {
      this.carlist = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y["id"] = element.key;
        this.carlist.push(y as Car);
      });
    });

    this.resetForm();
  }

  // addGreen(value) {
  //   this.isGreen = value;
  // }

  passKey(key: string, pnumber: string, brand: string, model: string, capacity: number, color: string, type: string, ){
    this.keyToPass = key;
    this.pnumberToPass = pnumber;
    this.brand = brand;
    this.model = model;
    this.capacity = capacity;
    this.color = color;
    this.typeToPass = type;
  }

  passunKey(key: string, pnumber: string, brand: string, model: string, capacity: number, color: string, type: string, driver: string){
    this.keyToPass = key;
    this.pnumberToPass = pnumber;
    this.brand = brand;
    this.model = model;
    this.capacity = capacity;
    this.color = color;
    this.typeToPass = type;
    this.theDriver = driver;

    this.unDriverList = this.db.list('drivers', ref => ref.orderByChild('user_email').equalTo(this.theDriver));

    this.undrivers = this.unDriverList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  assignNow(drkey: string, dremail: string, platenum: string, type: string) {
    this.drvList.update(drkey, { assigned_car: {car_plate_number: platenum, car_brand: this.brand, car_model: this.model, car_capacity: this.capacity, car_color: this.color, car_type: type} });
    this.drvList.update(drkey, {car_type: type});
    this.cList.update(this.keyToPass, { car_driver: dremail });

    firebase.database().ref('reservation_dates').child(type).child(drkey).update({
      nodate: "true"
    })
  }

  unassignNow(theKey: string, theEmail: string) {
    this.drvList.update(theKey, {assigned_car: 'none'});
    this.drvList.update(theKey, {car_type: null});
    this.cList.update(this.keyToPass, {car_driver: 'none'});
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onSubmit(form: NgForm) {
    if (form.value.id == null)
      this.carService.insertCar(form.value);
    else
      this.carService.updateCar(form.value);
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.carService.selectedCar = {
      id: null,
      carBrand: "",
      carCapacity: 0,
      carType: "",
      carColor: "",
      carModel: "",
      carPlateNumber: ""
    }
  }

  onDelete(form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.carService.deleteDriver(form.value.id);
      this.resetForm(form);
    }
  }

  onItemClick(carx : Car){
    this.carService.selectedCar = Object.assign({},carx);
  }

  onPrint(){
    var doc = new jsPDF('p', 'pt');
  doc.text("Cars List", 40, 50);
  var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
  var columns = [res.columns[0], res.columns[1], res.columns[2], res.columns[3], res.columns[4], res.columns[5], res.columns[6]];
  doc.autoTable(columns, res.data, {tableWidth: 'wrap', startY: false, margin: {top: 100}});
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

  sendPlateNumber(element) {
    this.elementsCar = element;
  }
}

@Component({
  selector: 'car-details-dialog',
  templateUrl: 'car-details-dialog.html',
  styleUrls: ['car-details-style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarDetailsDialog {

  constructor(
    public dialogRef: MatDialogRef<CarDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'assign-car-dialog',
  templateUrl: 'assign-car-dialog.html',
  encapsulation: ViewEncapsulation.None
})

export class AssignCarDialog {

  constructor(public dialogRef: MatDialogRef<AssignCarDialog>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
