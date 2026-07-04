
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../../auth.service';
import { AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/internal/Observable';
import { Client } from './client.model';

@Injectable()
export class ClientService {

  clientList: AngularFireList<any>;
  clients: Observable<any>;
  selectedClient: Client = new Client();

  constructor(public authService: AuthService, db: AngularFireDatabase) {
    this.clientList = db.list('clients');
    this.clients = this.clientList.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    }));
   }

   getData(){
    return this.clientList;
  }

  insertClient(client: Client) {
    this.clientList.push({
      user_firstname: client.user_firstname,
      user_lastname: client.user_lastname,
      user_birthdate: client.user_birthdate,
      user_mobile: client.user_mobile,
    });

    // this.incar = true;
  }

  updateClient(clientx : Client){
    this.clientList.update(clientx.$key,{
      user_firstname: clientx.user_firstname,
      user_lastname: clientx.user_lastname,
      user_birthdate: clientx.user_birthdate,
      user_mobile: clientx.user_mobile,
    })
    // this.upcar = true;
 }

 deleteClient(key : string){
  this.clientList.remove(key);

  // this.delcar = true;
}

}
