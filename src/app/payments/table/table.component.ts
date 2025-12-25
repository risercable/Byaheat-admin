import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import { Car as PerCar } from '../../shared/models/car.model';
import {AngularFireDatabase} from "angularfire2/database";
import {CarService} from "../../drivers/shared/car.service";
import {Title} from "@angular/platform-browser";
import {ActivatedRoute} from "@angular/router";
import * as firebase from "firebase";
import {PerClientPays} from "../client/client.component";
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  itemList: PerPays[];
  dataSource = new MatTableDataSource(this.itemList);
  displayedColumns = ['in1', 'payment_method', 'price', 'timestamp'];
  noRecords: boolean;
  key: string = '';
  price: number;
  arrayPo: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;

    if(this.dataSource.filteredData.length == 0) {
      this.noRecords = true;
    } else {
      this.noRecords = false;
    }
  }

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private titleService: Title, public dialog: MatDialog) {
    console.log(this.key);
  }

  ngOnInit() {
    this.titleService.setTitle("Lakbay | Payments Table");
    this.key = this.route.snapshot.paramMap.get("$key").toString();

    let data = this.db.list('/payments/' + this.key, ref => ref.orderByChild('paid/'+ this.key).limitToLast(1));
    this.itemList = [];
    this.arrayPo = [];

    const db = firebase.database();
    const usersRef = db.ref('payments/' + this.key);
    const query = usersRef.orderByChild('paid/' + this.key).limitToLast(1);

    data.snapshotChanges().subscribe(item => {
      this.itemList = [];
      let i = 1;
      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json["in1"] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as PerPays);

        i++;

      });

      this.dataSource = new MatTableDataSource(this.itemList);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

}

export interface PerPays {
  in1: string;
  payment_method: string;
  price: string;
  timestamp: string;
}
