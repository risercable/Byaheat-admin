
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { StorageService } from '../storage.service';
import * as firebase from 'firebase';
import { GlobalDataService } from '../global-data.service';
import {CarService} from '../shared/car.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  location: Location;
  usersList: AngularFireList<any>;
  carsList: AngularFireList<any>;
  driversList: AngularFireList<any>;
  forApproval: AngularFireList<any>;
  getAssigned: AngularFireList<any[]>;
  driverRate: AngularFireList<any[]>;
  assigns: Observable<any[]>;
  mostrates: Observable<any[]>;
  length: number;
  lcars: number;
  ldrivers: number;
  lpending: number;
  message:string;
  ediUser: string;
  workings: AngularFireList<any>;
  today: number = Date.now();
  lworkings: number;
  timesx: number[];
  enDate: string[];
  nPrice: number[];
  chartBarData: any[] = [];

  public graph = {
    data: [
      { x: this.enDate, y: this.nPrice, type: 'bar' },
    ],
    layout: {width: 600, height: 420, title: 'A Fancy Plot'}
  };

  constructor(
    private route: ActivatedRoute,
    location: Location,
    public authService: AuthService,
    private titleService: Title,
    private db: AngularFireDatabase,
    public storage: StorageService,
    public router: Router,
    private globalDataService: GlobalDataService,
    private carService: CarService,
  ) {
    var user = firebase.auth().currentUser;
    if(user!=null) {
      this.ediUser = user.displayName;
    } else {
      this.ediUser = 'null nga';
    }
    this.location = location;
    this.usersList = db.list('clients');
    this.carsList = db.list('all_cars');
    this.driversList = db.list('drivers');
    this.forApproval = db.list('pending');
    this.getAssigned = db.list('history');
    this.workings = db.list('drivers_working');

    let date = new Date(this.today);

    let nowis = date.getTime();

    this.assigns = db.list('history', ref => ref.orderByChild('timestamp').endAt(nowis ).limitToLast(5)).valueChanges();

    this.mostrates = db.list('drivers', ref => ref.orderByChild('total_ratingpo').startAt(1)).valueChanges();

    this.workings.snapshotChanges().pipe(map(list => list.length)).subscribe(length => this.lworkings = length);

    this.usersList.snapshotChanges().pipe(map(list => list.length)).subscribe(length => this.length = length);
    this.carService.getAll().subscribe(cars => this.lcars = cars.length);
    this.driversList.snapshotChanges().pipe(map(list => list.length)).subscribe(length => this.ldrivers = length);
    this.forApproval.snapshotChanges().pipe(map(list => list.length)).subscribe(length => this.lpending = length);

    let data = firebase.database().ref('sales').child('cash');

    this.enDate = [];
    this.nPrice = [];

    let chartAreaData = [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75,  b: 65 },
      { y: '2008', a: 50,  b: 40 },
      { y: '2009', a: 75,  b: 65 },
      { y: '2010', a: 50,  b: 40 },
      { y: '2011', a: 75,  b: 65 },
      { y: '2012', a: 100, b: 90 }
    ];

    this.chartBarData = chartAreaData;

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    data.on('value', (item) => {
      item.forEach(element => {

        let toDate = new Date(element.val().en_date);
        let toPrice = element.val().price;

        let month = monthNames[toDate.getMonth()];
        let day = toDate.getDate();
        console.log("dates: ", month + ' ' + day);
        this.enDate.push(month + day);

        this.nPrice.push(toPrice);
        // this.timesx.push(element.val().timestamp * 1000);
      })
    })
   }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Home");
    this.storage.currentMessage.subscribe(message => this.message = message);

    // let connectedRef = firebase.database().ref(".info/connected");
    // connectedRef.on("value", (snap) => {
    //   if (snap.val() === true) {
    //     // alert("connected");
    //   } else {
    //     alert("not connected");
    //     this.router.navigate(['/not-connected']);
    //   }
    // });

    const appigo = this.globalDataService.getUser();

    console.log(appigo);
  }

  redirectNC() {

  }

  newMessage() {
    this.storage.changeMessage("showPending")
  }

  newAssigned() {
    this.storage.changeMessage("showAssigned");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  showPending() {
    this.storage.getPendings("name");
  }

}
