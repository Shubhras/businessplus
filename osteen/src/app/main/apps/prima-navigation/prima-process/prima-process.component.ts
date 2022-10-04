import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService, UserService} from '../../_services';
import {Router} from '@angular/router';
import { first } from 'rxjs/operators';
@Component({
    selector     : 'prima-process',
    templateUrl  : './prima-process.component.html',
    styleUrls    : ['./prima-process.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PrimaProcessComponent implements OnInit
{
    //userrole: any;
   // allUnitsGet: any;
  //  unit_id:any;
   // unit_name:any;
   // currentUnitId:any;
   // currentUnitName:any;
    //message:string;
    currentUser: any;
    /**
     * Constructor
     *
     *
     * @param {FormBuilder} _formBuilder
     */
    constructor(
       // private _fuseConfigService: FuseConfigService,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
    )
    {
        // Configure the layout
        /* this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: false
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        }; */
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
      //  this.data.currentMessage.subscribe(message => this.message = message);
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
    }
}
