import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import {AuthService} from '../auth.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  constructor(public authService: AuthService, public afA: AngularFireAuth, public router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.afA.auth.signOut().then(() => {
      this.router.navigate(['login']);
   });
  }

}
