import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
@Component({
    selector     : 'finance-operations',
    templateUrl  : './finance-operations.component.html',
    styleUrls    : ['./finance-operations.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FinanceOperationsComponent implements OnInit
{
    currentUser: any;
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
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
    }
}
