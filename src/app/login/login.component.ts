import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {Observable } from 'rxjs/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  link: any;
  showLost: boolean;

  constructor(public authService: AuthService, private route: ActivatedRoute, private router: Router, private titleService: Title) {

   }

  ngOnInit() {

    this.titleService.setTitle("Lakbay | Login");

    if(this.authService.firebaseAuth.authState) {
      this.router.dispose;
      setTimeout((router) => {
        this.router.navigate(['home']);
      }, 5000);
    }

    this.showLost = false;
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';
  }

  login() {
    this.authService.login(this.email, this.password);
    this.email = this.password = '';
  }

  logout() {
    this.authService.logout();
  }
}
