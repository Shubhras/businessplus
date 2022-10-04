import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from '../../../_services';
import { Lightbox } from 'ngx-lightbox';
@Component({
    selector     : 'big-data',
    templateUrl  : './big-data.component.html',
    styleUrls    : ['./big-data.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class BigDataComponent implements OnInit
{
   currentUser: any;
   //private _albums: Array<any>;
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private _lightbox: Lightbox,
        public dialog: MatDialog,
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
