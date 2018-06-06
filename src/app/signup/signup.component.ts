import { Component, OnInit } from '@angular/core';
import { AngularFireObject, AngularFireList } from 'angularfire2/database/interfaces';
import { AuthService } from '../auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  email: string;
  password: string;
  name: AngularFireObject<any>;
  driver: AngularFireList<any>;

  constructor(public authService: AuthService, af: AngularFireDatabase, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Signup");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  signup() {
    this.authService.signup(this.email, this.password);
    this.email = this.password = '';

    this.driver.push(this.name);
    this.driver.push(this.email);
  }

}
