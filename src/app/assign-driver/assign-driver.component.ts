
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { Observable , } from 'rxjs/internal/Observable';

import { AngularFireAction } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { Router } from '@angular/router/src/router';
import { Title } from '@angular/platform-browser';
import { StorageService } from '../storage.service';
@Component({
  selector: 'app-assign-driver',
  templateUrl: './assign-driver.component.html',
  styleUrls: ['./assign-driver.component.scss']
})
export class AssignDriverComponent implements OnInit{
  driversList: AngularFireList<any>;
  driversNow: AngularFireList<any>;
  avdrivers: Observable<any[]>;
  reservationsList: AngularFireList<any>;
  pendingsList: AngularFireList<any>;
  assignsList: AngularFireList<any>;
  reserves: Observable<any[]>;
  pendings: Observable<any[]>;
  assigns: Observable<any[]>;
  selections: Observable<any[]>;
  keyToPass: string;
  nameToPass: string;
  nameToSearch: string;
  wew: string;
  aha: string;
  aha2: string;
  aha3: string;
  message:string;
  lpending: number;


  constructor(db: AngularFireDatabase, private titleService: Title, public storage: StorageService) {
    this.reservationsList = db.list('reservations');
    this.pendingsList = db.list('reservations', ref => ref.orderByChild('assign').equalTo('not yet assigned'));
    this.assignsList = db.list('reservations', ref => ref.orderByChild('assigned').equalTo('true'));

    this.reserves = this.reservationsList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.pendings = this.pendingsList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.assigns = this.assignsList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.driversNow = db.list('drivers');
    this.driversList = db.list('drivers', ref => ref.orderByChild('status').equalTo('available'));

    this.avdrivers = this.driversList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.selections = this.driversNow.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));

    this.pendingsList.snapshotChanges().pipe(map(list => list.length)).subscribe(length => this.lpending = length);

  }

  ngOnInit() {
    this.setTitle("Lakbay | Assign Drivers");
    this.storage.currentMessage.subscribe(message => this.message = message);
    this.wew = this.message;
    if(this.wew == "showPending") {
      this.aha3 = "clicked";
    } else if(this.wew == "showAssigned") {
      this.aha = "clicked";
    }
    // this.aha = "!clicked";
    // this.aha2 = "clicked";
    // this.aha3 = "!clicked";
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  passKey(key: string){
    this.keyToPass = key;
  }

  selectedDriver(name: string) {
    this.nameToPass = name;
  }

  assignNow(name: string){
    this.reservationsList.update(this.keyToPass, { assign: name });
  }

  selected(key: string) {
    this.driversNow.update(key, { status: 'not available' });
  }

  onSubmit(assignName: string, db: AngularFireDatabase) {
    this.reservationsList.update(this.keyToPass, { assign: assignName });

    this.nameToSearch = assignName;


  }

  changeAll() {
    this.wew = "showAll";
  }

  changePending() {
    this.wew = "showPending";
  }

  changeAssigned() {
    this.wew = "showAssigned";
  }

  clicked() {
    this.aha = "clicked";
    this.aha2 = "!clicked";
    this.aha3 = "!clicked";
  }

  clicked2() {
    this.aha = "!clicked";
    this.aha2 = "clicked";
    this.aha3 = "!clicked";
  }

  clicked3() {
    this.aha = "!clicked";
    this.aha2 = "!clicked";
    this.aha3 = "clicked";
  }

}
