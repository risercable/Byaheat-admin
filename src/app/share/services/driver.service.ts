import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'http://localhost:3000/api/getAllDrivers';

  constructor(
    private http: HttpClient
  ) { }
}
