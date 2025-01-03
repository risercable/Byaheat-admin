import { Component, OnInit } from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
  selector: 'app-driver-exist',
  templateUrl: './driver-exist.component.html',
  styleUrls: ['./driver-exist.component.css']
})
export class DriverExistComponent implements OnInit {

  constructor(private appComponent: AppComponent,) {
    this.appComponent.showNavbar = false;
   }

  ngOnInit() {
  }

}
