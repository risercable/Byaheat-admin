import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Observable , of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient,) { }
  
  registerUser(objectVar): Observable<any> {
    const payload = {  objectVar };
    return this.http.post<any>(`${this.baseUrl}/register`, payload);
  }
}
