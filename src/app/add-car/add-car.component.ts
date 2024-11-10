import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import { DriverService } from '../drivers/shared/driver.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { CarService } from '../drivers/shared/car.service';
import { Title } from '@angular/platform-browser';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import {MatRadioModule} from '@angular/material/radio';
import {FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import { MatRadioChange } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent implements OnInit {
  carList: AngularFireList<any>;
  toyotaCount: AngularFireList<any>;
  tcount: Observable<any>;
  carID: number;
  carIncr: number = 1;
  getCarID: AngularFireList<any[]>;
  pushTS: AngularFireList<any[]>;
  dateCreated: any;
  up1: any;
  brands = [
    {name: "Toyota"},
    {name: "Mitsubishi"},
    {name: "Honda"},
    {name: "Audi"},
    {name: "BMW"}
  ];
  models = [];

  brand: string;
  selectedBrand: string;

  v: any;
  car_brand: any;
  car_capacity: any;
  car_type: any;
  car_model: any;
  car_plate_number: any;
  car_pnExist: any;
  car_color: any;
  car_brandE = new FormControl('', [Validators.required]);
  car_pnE = new FormControl('', [Validators.required, Validators.minLength(8)]);
  car_colorE = new FormControl('', [Validators.required]);
  car_capacityE = new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]);

  getErrorMessage() {
    return this.car_colorE.hasError('required') ? 'You must enter a value' :
      this.car_colorE.hasError('pattern') ? 'Not a valid color' :
        '';
  }

  getErrorMessage2() {
    return this.car_capacityE.hasError('required') ? 'You must select one' :
      '';
  }
  getErrorMessage3() {
    return this.car_brandE.hasError('required') ? 'You must select one' :
      '';
  }
  getErrorMessage4() {
    return this.car_pnE.hasError('required') ? 'You must enter a value' :
      this.car_pnE.hasError('minLength') ? 'Enter valid details' :
      '';
  }
  openSnackBar() {
    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: 2000,
    });
  }

  constructor(public carService : CarService, private titleService: Title, private db: AngularFireDatabase, public snackBar: MatSnackBar, private changeDetector: ChangeDetectorRef, public dialog: MatDialog) {

    // this.getCarID = db.list('cars_list', ref => ref.orderByChild('car'))
    this.carList = db.list('all_cars');

    this.pushTS = db.list('cars_list');

    this.dateCreated = firebase.database['ServerValue']['TIMESTAMP'];

    this.toyotaCount = db.list('/all_cars', ref => ref.orderByChild('car_brand').equalTo('Toyota'));

    this.tcount = this.toyotaCount.snapshotChanges().map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(PlateExistExampleDialog, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

    this.resetForm();
  }

  ngAfterViewChecked(){
    this.changeDetector.detectChanges();
  }

  onSelect(val: any) {
    this.selectedBrand = val.value;

    console.log(val.value);

    if(this.selectedBrand == "Toyota") {
      this.models = [
        {name: "Vios"},
        {name: "Corolla Altis"},
        {name: "Avanza"}
      ]
    } else if (this.selectedBrand == "Mitsubishi") {
      this.models = [
        {name: "Adventure"} ,
        {name: "Mirage G4"} ,
        {name: "l300"}
      ]
    } else if(this.selectedBrand == "Honda") {
      this.models = [
        {name: "Civic"},
        {name: "CRV"}
      ]
    } else if(this.selectedBrand == "Audi") {
      this.models = [
        {name: "A4"},
        {name: "A5"},
        {name: "A6"}
      ]
    } else if(this.selectedBrand == "BMW") {
      this.models = [
        {name: "BMW 6 Series Gran Coupé"},
        {name: "BMW 7 Series Sedan"}
      ]
    }
  }
  onRadioClick(event: MatRadioChange) {
    this.v = event.value;
    if(this.v == "single") {
      this.car_capacity = 3;
    } else if(this.v == "family") {
      this.car_capacity = 6;
    } else if(this.v == "barkada") {
      this.car_capacity = 9;
    } else if(this.v == "premium") {
      this.car_capacity = 4;
    } else {
      this.car_capacity = 0;
    }
    console.log(event.value);
  }

  ngOnInit() {
    this.resetForm();
    this.setTitle("Lakbay | Add Car");
    this.carID = 110;
    this.carID = this.carID + this.carIncr;

    // this.carService.selectedCar = {
    //   $key: null,
    //   car_name: '',
    //   car_id: 1111111,
    //   car_capacity: 9,
    //   car_availability: 'Pak',
    //   car_datecreated: this.dateCreated
    // }

    this.car_capacity = '0';
  }

  onSubmit(form: NgForm) {
    const dbRef = this.db.database.ref();
    dbRef.child('all_cars').orderByChild('car_plate_number').equalTo(this.car_plate_number).once('value', snapshot => {
      if (snapshot.exists()) {
        this.openDialog();
      } else {
        this.carList.push({
          car_brand: this.car_brand,
          car_capacity: this.car_capacity,
          car_type: this.car_type,
          car_color: this.car_color,
          car_driver: "none",
          car_model: this.car_model,
          car_plate_number: this.car_plate_number
        });

        this.resetForm(form);
        this.openSnackBar();
      }
    });
  }
  resetForm(form?: NgForm) {
    this.car_plate_number = '';
    this.car_brand = '';
    this.car_model = '';
    this.car_color = '';
    this.car_type = '';
    this.car_capacity = 0;
    this.selectedBrand = '';
    this.models = [];
    this.v = '';

  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class PizzaPartyComponent {}

@Component({
  selector: 'plate_number_exist_dialog',
  templateUrl: 'plate_number_exist_dialog.html',
})
export class PlateExistExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<PlateExistExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.closinggg();
  }

  closinggg() {
    setTimeout(() => {
      this.dialogRef.close();
    }, 6000);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
