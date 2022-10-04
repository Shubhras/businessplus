import { Component, OnInit, ViewEncapsulation} from '@angular/core';
import { MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder} from '@angular/forms';
import { AlertService, UserService} from 'app/main/apps/_services';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
@Component({
    selector     : 'presentation-view',
    templateUrl  : './presentation-view.component.html',
    styleUrls    : ['./presentation-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PresentationViewComponent implements OnInit
{
    currentUser: any;
    tabByVlue: any;
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public dialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
    )
    {

    }
    /**
     * On init
     */
    ngOnInit(): void
    {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.tabByVlue = 'corporate';
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