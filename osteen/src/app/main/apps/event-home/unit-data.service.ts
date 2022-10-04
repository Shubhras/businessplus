import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class DataService {
  messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();
  constructor() {
  	let unitName = localStorage.getItem('currentUnitName');
  	if (unitName) {
  		this.changeMessage(unitName);
  	}
  }
  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  clearMessages() {
    this.messageSource.next('');
  }
}