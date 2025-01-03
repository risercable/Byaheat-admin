
import {map} from 'rxjs/operators';
import { Injectable, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../auth.service';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
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
      car_brand: car.car_brand,
      car_capacity: car.car_capacity,
      car_type: car.car_type,
      car_color: car.car_color,
      car_driver: "none",
      car_model: car.car_model,
      car_plate_number: car.car_plate_number
    });

    this.incar = true;
  }

  updateCar(carx : Car){
    this.carList.update(carx.$key,{
      car_brand: carx.car_brand,
      car_capacity: carx.car_capacity,
      car_type: carx.car_type,
      car_color: carx.car_color,
      car_model: carx.car_model,
      car_plate_number: carx.car_plate_number
    })

    this.upcar = true;
 }

 deleteDriver(key : string){
  this.carList.remove(key);

  this.delcar = true;
}

}
