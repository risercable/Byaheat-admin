import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Router } from '@angular/router';
import { AddDriverComponent } from './drivers/add-driver/add-driver.component';
import { DriverService } from './drivers/shared/driver.service';
import { Driver } from './drivers/shared/driver.model';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';

@Injectable()
export class AuthService {

  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  private In = new BehaviorSubject<boolean>(false);

  user: Observable<firebase.User>;
  err: String;
  error: boolean;
  isLoggedIn: boolean;
  hUid: string;

  driverList: AngularFireList<any>;
  drivers: Observable<any[]>;
  usersRef: any;

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(public firebaseAuth: AngularFireAuth, private router: Router, db: AngularFireDatabase) {
      this.user = firebaseAuth.authState;
      this.usersRef = firebase.database().ref("drivers");
      this.driverList = db.list('drivers');
    this.drivers = this.driverList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
     }

     ngOnInit() {
      if(this.user)  {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }

     setLoggedIn(value: boolean) {
      // Update login status subject
      this.loggedIn$.next(value);
      this.loggedIn = value;
    }

    get isIn() {
      return this.In.asObservable(); // {2}
    }

     signup(email: string, password: string) {
      this.firebaseAuth
        .auth
        .createUserWithEmailAndPassword(email, password)
        .then(function (userData) {
          this.hUid = userData.uid;
        })
        .catch(err => {
          console.log('Something went wrong:',err.message);
        });
    }

    insertDriver(driver: Driver) {
      this.usersRef.child(this.hUid).set({
        email: driver.email,
        password: driver.password,
        user_firstname : driver.user_firstname,
        user_lastname : driver.user_lastname,
        user_birthdate: driver.user_birthdate,
        user_mobile: driver.user_mobile,
        user_address : driver.user_address,
      });
    }

    login(email: string, password: string){
      this.firebaseAuth
        .auth
        .signInWithEmailAndPassword(email, password)
        .then(value => {
          this.error = false;
          this.err = null;
          this.loggedIn = true;
          this.isLoggedIn = true;
          this.In.next(true);
          this.setLoggedIn(true);
          console.log('Nice, it worked!');
          console.log(this.user);
          this.router.navigate(['']);
        })
        .catch(err => {
          this.error = true;
          this.loggedIn = false;
          this.err = "Login Failed. Invalid email or password";
          console.log('Something went wrong:',err.message);
        });
        this.setLoggedIn(true);
      }

    logout(){
      this.firebaseAuth
        .auth
        .signOut();
        this.isLoggedIn = false;
        this.loggedIn = false;
        this.In.next(false);
        console.log(this.isLoggedIn);
        this.setLoggedIn(false);
        window.location.reload();
    }

    isAuthenticated() {
      return this.loggedIn;
      }

      get authenticated(): boolean {
        return this.firebaseAuth.authState !== null;
      }
    }
