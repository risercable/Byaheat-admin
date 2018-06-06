import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { Observable } from 'rxjs/Observable';
import { CarService } from '../drivers/shared/car.service';
import { Car } from '../drivers/shared/car.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Title } from '@angular/platform-browser';
declare var jsPDF: any; // Important

@Component({
  selector: 'app-carslist',
  templateUrl: './carslist.component.html',
  styleUrls: ['./carslist.component.scss']
})
export class CarslistComponent implements OnInit {
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


  constructor(private db: AngularFireDatabase,private carService: CarService, private titleService: Title) {
    this.carList = db.list('all_cars');
    this.cList = db.list('all_cars');
    this.driversList = db.list('reservations');
    this.drvList = db.list('drivers');
    this.cars = this.carList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.adriversList = db.list('drivers', ref => ref.orderByChild('assigned_car').equalTo('none'));

    this.adrivers = this.adriversList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.notAssigned = db.list('all_cars', ref => ref.orderByChild('car_driver').equalTo('none'));

    this.notAssigned.snapshotChanges().map(list => list.length).subscribe(length => this.length = length);
   }

  ngOnInit() {
    this.setTitle("Lakbay | Cars List");
    const x = this.carService.getData();
    x.snapshotChanges().subscribe(item => {
      this.carlist = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y["$key"] = element.key;
        this.carlist.push(y as Car);
      });
    });

    this.resetForm();
  }

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

    this.undrivers = this.unDriverList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  assignNow(wewa: string, wewb: string, wew: string, wew2: string) {
    this.drvList.update(wewa, { assigned_car: {car_plate_number: wew, car_brand: this.brand, car_model: this.model, car_capacity: this.capacity, car_color: this.color, car_type: wew2} });
    this.drvList.update(wewa, {car_type: wew2});
    this.cList.update(this.keyToPass, { car_driver: wewb });
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
    if (form.value.$key == null)
      this.carService.insertCar(form.value);
    else
      this.carService.updateCar(form.value);
    this.resetForm(form);
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.carService.selectedCar = {
      $key: null,
      car_brand: "",
      car_capacity: 0,
      car_type: "",
      car_color: "",
      car_model: "",
      car_plate_number: ""
    }
  }

  onDelete(form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.carService.deleteDriver(form.value.$key);
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

}
