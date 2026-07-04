
import {map} from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../auth.service';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Car } from './car.model';
import * as firebase from 'firebase';

@Injectable()
export class CarService implements OnInit{

  carList: AngularFireList<any>;
  cars: Observable<any>;
  selectedCar: Car = new Car();
  upcar: boolean = false;
  incar: boolean = false;
  delcar: boolean = false;
  carCreated: Observable<any>;
  up1: any;


  constructor(public authService: AuthService, db: AngularFireDatabase) {
    this.carList = db.list('all_cars');
    this.cars = this.carList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.up1 = firebase.database.ServerValue.TIMESTAMP;
   }

   ngOnInit() {
     if(this.incar == true) {
      this.incar = false;
     }
   }

   getData(){
    return this.carList;
  }

  insertCar(car: Car) {
    this.carList.push({
      carBrand: car.carBrand,
      carCapacity: car.carCapacity,
      carType: car.carType,
      carColor: car.carColor,
      car_driver: "none",
      carModel: car.carModel,
      carPlateNumber: car.carPlateNumber
    });

    this.incar = true;
  }

  updateCar(carx : Car){
    // this.carList.update(carx.id,{
    //   carBrand: carx.carBrand,
    //   carCapacity: carx.carCapacity,
    //   carType: carx.carType,
    //   carColor: carx.carColor,
    //   carModel: carx.carModel,
    //   carPlateNumber: carx.carPlateNumber
    // })

    this.upcar = true;
 }

 deleteDriver(key : string){
  // this.carList.remove(key);

  this.delcar = true;
}

}
