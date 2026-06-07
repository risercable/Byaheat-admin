import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import ApiService from '../core/services/api.service';
import {Driver} from '../drivers/shared/driver.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private detailsCache: { [id: string]: Driver } = {};

  constructor(private api: ApiService) { }

  getAll(): Observable<any[]> {
    return this.api.get('/driver/getAll');
  }

  getDetails(id: string): Observable<Driver> {
    if (this.detailsCache[id]) {
      return of(this.detailsCache[id]);
    }

    return this.api.get<Driver>(`/driver/${id}`).pipe(
      tap(driver => {
        this.detailsCache[id] = driver;
      })
    );
  }

  getUndispatched(): Observable<any[]> {
    return this.api.get('/driver/getUndispatched');
  }
}
