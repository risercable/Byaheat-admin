
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { Driver } from './driver.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { AddDriverComponent } from '../add-driver/add-driver.component';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class DriverService{
  hemail: string;
  hpassword: string;

  driverList: AngularFireList<any>;
  drivers: Observable<any[]>
  selectedDriver : Driver = new Driver();
  emailadded: boolean = false;
  updriver: boolean = false;
  indriver: boolean = false;
  deldriver: boolean = false;
  selectedRow : Number;
  setClickedRow : Function;

  private apiUrl = 'http://localhost:3000/api/getAllDrivers';

  constructor(public authService: AuthService, db: AngularFireDatabase,  private http: HttpClient) {

    this.updriver = false;
    this.driverList = db.list('drivers');
    this.drivers = this.driverList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
  }

  ngOnInit() {
    if(this.updriver == true) {
      this.updriver = false;
    }
  }

  getData(){
    return this.driverList;
  }

  insertDriver(driver: Driver) {
    this.driverList.push({
      email: driver.email,
      password: driver.password,
      user_firstname : driver.user_firstname,
      user_lastname : driver.user_lastname,
      user_birthdate: driver.user_birthdate,
      user_mobile: driver.user_mobile,
      user_address : driver.user_address,
    });

    // this.authService.signup(driver.email, driver.password);

    this.indriver = true;
  }

  updateDriver(drv : Driver){
    this.driverList.update(drv.$key,{
      user_firstname : drv.user_firstname,
      user_lastname : drv.user_lastname,
      user_birthdate: drv.user_birthdate,
      user_mobile: drv.user_mobile,
      user_address : drv.user_address,
    })

    this.updriver = true;

    setTimeout(() => {
      this.updriver = false;
    }, 8000);

    setTimeout(() => {
      this.setClickedRow = function(index){
        this.selectedRow = null;
    }
    }, 1000);
 }

  updateEmail(drv: Driver) {
    this.driverList.update(drv.$key, {
      email: drv.email,
  password: drv.password,
    })
    // this.authService.signup(drv.email, drv.password);
    // drv.email = drv.password = '';
    //
    // this.emailadded = true;
  }

 deleteDriver(key : string){
   this.driverList.remove(key);

   this.deldriver = true;
 }

  getDrivers() {
    return this.http.get<any>(this.apiUrl);
  }

}
