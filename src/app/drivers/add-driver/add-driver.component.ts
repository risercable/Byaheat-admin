import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DriverService } from '../shared/driver.service';
import { AuthService } from '../../auth.service';
import { Title } from '@angular/platform-browser';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, Validators} from '@angular/forms';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-add-driver',
  templateUrl: './add-driver.component.html',
  styleUrls: ['./add-driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  // email: string;
  // password: string;
  errorDate: boolean;
  today = Date.now();
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);

  matcher = new MyErrorStateMatcher();

  constructor(public authService: AuthService, private driverService : DriverService, private titleService: Title) { }

  ngOnInit() {
    this.resetForm();
    this.setTitle("Lakbay | Add Driver");
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  onSubmit(form: NgForm) {
    if (form.value.$key == null) {
      // this.driverService.insertDriver(form.value);
      this.authService.insertDriver(form.value);
    }

    else
      this.driverService.updateDriver(form.value);
    this.resetForm(form);
  }

  // signup(email: string, password: string) {
  //   this.authService.signup(email, password);
  //   email = password = '';
  // }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();
    this.driverService.selectedDriver = {
      id: null,
      email: '',
      password: '',
      firstName : '',
      lastName : '',
      birthDate: '',
      mobile: 0,
    }
  }

  onDelete(form: NgForm) {
    if (confirm('Are you sure to delete this record ?') == true) {
      this.driverService.deleteDriver(form.value.$key);
      this.resetForm(form);
    }
  }

  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return this.errorDate = false;
    }
    return this.errorDate = true;
}

}
