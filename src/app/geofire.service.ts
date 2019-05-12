import { Injectable } from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";

import {GeoFire} from 'geofire';

import { BehaviorSubject } from "rxjs/BehaviorSubject";


@Injectable()
export class GeofireService {

  dbRef: any;
  geoFire: any;
  dbRef2: any;
  geoFire2: any;

  hits = new BehaviorSubject([]);
  hits2 = new BehaviorSubject([]);

  constructor(private db: AngularFireDatabase) {

    //reference database location for GeoFire
  }

  setLocation(key: string, coords: Array<number>) {
    this.geoFire.set(key, coords)
      .then(_ => console.log('location updated'))
      .catch(err => console.log(err))
  }

  /// Queries database for nearby locations, then maps to BehaviorSubject
  getLocations(radius: number, coords: Array<number>, key: string) {

    this.dbRef = this.db.list('/drivers/' + key + '/currently/');
    this.geoFire = new GeoFire(this.dbRef.query.ref);

    this.geoFire.query({
      center: coords,
      radius: radius
    })
      .on('key_entered', (key, location, distance) => {
        let hit = {
          location: location,
          distance: distance
        };

        let currentHits = this.hits.value;
        currentHits.splice(0);
        currentHits.push(hit);
        this.hits.next(currentHits);
      })
  }

  getPerDriverLocations(radius: number, coords: Array<number>, xval: any) {
    this.dbRef2 = this.db.list('drivers_available/');
    this.geoFire2 = new GeoFire(this.dbRef2.query.ref);

    this.geoFire2.get(xval).then(function(location) {
      if (location === null) {
        console.log("Provided key is not in GeoFire");
      }
      else {
        console.log("Provided key has a location of " + location);
        let hit = {
          location: location
      };
      }
    }, function(error) {
      console.log("Error: " + error);
    })
  }

}
