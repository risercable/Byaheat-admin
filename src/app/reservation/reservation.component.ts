import {Component, OnInit, ViewChild, Inject, ViewEncapsulation} from '@angular/core';
import {AngularFireDatabase,AngularFireList} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import 'rxjs/add/operator/map';
import {MatPaginator, MatSort, MatTableDataSource, Sort, MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {map} from "rxjs/operators";
import { OrderPipe } from 'ngx-order-pipe';
declare var jsPDF: any; // Important

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {
  reservationsList: AngularFireList<any>;
  historyList: AngularFireList<any>;
  moreList: AngularFireList<any>;
  moreList2: AngularFireList<any>;
  reserves: Observable<any[]>;
  more: Observable<any[]>;
  more2: Observable<any[]>;
  destination: Observable<any[]>;
  time: Observable<any[]>;
  sortedCollection: any[];
  order: string = 'cfull_name';
  reverse: boolean = false;
  keyx: string;
  displayedColumns = ['in1', 'customer name', 'driver name', 'destination', 'rating', 'actions'];
  itemList: Item[];
  itemPrint: Item[];
  xD = [];
  dataSource = new MatTableDataSource(this.itemList);
  noRecords: boolean;
  hideTableX: boolean = false;
  searchX: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  // }

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

  constructor(public db: AngularFireDatabase, private orderPipe: OrderPipe, public dialog: MatDialog) {
    let data = db.list('history');
    this.itemPrint = [];

    data.snapshotChanges().subscribe(item => {
      this.itemList = [];
      let i = 1;

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json['in1'] = i;
        // this.itemList.push(json as Item);
        this.itemPrint.push(json as Item);
        this.xD.push(json);

        i++
      });

      this.dataSource = new MatTableDataSource(this.itemPrint);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });

    this.reservationsList = db.list('history');

    this.reserves = this.reservationsList.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    // this.reserves = db.list('history').valueChanges();
   }

   openDialog(i: any): void {
    let dialogRef = this.dialog.open(ViewDetailsDialog, {
      width: 'auto',
      data: { datarray: i }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

   setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  ngOnInit() {
    this.hideTableX = true;
    // let data = this.db.list('history');
    // this.itemPrint = [];
    // data.snapshotChanges().subscribe(item => {
    //   this.itemList = [];

    //   item.forEach(element => {
    //     let json = element.payload.toJSON();
    //     json["$key"] = element.key;
    //     this.itemList.push(json as Item);
    //     this.itemPrint.push(json as Item);
    //   });

    //   this.dataSource = new MatTableDataSource(this.itemList);
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;

    // });

    // console.log(this.itemPrint.slice());
  }

  isEmptyString() {
    this.hideTableX = this.searchX === '';
  }

  viewThis(i: string) {
    this.historyList = this.db.list('history', ref => ref.orderByKey().equalTo(i));

    this.more = this.historyList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    var ele = document.getElementById("selectReservation") as any;

    ele.showModal();
  }

  passKey(rsKey: string, rsCustomer: string, rsDriver: string) {
    this.moreList = this.db.list('clients', ref => ref.orderByKey().equalTo(rsCustomer));

    this.historyList = this.db.list('history', ref => ref.orderByKey().equalTo(rsKey));

    this.moreList2 = this.db.list('drivers', ref => ref.orderByKey().equalTo(rsDriver));

    this.more = this.moreList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.more2 = this.moreList2.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.destination = this.historyList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });

    this.time = this.reservationsList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  onPrint(){
    console.log(this.xD);
    var doc = new jsPDF('p', 'pt');
  doc.text("Cars List", 40, 50);
  var columns = [
    {title: "ID", dataKey: "in1"},
    {title: "CusName", dataKey: "customer_name"},
    {title: "Driver Name", dataKey: "driver_name"},
    {title: "Destination", dataKey: "destination"},
    {title: "Rating", dataKey: "rating"},
    {title: "TimeStamp", dataKey: "timestamp"}
  ];
    var rows = this.xD;
  doc.autoTable(columns, rows, {tableWidth: 'auto', startY: false, margin: {top: 100}, theme: 'grid'});
  var pdfUrl = doc.output('datauri').substring(doc.output('datauri').indexOf(',')+1);
  var binary = atob(pdfUrl.replace(/\s/g, ''));
  var len = binary.length;
  var buffer = new ArrayBuffer(len);
  var view = new Uint8Array(buffer);
  for (var i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
  }

  var blob = new Blob( [view], { type: "application/pdf" });
  var url = URL.createObjectURL(blob);

  window.open(url);
}

  printElement(id) {
    var printHtml = document.getElementById(id).outerHTML;
    var currentPage = document.body.innerHTML;

    var elementPage = '<html><head><link rel="stylesheet" href="styles.scss" /><title></title></head><body>' + printHtml + '</body>';

    document.getElementById('hideThis').style.visibility = 'hidden';

    document.body.innerHTML = elementPage;

    window.print();

    document.body.innerHTML = currentPage;

    window.location.reload();
    // var printContents = document.getElementById(id).outerHTML;
    // var currentPage = document.body.innerHTML;
    // var elementPage = '<html><head><title></title></head><body>' + printContents + '</body>';
    // var popupWin = window.open('', '_blank', 'width=300,height=300');
    // popupWin.document.body.innerHTML = elementPage;
    // popupWin.document.open();
    // popupWin.document.write(elementPage);
    // popupWin.document.close();


  }

  printNow() {

  }

}

export interface Item {
  customer_name: string;
  in1: number;
  driver_name: string;
  destination: string;
  rating: string;
  timestamp: string;
  key: string;
}

@Component({
  selector: 'view-details-dialog',
  templateUrl: 'view-details-dialog.html',
  styleUrls: ['reservation.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewDetailsDialog {

  constructor(
    public dialogRef: MatDialogRef<ViewDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
