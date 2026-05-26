import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ApiService from '../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  constructor(private api: ApiService) { }

  getAll(): Observable<any[]> {
    return this.api.get('/driver/getAll');
  }
}
