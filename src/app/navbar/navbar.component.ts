import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Routes, RouterModule } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { StorageService } from '../storage.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})
export class NavbarComponent implements OnInit {
  aha: string;
  aha2: string;
  isaha: boolean = false;
  isaha2: boolean = false;
  getPending: AngularFireList<any[]>;
  lpending: number;
  public loggedIn;
  show:boolean = true;
  css1: boolean = false;
  navbarOpen = false;

  constructor(public authService: AuthService, public storage: StorageService, private db: AngularFireDatabase, public router: Router) {
    this.getPending = db.list('reservations', ref => ref.orderByChild('assign').equalTo('not yet assigned'));
    this.getPending.snapshotChanges().map(list => list.length).subscribe(length => this.lpending = length);
   }

  ngOnInit() {
    this.aha = "!clicked";
    this.isaha = false;

    this.aha2 = "!clicked";
    this.isaha2 = false;

    if(document.querySelector('.dpd-menu .active')) {
      document.querySelector('.aww').classList.add('active');
    }

    firebase.auth().onAuthStateChanged((user) => {
      if(user) {
        this.loggedIn = true;
      } else {
        this.loggedIn = false;
      }
    });

    this.css1 = false;
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  clicked() {
    this.isaha = !this.isaha;
    if(this.isaha2 == true) {
      this.isaha2 = false;
    }
  }

  logout() {
    const that = this;
    firebase.auth().signOut().then(function() {
      alert("successfully signed out!");
        that.router.navigate(['login']);
    }).catch(function(error) {
      // An error happened.
    });
  }
}
