import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isIn : boolean = false;
  aha: string;
  aha2: string;
  isaha: boolean = false;
  isaha2: boolean = false;
  getPending: AngularFireList<any[]>;
  lpending: number;

  constructor(public authService: AuthService, public storage: StorageService, private db: AngularFireDatabase) {
    this.getPending = db.list('reservations', ref => ref.orderByChild('assign').equalTo('not yet assigned'));
    this.getPending.snapshotChanges().map(list => list.length).subscribe(length => this.lpending = length);
   }

  ngOnInit() {
    this.aha = "!clicked";
    this.isaha = false;

    this.aha2 = "!clicked";
    this.isaha2 = false;
  }

  logout() {
    this.authService.logout();
  }

  newAll() {
    this.storage.changeMessage("showAll");
  }

  toggleState() { // click handler
    let bool = this.isIn;
    this.isIn = bool === false ? true : false;
  }

  clicked() {
    this.isaha = !this.isaha;
    if(this.isaha2 == true) {
      this.isaha2 = false;
    }
  }

  clicked2() {
    this.isaha2 = !this.isaha2;
    if(this.isaha == true) {
      this.isaha = false;
    }
  }

}
