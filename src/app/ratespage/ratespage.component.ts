import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database";
import * as firebase from "firebase";
import {Perclient} from "../account/account.component";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
  selector: 'app-ratespage',
  templateUrl: './ratespage.component.html',
  styleUrls: ['./ratespage.component.scss']
})
export class RatespageComponent implements OnInit {
  perRate: PerRatings[];
  drKeys: number[];
  noRecords: boolean;
  driverRatesCols = ['driverKey', 'driver_fullname', 'rating', 'average_rating'];
  driverRatesSource = new MatTableDataSource(this.perRate);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.driverRatesSource.filter = filterValue;

    this.noRecords = this.driverRatesSource.filteredData.length == 0;
  }

  constructor(public db: AngularFireDatabase) { }

  ngOnInit() {
    const drhistoryRef = firebase.database().ref().child('drivers');
    const historyRateRef = firebase.database().ref().child('history');

    let historyRef = this.db.list('history');

    this.perRate = [];
    this.drKeys = [];
    let getRates = [];
    let json: any = [];
    drhistoryRef.on('child_added', (snaps) => {
      console.log(snaps.key);
      let skeys = snaps.key;
      historyRef.query.orderByChild('driver').equalTo(skeys).on('value', result => {
        console.log('result: ' , result.key, result.val());
        // json = result.toJSON();
        // json["$key"] = snaps.key;

        result.forEach(element => {
          json = element.toJSON();
          json["$key"] = snaps.key;
          json["total_rating"] += element.val().rating;

          getRates.push(json);

          // this.perRate.push(json as PerRatings);
        });
        historyRateRef.child(snaps.key).once('value', result => {
          console.log('historRef: ', result.val());
        })
      });
      // snaps.child('history').forEach(snapshot => {
      //   console.log(snapshot.key, snapshot.val());
      //   drKeys.push(snapshot.key);
      //   this.perRate['$key'] = snapshot.key;
        // historyRateRef.child(snapshot.key).once('value', result => {
        //   console.log()
        // })
      // });
      // historyRateRef.child(snaps.val().history).once('value', isResult => {
      //   console.log("Ratings: ", isResult.val());
      // })

      // console.log('perRate: ' , this.perRate);
      this.driverRatesSource = new MatTableDataSource(getRates);
      this.driverRatesSource.sort = this.sort;
      this.driverRatesSource.paginator = this.paginator;
    });
    console.log("PerRatings: " , this.perRate);
    console.log("Results: ", getRates)
  }

}

export interface PerRatings {
  $key: string;
  driver_fullname: string;
  rating: number;
  average_rating: number;
}
