import {Component, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { Title }     from '@angular/platform-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ClientService } from '../drivers/shared/client.service';
import { Client } from '../drivers/shared/client.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {ViewDetailsDialog} from "../reservation/reservation.component";
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
  clientColumns = ['user_firstname', 'user_lastname', 'user_birthdate', 'user_mobile', 'actions'];
  itemPrint: Perclient[];
  itemList: Perclient[];
  clientSource = new MatTableDataSource(this.itemPrint);
  noRecords: boolean;
  hideTableX: boolean = false;
  searchX: string = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.clientSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {


    this.hideTableX = this.searchX === '';

    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.clientSource.filter = filterValue;

    this.noRecords = this.clientSource.filteredData.length == 0;
  }

  constructor(private db: AngularFireDatabase,private clientService: ClientService, public authService: AuthService, private route: ActivatedRoute, private titleService: Title, public dialog: MatDialog, private router: Router) {
    // this.clientList = db.list('clients');
    // this.clients = this.clientList.snapshotChanges().map(changes => {
    //   return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    // });

    let data = db.list('clients');
    this.itemList = [];

    data.snapshotChanges().subscribe(item => {
      let i = 1;

      item.forEach(element => {
        let json = element.payload.toJSON();
        json["$key"] = element.key;
        json['in1'] = i;
        // this.itemList.push(json as Item);
        this.itemList.push(json as Perclient);
        // this.xD.push(json);

        i++
      });

      this.clientSource = new MatTableDataSource(this.itemList);
      this.clientSource.sort = this.sort;
      this.clientSource.paginator = this.paginator;

    });
   }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }

    this.order = value;
  }

  openDialog(i: any): void {
    let dialogRef = this.dialog.open(ClientDetailsDialog, {
      width: 'auto',
      data: { clientarray: i }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onSelect(element) {
    this.router.navigate(['/user/history', element.$key]);
  }

  ngOnInit() {
    this.setTitle("Lakbay | Users");
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

    this.hideTableX = true;
  }

  isEmptyString() {
    this.hideTableX = this.searchX === '';
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

  onPrint(){
    var doc = new jsPDF('p', 'pt');
  doc.text("Users List", 40, 50);
  var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"), true);
  var columns = [res.columns[0], res.columns[1], res.columns[2], res.columns[3]];
  doc.autoTable(res.columns, res.data, {startY: 60});
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
  latest_ride: string;
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
