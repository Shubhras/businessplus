import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavService {

  focusNode: JSON;
  focusNodeID: String;
  count: number;

  private sideNavToggler = new Subject<any>();
  sideNavToggler$ = this.sideNavToggler.asObservable();

  constructor() {
    this.count = 0;
   }


  toggleSideNav(status: boolean) {
    this.sideNavToggler.next(status);
  }

  getFocusNode() {
    return this.focusNode;
  }

  setFocusNode(id: string, node) {

    if (this.focusNodeID === id) {
      this.sideNavToggler.next(false);
      this.focusNodeID = '';
      this.count = this.count + 1;
    } else {
      this.focusNode = node;
      this.sideNavToggler.next(true);
      this.focusNodeID = id;
      this.count = 0;
    }
    if (this.count === 2) {
      this.count = 0;
      this.focusNode = node;
      this.sideNavToggler.next(true);
      this.focusNodeID = id;
    }

  }
  clearFocusNode(id, node) {
    this.focusNodeID = null;
    this.focusNode = null;
  }
  getFocusNodeId() {
    return this.focusNodeID;
  }
}
