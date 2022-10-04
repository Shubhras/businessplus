import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
@Component({
    selector: 'main-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MainDashboardComponent implements OnInit {
    currentUser: any;
    userModulePermission: any;
    //order: string = 'hierarchy';
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false,
                    folded:true
                },
                toolbar: {
                    hidden: false
                },
                footer: {
                    hidden: false
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
    /**
     * On init
     */

    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
       
        this.userModulePermission.forEach(row => {
            // if( row.display_name== 'Administration'){
            //     console.log('row', row);
            //     row.icon_class = 'settings';
            // }
            if( row.display_name== 'Prima Project'){
                // row.icon = 'fa fa-cube';
                // row.icon_class = 'task';
                console.log('row', row);
            }
            
            if (row.display_name == 'Set New Business Plans' && row.sidebar_status == 1) {
                if (row.module_name == 'Set_business_plans') {
                    // row.display_url = "business-plan-list-view";
                    row.display_url = "strategic-obj/started/1";
                    
                }
            }
        });
    }
}