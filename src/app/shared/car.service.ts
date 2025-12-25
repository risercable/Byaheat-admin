import { Injectable } from '@angular/core';
import ApiService from '../core/services/api.service';
import {Observable} from 'rxjs/internal/Observable';
import { Car as CarModel } from './models/car.model';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  constructor(private api: ApiService) {}

  createCar(payload: CarModel): Observable<any> {
    return this.api.request('POST', '/car/create', {
      body: payload
    });
  }

  getAll(): Observable<any> {
    return this.api.get('/car/getAll');
  }
}
