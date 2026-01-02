import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-driver-exist',
  templateUrl: './driver-exist.component.html',
  styleUrls: ['./driver-exist.component.css']
})
export class DriverExistComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor(private appComponent: AppComponent, private authService: AuthService) {
    this.appComponent.showNavbar = false;
   }

  ngOnInit() {
  }

  onLogin() {
    const variables = {
      email: this.email,
      password: this.password
    };

    this.authService.loginUser(variables).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
  }

}
