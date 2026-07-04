import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {Observable } from 'rxjs/internal/Observable';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { Title } from '@angular/platform-browser';
import {AngularFireDatabase} from "angularfire2/database";
import {AppComponent} from '../app.component';
import { GlobalDataService } from '../global-data.service';

@Component({
  selector: 'app-login',
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  show: boolean;
  link: any;
  showLost: boolean;
  items: Observable<any[]>;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    public afAuth: AngularFireAuth,
    db: AngularFireDatabase,
    private appComponent: AppComponent,
    private globalDataService: GlobalDataService
  ) {
    this.show = false;

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

  passwordX() {
    this.show = !this.show;
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // signup() {
  //   this.authService.signup(this.email, this.password);
  //   this.email = this.password = '';
  // }

  login() {
    const variables = {
      email: this.email,
      password: this.password
    };

    this.authService.adminLogin(variables).subscribe(
      (response) => {
        this.globalDataService.setUser(response);
      },
      (error) => {
      }
    );

    this.email = this.password = '';
    this.appComponent.showNavbar = true;
  }

  logout() {
    // this.authService.adminLogout();
  }

  toRegister() {
    this.router.dispose();
    this.router.navigate(['signup']);
  }
}
