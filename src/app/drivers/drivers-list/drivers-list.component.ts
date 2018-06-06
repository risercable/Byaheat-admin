import { Component, OnInit } from '@angular/core';
import { DriverService } from '../shared/driver.service';
import { AngularFireList } from 'angularfire2/database';
import { Driver } from '../shared/driver.model';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-drivers-list',
  templateUrl: './drivers-list.component.html',
  styleUrls: ['./drivers-list.component.scss']
})
export class DriversListComponent implements OnInit {
  driverlist: Driver[];

  constructor(private driverService : DriverService, private titleService: Title) { }

  ngOnInit() {

    this.titleService.setTitle("Lakbay | Drivers List");

    const x = this.driverService.getData();
    x.snapshotChanges().subscribe(item => {
      this.driverlist = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y["$key"] = element.key;
        this.driverlist.push(y as Driver);
      });
    });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onItemClick(drv : Driver){
    this.driverService.selectedDriver = Object.assign({},drv);
  }

}
