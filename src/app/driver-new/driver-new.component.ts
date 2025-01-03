import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-driver-new',
  templateUrl: './driver-new.component.html',
  styleUrls: ['./driver-new.component.css']
})
export class DriverNewComponent implements OnInit {
  isLoginOrRegister: boolean = true;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(private appComponent: AppComponent, private authService: AuthService) {
    this.appComponent.showNavbar = false;
  }

  ngOnInit() {
  }

  hideWelcome(value = true) {
    this.isLoginOrRegister = false;
  }

  onRegister() {
    const variables = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName
    };

    this.authService.registerUser(variables).subscribe(
      (response) => {
        this.successMessage = response.message;
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = error.error.message || 'Registration failed';
        this.successMessage = '';
      }
    );
  }

}
