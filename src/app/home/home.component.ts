import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx'
import { AssignDriverComponent } from '../assign-driver/assign-driver.component';
import { StorageService } from '../storage.service';
import * as firebase from 'firebase';

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
  assigns: Observable<any[]>;
  length: number;
  lcars: number;
  ldrivers: number;
  lpending: number;
  message:string;
  ediUser: string;

  constructor(private route: ActivatedRoute, location: Location, public authService: AuthService, private titleService: Title, private db: AngularFireDatabase, public storage: StorageService) {
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

    this.assigns = db.list('history', ref => ref.orderByChild('timestamp').endAt(1532880205 ).limitToLast(5)).valueChanges();


    this.usersList.snapshotChanges().map(list => list.length).subscribe(length => this.length = length);
    this.carsList.snapshotChanges().map(list => list.length).subscribe(length => this.lcars = length);
    this.driversList.snapshotChanges().map(list => list.length).subscribe(length => this.ldrivers = length);
    this.forApproval.snapshotChanges().map(list => list.length).subscribe(length => this.lpending = length);
   }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Home");
    this.storage.currentMessage.subscribe(message => this.message = message)
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
