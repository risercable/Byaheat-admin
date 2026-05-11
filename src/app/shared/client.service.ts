import { Injectable } from '@angular/core';
import ApiService from '../core/services/api.service';
import {Observable} from 'rxjs/internal/Observable';
import { Client } from '../drivers/shared/client.model';
import { Perclient } from '../account/account.component';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private api: ApiService) { }

  getAll(): Observable<Perclient[]> {
    return this.api.get('/client/all');
  }
}
