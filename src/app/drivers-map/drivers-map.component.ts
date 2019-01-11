import { Component, OnInit } from '@angular/core';
import {GeofireService} from "../geofire.service";
import {GeoFire} from "geofire";
import {AngularFireDatabase} from "angularfire2/database";
import {BehaviorSubject} from "../../../node_modules/rxjs/BehaviorSubject";

@Component({
  selector: 'app-drivers-map',
  templateUrl: './drivers-map.component.html',
  styleUrls: ['./drivers-map.component.scss']
})
export class DriversMapComponent implements OnInit {
  lat: number;
  lng: number;

  public markers: any;
  smarkval: boolean = false;
  smarknulldiv: boolean = false;
  smarknull: string;

  dbRef2: any;
  geoFire2: any;

  hits = new BehaviorSubject([]);

  constructor(private geo: GeofireService, private db: AngularFireDatabase) {
    this.dbRef2 = this.db.list('/drivers_location/');
    this.geoFire2 = new GeoFire(this.dbRef2.query.ref);
  }

  ngOnInit() {
    this.getUserLocation();
    this.dbRef2 = this.db.list('drivers_location/');

    this.geo.hits.subscribe(hits => this.markers = hits);
  }

  smarkset(x) {
    this.smarkval = x;
  }

  searchsmark(xval) {
    // this.dbRef2 = this.db.list('drivers_available/');
    // this.geoFire2 = new GeoFire(this.dbRef2.query.ref);
    //
    // this.geoFire2.get('jrOCcZbehfUmSnf0mTiPLIhVsFn2').then((location) => {
    //   if (location === null) {
    //     console.log("Provided key is not in GeoFire");
    //   }
    //   else {
    //     console.log("Provided key has a location of " + location);
    //     this.showto(location);
    //   }
    // }, function(error) {
    //   console.log("Error: " + error);
    // })
    // if(this.geo.hits2.subscribe(hits2 => this.markers = hits2) == null) {
    //   this.smarkval = false;
    //   this.smarknulldiv = true;
    //   this.smarknull = "Can't find any matching driver!";
    // }
  }

  showto(l1: any) {
    let center: Array<number> = l1.toString().split(',');
    console.log("center is: " +center[0]);
    this.lat = (<number>center[0]);
    this.lng = (<number>center[1]);

    console.log("lat is: "+center[0]);
    this.geo.getLocations(5, [this.lat, this.lng]);
  }

  private getUserLocation() {
    /// locate the user

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.geo.getLocations(5000, [this.lat, this.lng]);
      });
    }
  }
}
