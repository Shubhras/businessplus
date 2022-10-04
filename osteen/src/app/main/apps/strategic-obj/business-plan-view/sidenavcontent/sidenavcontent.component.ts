import { Component, OnInit } from '@angular/core';
import { SideNavService } from '../side-nav.service';

@Component({
  selector: 'app-sidenavcontent',
  templateUrl: './sidenavcontent.component.html',
  styleUrls: ['./sidenavcontent.component.scss']
})
export class SidenavcontentComponent implements OnInit {

  public nodeTitle = '';
  public focusNode;
  public activeNode = false;
  public dateCreated = '';
  public installId = null;
  public description = null;
  constructor(private sideNavScv: SideNavService) {
    this.sideNavScv.sideNavToggler$.subscribe((status) => {
      if (status) {
        this.activeNode = true;
        this.focusNode = sideNavScv.getFocusNode();
        this.setNodeTitle(sideNavScv.getFocusNode()['name']);
        this.setDateCreated(sideNavScv.getFocusNode()['datecreated']);
        if (sideNavScv.getFocusNode()['description']) {
          this.setDescription(sideNavScv.getFocusNode()['description']);
        } else {
          this.description = null;
        }

        if (sideNavScv.getFocusNode()['installid']) {
          this.setInstallId(sideNavScv.getFocusNode()['installid']);
        } else {
          this.installId = null;
        }
      } else {
        this.activeNode = false;
      }
    });
  }

  ngOnInit() {
  }

  setDescription(desc) {
    this.description = desc;
  }
  setInstallId(installid) {
    this.installId = installid;
  }

  setDateCreated(date) {
    this.dateCreated = date;
  }
  setNodeTitle(title) {
    this.nodeTitle = title;
    console.log(this.activeNode);
  }

}
