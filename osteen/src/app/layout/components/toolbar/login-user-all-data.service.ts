import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs';
@Injectable()
export class LoginUserAllDataService {
  //currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //readonly currentYear: number = new Date().getFullYear();
  /* private currentUserData:  any =  null;
  messageSource = new BehaviorSubject(this.currentUserData);
  currentMessageUserAll = this.messageSource.asObservable();
  constructor() { }
  changeMessageUserAll(messageUserAll: any) {
      console.log('Service',messageUserAll);
    this.messageSource.next(messageUserAll);
  }
  clearMessagesUserAll() {
    this.messageSource.next(null);
  } */
  private _localItem: string;
  constructor() { }
  set localItem(value: string) {
    this._localItem = value;
    localStorage.setItem('localItem', value);
  }
  get localItem() {
    return this._localItem = localStorage.getItem('localItem')
  }
}