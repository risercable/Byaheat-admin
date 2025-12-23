import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Title }     from '@angular/platform-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { ClientService } from '../drivers/shared/client.service';
import { Client } from '../drivers/shared/client.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import * as firebase from "firebase";
import { UtilService } from '../util.service';

import { ChangeDetectorRef } from '@angular/core';

declare var jsPDF: any; // Important

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  userFilter: any = { name: '' };
  p: number = 1;
  clientList: AngularFireList<any>;
  clients: Observable<any>;
  clientlist: Client[];
  selectedClient: Client = new Client();
  ipp: any;
  optionSelected: any;
  order: string = 'cfull_name';
  reverse: boolean = false;
  // clientColumns = ['in1', 'user_firstname', 'user_lastname', 'user_birthdate', 'user_mobile', 'actions'];
  clientColumns = ['in1', 'user_firstname', 'user_lastname', 'user_birthdate', 'user_mobile', 'actions'];
  itemPrint = [];
  itemList: Perclient[];
  clientSource = new MatTableDataSource([]);
  noRecords: boolean;
  hideTableX: boolean = false;
  hideET: boolean = true;
  bbt: boolean = true;
  searchX: string = '';

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

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    if (!filterValue) {
      this.clientSource.filter = '';
      this.clientSource.data = this.itemList; // Reset data source to all data
    } else {
      this.clientSource.filter = filterValue;

      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    }
    this.clientSource.filter = filterValue;
    // Update the flag for no records found
    this.noRecords = this.clientSource.filteredData.length === 0;
  }

  constructor(
    private db: AngularFireDatabase,
    private clientService: ClientService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private titleService: Title,
    public dialog: MatDialog,
    private router: Router,
    private utilities: UtilService,
    private cdr: ChangeDetectorRef
) {
    let data = db.list('clients');

    data.snapshotChanges().subscribe(item => {
      const tempItemList = [];
      const tempItemPrint = [];
      let i = 1;

      item.forEach(element => {
        const json = element.payload.val();
        json["$key"] = element.key;
        json['in1'] = i;

        tempItemList.push(json as Perclient);
        tempItemPrint.push(json);

        i++;
      });

      this.itemList = tempItemList;

      this.clientSource = new MatTableDataSource(this.itemList);
      this.clientSource.sort = this.sort;
      this.clientSource.paginator = this.paginator;

      // 🔹 Trigger Angular Change Detection to update UI
      this.cdr.detectChanges();

      console.log(this.itemList);
    });
   }

   store1(value: boolean) {
    localStorage.setItem("showTableBtn", value.toString());
   }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  openDialog(i: any): void {
    i.$key = this.utilities.hideCharacters(i.$key);
    const dialogRef = this.dialog.open(ClientDetailsDialog, {
      width: 'auto',
      data: { clientarray: i }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });

    // this.utilities.seedData();
  }

  onSelect(element) {
    this.router.navigate(['/clients/table/history', element.$key, element.user_firstname + " " + element.user_lastname]);
  }

  ngOnInit() {
    this.setTitle("Lakbay | Clients Served");
    const x = this.clientService.getData();
    x.snapshotChanges().subscribe(item => {
      this.clientlist = [];
      item.forEach(element => {
        const y = element.payload.toJSON();
        y["$key"] = element.key;
        this.clientlist.push(y as Client);
      });
    });
    this.ipp = 10;

    const showtblbtn = localStorage.getItem("showTableBtn"); // TODO: This is Buggy 

    this.hideTableX = false;

    this.bbt = this.hideTableX;
  }

  logout() {
    this.authService.logout();
  }

  public setTitle( newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  onSubmit(form: NgForm) {
    if (form.value.$key == null)
      this.clientService.insertClient(form.value);
    else
      this.clientService.updateClient(form.value);
    // this.resetForm(form);
  }

  // onDelete(form: NgForm) {
  //   if (confirm('Are you sure to delete this record ?') == true) {
  //     this.clientService.deleteClient(form.value.$key);
  //     this.resetForm(form);
  //   }
  // }

  onItemClick(clientx : Client){
    this.clientService.selectedClient = Object.assign({},clientx);
  }

  openPD() {
    let dialogRef = this.dialog.open(PrintOptsDialog, {
      width: 'auto',
      data: { colsSel: this.clientColumns }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onPrint(){
    var doc = new jsPDF('p', 'pt');
  doc.text("Users List", 40, 50);
  var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"), true);
  var columns = [
    {title: "BDate", dataKey: "user_birthdate"}
  ];
  let rows = this.itemPrint;
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
  onAll() {
    this.ipp = 9999;
  }

  onOptionSelected(event){
    console.log(event); //option value will be sent as event
    this.ipp = event;
   }
   byId(item1: 10, item2: 10) {
    return item1 === item2;
  }

}

export interface Perclient {
  $key: string;
  in1: number;
  user_firstname: string;
  user_lastname: string;
  user_birthdate: string;
  user_mobile: string;
  latest_ride_id: string;
  latest_ride_history: any[];
}

@Component({
  selector: 'client-details-dialog',
  templateUrl: 'client-details-dialog.html',
  styleUrls: ['client-details-style.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ClientDetailsDialog {

  constructor(
    public dialogRef: MatDialogRef<ClientDetailsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'print-opts-dialog',
  templateUrl: 'print-opts-dialog.html',
  encapsulation: ViewEncapsulation.None,
})

export class PrintOptsDialog {
  cols = [];
  sortedArray = [];
  sortD = '';

  constructor(
    public dialogRef: MatDialogRef<PrintOptsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    data.colsSel.forEach(item => {

      let val = {};
      val['value'] = item;
      this.cols.push(val);
    });

    let ind = this.cols.indexOf('actions');

    this.cols.splice(ind, 1);

    console.log(this.cols);

  }

  onGo() {
    console.log(this.sortD);
    firebase.database().ref('clients').orderByChild(this.sortD).on('value', (snapshot) => {
      snapshot.forEach((stepSnap) => {
        this.sortedArray.push(stepSnap.val());
      })
    });
    console.log('sorted array: ',this.sortedArray);

    var doc = new jsPDF('p', 'pt');
    doc.text("Clients served list ordered by: " + this.sortD, 40, 50);
    var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"), true);
    var columns = [
      {title: "Client First Name", dataKey: "user_firstname"},
      {title: "Client Last Name", dataKey: "user_lastname"},
      {title: "Birthdate", dataKey: "user_birthdate"},
      {title: "Client Mobile Number", dataKey: "user_mobile"}
    ];
    let rows = this.sortedArray;
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

    this.dialogRef.close();

    window.location.reload();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
