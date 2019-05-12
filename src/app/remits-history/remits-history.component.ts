import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from "@angular/material";
import {PerRemit} from "../remits/remits.component";
import {AngularFireDatabase} from "angularfire2/database";
import {PerHistory} from "../client-history/client-history.component";
import {ActivatedRoute} from "@angular/router";
import * as firebase from "firebase";

@Component({
  selector: 'app-remits-history',
  templateUrl: './remits-history.component.html',
  styleUrls: ['./remits-history.component.scss']
})
export class RemitsHistoryComponent implements OnInit {
  itemList: PerHistory[];
  infoList: PerDriver[];
  cashSource = new MatTableDataSource(this.itemList);
  cashColumns = ['amount', 'timestamp'];
  noRecords: boolean;
  key: string = '';
  full_name: string;
  noCashChild: boolean;
  isName: string = '';
  dfullname: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.cashSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.cashSource.filter = filterValue;

    this.noRecords = this.cashSource.filteredData.length == 0;
  }

  constructor(private db: AngularFireDatabase, public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get("$key").toString();

    this.isName = this.route.snapshot.paramMap.get("fullname").toString();
    console.log(this.key);

    let historyRef = firebase.database().ref('history/payments/' + this.key);
    const that = this;
    historyRef.once("value")
      .then(function(snapshot) {
        if(snapshot.hasChild("cash")) {
          let data = that.db.list('history/payments/' + that.key + '/cash/');

          data.snapshotChanges().subscribe(item => {
            that.itemList = [];
            let i = 1;

            item.forEach(element => {
              let json = element.payload.toJSON();
              json["$key"] = element.key;
              json['in1'] = i;
              // this.itemList.push(json as Item);
              that.itemList.push(json as PerHistory);
              // this.xD.push(json);

              i++
            });

            that.cashSource = new MatTableDataSource(that.itemList.slice().reverse());
            that.cashSource.sort = that.sort;
            that.cashSource.paginator = that.paginator;

            console.log(that.itemList);
          });
        } else {
          that.noCashChild = true;
        }
      });

    let getName = this.db.list('history/payments/' + this.key);

    getName.snapshotChanges().subscribe(item => {
      this.infoList = [];
      let i = 1;

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        // this.itemList.push(json as Item);
        this.infoList.push(json as PerDriver);
        // this.xD.push(json);

        i++
      });

      console.log("infoList", this.infoList);
    });
  }

}

export interface PerHistory {
  $key: string;
  amount: number;
  timestamp: number;
  full_name: string;
}

export interface PerDriver {
  $key: string;
  user_firstname: string;
  user_lastname: string;
  user_email: string;
}
