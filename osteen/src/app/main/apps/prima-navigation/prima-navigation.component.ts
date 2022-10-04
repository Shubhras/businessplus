import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, UserService} from '../_services';
import {Router} from '@angular/router';
@Component({
    selector     : 'prima-navigation',
    templateUrl  : './prima-navigation.component.html',
    styleUrls    : ['./prima-navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PrimaNavigationComponent implements OnInit
{
    currentUser:any;
    //userModulePermission: any;
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
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: false
                },
                footer   : {
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
    ngOnInit(): void
    {
       this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      // this.userModulePermission  = JSON.parse(localStorage.getItem('userModulePermission'));
       //console.log('userModulePermission',this.userModulePermission);
    }
}
