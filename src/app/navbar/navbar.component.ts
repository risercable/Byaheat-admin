import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  isIn : boolean = false;
  aha: string;
  aha2: string;
  isaha: boolean = false;
  isaha2: boolean = false;
  getPending: AngularFireList<any[]>;
  lpending: number;
  public loggedIn;
  isUserLoggerdIn$ = new Subject<any>();
  menuState:string = 'out';
  private _opened: boolean = false;
  show:boolean = true;
  css1: boolean = false;

  toggleCollapse() {
    this.show = !this.show
  }

  add1css() {
    this.css1 = !this.css1;
  }

  private _toggleSidebar() {
    this._opened = !this._opened;
  }

  toggleMenu() {
    // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }

  constructor(public authService: AuthService, public storage: StorageService, private db: AngularFireDatabase) {
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
  }

  logout() {
    this.authService.logout();
  }

  isActive(i) {
    return i;
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

  collapseSideBar() {
    $('.sidebarnav').toggleClass('menumin');
  }

}
