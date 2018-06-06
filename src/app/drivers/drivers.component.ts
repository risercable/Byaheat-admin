import { Component, OnInit } from '@angular/core';
import { DriverService } from './shared/driver.service';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
  providers :[DriverService]
})
export class DriversComponent implements OnInit {

  constructor(private driverService : DriverService) { }

  ngOnInit() {
  }

}
