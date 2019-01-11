import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import * as firebase from "firebase";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatSnackBar,
  MatSort,
  MatTableDataSource
} from "@angular/material";
import {Perclient} from "../account/account.component";
import {AngularFireDatabase} from "angularfire2/database";
import {DialogOverviewExampleDialog} from "../drivers-table/drivers-table.component";

@Component({
  selector: 'app-dispatching',
  templateUrl: './dispatching.component.html',
  styleUrls: ['./dispatching.component.scss']
})
export class DispatchingComponent implements OnInit {
  xD: string;
  dispatchCols = ['full_name', 'car_plate_number', 'time_in', 'time_out', 'action'];
  itemDPs: PerDisP[];
  dispatchSource = new MatTableDataSource(this.itemDPs);
  noRecords: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  constructor(public db: AngularFireDatabase, public dialog: MatDialog) {
    let data = firebase.database().ref('dispatches');
    this.itemDPs = [];

    data.on('value', item => {

      item.forEach(element => {
        let json = element.val();
            json["$key"] = element.key;
            // this.itemList.push(json as Item);
            this.itemDPs.push(json as PerDisP);
            // this.xD.push(json);
      })

      this.dispatchSource = new MatTableDataSource(this.itemDPs);
      this.dispatchSource.sort = this.sort;
      this.dispatchSource.paginator = this.paginator;
    });
    // data.snapshotChanges().subscribe(item => {
    //   let i = 1;
    //
    //   item.forEach(element => {
    //     let json = element.payload.toJSON();
    //     json["$key"] = element.key;
    //     // this.itemList.push(json as Item);
    //     this.itemDPs.push(json as PerDisP);
    //     // this.xD.push(json);
    //
    //     i++
    //   });
  }

  ngOnInit() {

  }

  openDialog(f1: string): void {
    let dialogRef = this.dialog.open(ParkCarDialog, {
      width: '600px',
      data: { theKey: f1 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

  }

}

export interface PerDisP {
  $key: string;
  driver_fullname: string;
  car_plate_number: string;
  time_in: string;
  time_out: string;
  left: any;

}

@Component({
  selector: 'park-car-dialog',
  templateUrl: 'park-car-dialog.html',
})
export class ParkCarDialog {
  dpdataArray = [];
  public tNow: any;

  constructor(
    public dialogRef: MatDialogRef<ParkCarDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, public snackBar: MatSnackBar) {

    let timestamp = +new Date();

    firebase.database().ref('dispatches').child(this.data.theKey.$key).on('value', (snapshot) => {
      this.dpdataArray = snapshot.val();
    });

    this.tNow = new Date(timestamp).toLocaleString();
    this.tNow = this.tNow.split(' ').slice(0, 6).join(' ');

    console.log(this.dpdataArray);

  }

  onPark(key: string) {
    firebase.database().ref('parks').child(key).set({
      car_condition: this.data.theKey.car_condition,
      car_plate_number: this.data.theKey.car_plate_number,
      driver_fullname: this.data.theKey.driver_fullname,
      time_in: this.data.theKey.time_in,
      time_out: this.data.theKey.time_out,
      park_timestamp: this.tNow

    });

    firebase.database().ref('dispatches').child(key).remove();

    this.dialogRef.close();

    this.openSnackBar(this.data.theKey.car_plate_number);
  }

  openSnackBar(cpnum) {
    this.snackBar.open("Success park: " + cpnum, "Ok", {
      duration: 3000,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
