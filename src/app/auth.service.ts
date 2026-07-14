
import {map, switchMap} from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { AngularFireAuth } from 'angularfire2/auth';





import { Router } from '@angular/router';
import { AddDriverComponent } from './drivers/add-driver/add-driver.component';
import { DriverService } from './drivers/shared/driver.service';
import { Driver } from './drivers/shared/driver.model';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import {HttpClient} from '@angular/common/http';
import { GlobalDataService } from './global-data.service';

@Injectable()
export class AuthService {

  public loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);
  private In = new BehaviorSubject<boolean>(false);

  private baseUrl = 'http://localhost:3000/api'; // Backend API endpoint

  user: Observable<firebase.User>;
  err: String;
  error: boolean;
  isLoggedIn: boolean;
  hUid: string;
  isAdmin: boolean;
  checkThis: any;
  username: string;
  password: string;

  driverList: AngularFireList<any>;
  drivers: Observable<any[]>;
  usersRef: any;
  user$: Observable<AppUser>;

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get currentUserValue(): any | null {
    return this.currentUserSubject.value;
  }

    // store the URL so we can redirect after logging in
    redirectUrl: string;

    constructor(
      public firebaseAuth: AngularFireAuth,
      private router: Router,
      public db: AngularFireDatabase,
      private http: HttpClient,
      private globalDataService: GlobalDataService
    ) {
      this.user = firebaseAuth.authState;
      this.usersRef = firebase.database().ref('drivers');
      this.driverList = db.list('drivers');
      this.drivers = this.driverList.snapshotChanges().pipe(map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
      }));

      this.user$ = firebaseAuth.authState
        .pipe(switchMap(user_ => {
          if (user_) {
            return this.db.object(`admins`).valueChanges();
          } else {
            return of(null);
          }
        }));

      this.afAuth.authState.subscribe(user => {
        if (user) {
          // fetch role/profile, then push into currentUserSubject
        } else {
          this.currentUserSubject.next(null);
        }
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

    //  signup(email: string, password: string) {
    //   this.firebaseAuth
    //     .auth
    //     .createUserWithEmailAndPassword(email, password)
    //     .then(function (userData) {
    //       this.hUid = userData.uid;
    //     })
    //     .catch(err => {
    //       console.log('Something went wrong:',err.message);
    //     });
    // }

    insertDriver(driver: Driver) {
      this.usersRef.child(this.hUid).set({
        email: driver.email,
        password: driver.password,
        user_firstname : driver.firstName,
        user_lastname : driver.lastName,
        user_birthdate: driver.birthDate,
        user_mobile: driver.mobile
      });
    }

    login(email: string, password: string) {
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

          let uid = value.user.uid;
          console.log(uid);
          this.sAdmin(uid);
          // this.router.navigate(['home']);
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
        this.globalDataService.clearUser();
        window.location.reload();
    }

    isAuthenticated() {
      return this.loggedIn;
      }

  get authenticated(): boolean {
    return this.firebaseAuth.authState !== null;
  }

  getUserRole(uid: string): Observable<string> {
    try {
      const payload = {  uid };
      return this.http.post<any>(`${this.baseUrl}/user/getRole`, payload);
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }

  private sAdmin(uid: string) {
    return firebase.database().ref('users/' + uid + '/roles').once('value').then(snapshot => {
      let adminSiya = snapshot.val().admin;

      console.log("snap val: ", adminSiya);

      if(adminSiya !== true) {
        this.firebaseAuth
          .auth
          .signOut();

        console.log("tama pero di ka admin");
        this.router.navigate(['login']);
      } else {
        console.log("tama tsaka admin ka!!!");
        this.router.navigate(['home']);
      }
    });
  }

  // Call the backend to register the user
  registerUser(objectVar): Observable<any> {
    const { email, password, firstName, lastName } = objectVar;
    const payload = {  email, password, firstName, lastName };
    return this.http.post<any>(`${this.baseUrl}/drivernew`, payload);
  }

  loginUser(objectVar): Observable<any> {
    const { email, password } = objectVar;
    const payload = {  email, password };

    
    const response = this.http.post<any>(`${this.baseUrl}/driver/login`, payload);

    const { driverData: data }  = response

    return response;
  }

  adminLogin(objectVar): Observable<any> {
    const { email, password } = objectVar;
    const payload = {  email, password };
    return this.http.post<any>(`${this.baseUrl}/login`, payload);
  }

  adminLogout(){
    const { user } = this.globalDataService.getUser();

    if (user) {
      // Call the backend to revoke session
      this.http.post(`${this.baseUrl}/logout`, { uid: user.uid }).subscribe(
        () => {
          firebase.auth().signOut().then(() => {
            this.globalDataService.clearUser();
            sessionStorage.clear(); // Clear session storage
            this.router.navigate(['login']);
            alert('Successfully signed out!');
          });
        },
        (error) => {
          console.error('Error during logout:', error);
        }
      );
    }
  }
}

export interface AppUser {
  name: string;
  email: string;
  isAdmin: boolean;
}
