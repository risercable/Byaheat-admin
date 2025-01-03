import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {Perclient} from "../account/account.component";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {query} from "@angular/animations";
import {Observable} from "rxjs";
import {AngularFireList} from "angularfire2/database";


@Component({
  selector: 'app-client-history',
  templateUrl: './client-history.component.html',
  styleUrls: ['./client-history.component.scss']
})
export class ClientHistoryComponent implements OnInit {
  itemList: PerHistory[];
  clientSource;
  xD: PerHistory[] = [];
  key: string;
  fullname: string;
  fname: string[];
  lname: string;
  clientList: AngularFireList<any>;
  clients: Observable<any>;
  historyColumns = ['index_num', 'destination', 'driver_name', 'price', 'rating', 'timestamp'];

  private paginator: MatPaginator;
  private sort: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.clientSource.paginator = this.paginator;
    this.clientSource.sort = this.sort;
  }

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {
    this.xD = [];
  }

  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get("$key").toString();
    this.fullname = this.route.snapshot.paramMap.get("fullname").toString();
    console.log("Aww: " + this.key);

    let data = this.db.list('history', ref => ref.orderByChild('customer').equalTo(this.key));
    this.itemList = [];
    this.xD = [];

    data.snapshotChanges().subscribe(item => {
      let i = 1;

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json['in1'] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as PerHistory);
        this.xD.push(json as PerHistory);

        i++;
      });

      this.clientSource = new MatTableDataSource(this.itemList.reverse());
      this.clientSource.sort = this.sort;
      this.clientSource.paginator = this.paginator;

    });

    console.log("aww: ");
  }
}

export interface PerHistory {
  $key: string;
  index_num: string;
  customer: string;
  customer_name: string;
  destination: string;
  driver: string;
  driver_name: string;
  price: string;
  rating: string;
  timestamp: string;
}
