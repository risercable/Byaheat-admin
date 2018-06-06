import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AuthService } from '../auth.service';
import { Title }     from '@angular/platform-browser';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database/interfaces';
import { Observable } from 'rxjs/Observable';
import { ClientService } from '../drivers/shared/client.service';
import { Client } from '../drivers/shared/client.model';
import { NgForm } from '@angular/forms/src/directives/ng_form';
import { FilterPipe }from '../filter.pipe';
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

  constructor(private db: AngularFireDatabase,private clientService: ClientService, public authService: AuthService, private route: ActivatedRoute, private titleService: Title) {
    this.clientList = db.list('clients');
    this.clients = this.clientList.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
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
    console.log(event) //option value will be sent as event
    this.ipp = event;
   }
   byId(item1: 10, item2: 10) {
    return item1 === item2;
  }

}
