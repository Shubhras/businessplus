import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class DataYearService {
  currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //readonly currentYear: number = new Date().getFullYear();
  readonly currentYear: number = this.currentUser ? this.currentUser.userSelectedYear : null;
  messageSource = new BehaviorSubject(this.currentYear);
  currentMessageYear = this.messageSource.asObservable();
  constructor() { }
  changeMessageYear(messageYear: number) {
    this.messageSource.next(messageYear);
  }
  clearMessagesYear() {
    this.messageSource.next(null);
  }
}