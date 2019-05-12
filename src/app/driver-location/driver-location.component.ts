import { Component, OnInit } from '@angular/core';
import {GeofireService} from "../geofire.service";
import {AngularFireDatabase} from "angularfire2/database";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-driver-location',
  templateUrl: './driver-location.component.html',
  styleUrls: ['./driver-location.component.scss']
})
export class DriverLocationComponent implements OnInit {
  dbRef2: any;
  key: any;
  lat: number;
  lng: number;

  markers1: any;

  constructor(private route: ActivatedRoute, private geo: GeofireService, private db: AngularFireDatabase) { }

  ngOnInit() {
    this.getUserLocation();

    this.key = this.route.snapshot.paramMap.get("$key").toString();

    this.dbRef2 = this.db.list('drivers/' + this.key);

    this.geo.hits.subscribe(hits => this.markers1 = hits);
  }

  private getUserLocation() {
    /// locate the user

    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;

        this.geo.getLocations(5000, [this.lat, this.lng], this.key);
      });
    }
  }

}
