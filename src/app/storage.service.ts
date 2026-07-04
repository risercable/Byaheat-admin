import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable()
export class StorageService {

  toPending: string;
  private messageSource = new BehaviorSubject<string>("showAll");
  currentMessage = this.messageSource.asObservable();

  constructor() { }

  public getPendings(name: string) {
    return this.toPending = name;
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

}
