import { Component,OnInit,  ViewEncapsulation} from '@angular/core';
import {  MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder} from '@angular/forms';
import { AlertService, UserService } from 'app/main/apps/_services';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Lightbox } from 'ngx-lightbox';
@Component({
  selector: 'governance-view',
  templateUrl: './governance-view.component.html',
  styleUrls: ['./governance-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GovernanceViewComponent implements OnInit {
  currentUser: any;
  tabByVlue: any;
  /**
   * Constructor
    * @param {FuseSidebarService} _fuseSidebarService
   *
   */
  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private _lightbox: Lightbox,
    public dialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
  ) {
  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.tabByVlue = 'organization';
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  toggleSidebarHide(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  changeTab(tab): void {
    this.tabByVlue = tab;
  }
}
