import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { UnitChangeService } from 'app/main/apps/module-roles/unit-change/unit-change.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { User } from '../../_models';

@Component({
    selector: 'edit-unit-dialog',
    templateUrl: 'editunit.component.html',
})
export class EditUnitDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    EditUnitForm: FormGroup;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditUnitDialog>,
        @Inject(MAT_DIALOG_DATA) public data: User,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    EditUnitPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        // Reactive Form
        this.EditUnitForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_name: [this.EditDataGet.unit_name, Validators.required],
            unit_address: [this.EditDataGet.unit_address, Validators.required],
            company_id: [company_id, Validators.required],
            enable: [this.EditDataGet.enable, Validators.required],
            id: [this.EditDataGet.id, Validators.required],
        });
    }
    EditUnitSubmit() {
        this.submitted = true;
        // stop here if EditUnitForm is invalid
        if (this.EditUnitForm.invalid) {
            return;
        }
        this.userService.editUnitChange(this.EditUnitForm.value).pipe(first()).subscribe(
            (data: any) => {
                this.status_code = data;
                if (this.status_code.status_code == 200) {
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.dialogRef.close('YesSubmit');
                }
                else {
                    this.MessageError = data;
                    this.alertService.error(this.MessageError.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
}
export interface DialogData {
    animal: string;
    name: string;
}