import { Component, OnInit } from '@angular/core';
import { AngularFireObject, AngularFireList } from 'angularfire2/database/interfaces';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Title } from '@angular/platform-browser';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import * as firebase from "firebase";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  hide = true;
  name: AngularFireObject<any>;
  driver: AngularFireList<any>;
  hiddenFN: boolean = true;

  userEmail = new FormControl('', [Validators.required, Validators.email]);
  userPassword = new FormControl('', [Validators.required, Validators.minLength(8)]);
  fullname: string = '';

  getErrorMessage() {
    return this.userEmail.hasError('required') ? 'You must enter a value' :
      this.userEmail.hasError('email') ? 'Not a valid email' :
        '';
  }

  getPasswordErrorMessage() {
    return this.userPassword.hasError('required') ? 'You must enter a value' :
      this.userPassword.hasError('minlength') ? 'please enter a minimum of 8 characters' :
        '';
  }

  constructor(public authService: AuthService, af: AngularFireDatabase, private titleService: Title, public router: Router) { }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Signup");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  signup(fnpo) {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
      .then(function (success) {
        alert('Success!');

        this.router.navigate(['login']);
      })
      .catch(function(error) {
        alert('error: ' + error.code);
      });
  }

  toFullname(te, tp, tfn) {
    this.hiddenFN = false;

    let user = firebase.auth().currentUser;
    let uid;
    uid = user.uid;

    let xdb = firebase.database().ref('admins');

    firebase.database().ref('admins/' + uid).set({full_name: tfn, email: te, password: tp});
  }


  // signup() {
  //   this.authService.signup(this.email, this.password);
  //   this.email = this.password = '';
  //
  //   this.driver.push(this.name);
  //   this.driver.push(this.email);
  // }

}
