import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';
import { AuthService } from '../auth.service';
import { MyAuthService } from '../sql-services/my-auth-service.service';

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
  licenseFile: File | null = null;
  registrationFile: File | null = null;
  submitAttempted: boolean = false;

  constructor(private appComponent: AppComponent, private authService: AuthService, private myAuthService: MyAuthService) {
    this.appComponent.showNavbar = false;
  }

  ngOnInit() {
  }

  hideWelcome(value = true) {
    this.isLoginOrRegister = false;
  }

  onFileChange(event: Event, type: 'license' | 'registration') {
    const input = event.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;

    if (type === 'license') {
      this.licenseFile = file;
    } else {
      this.registrationFile = file;
    }
  }

  async onRegister () {
    this.submitAttempted = true;

    if (!this.licenseFile || !this.registrationFile) {
      this.errorMessage = 'Please upload both your driver\'s license and vehicle registration.';
      return;
    }

    let variables = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      salt: ''
    };

    variables.password = this.password;
    variables.salt = '';

    this.myAuthService.registerUser(variables).subscribe(
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
