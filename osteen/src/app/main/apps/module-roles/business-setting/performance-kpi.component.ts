import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
import { User } from '../../_models';
@Component({
  selector: 'performance-kpi-dialog',
  templateUrl: 'performance-kpi.component.html',
})
export class performanceKpiDialog {
    direction = 'row';
    currentUser: any;
    PerformanceForm: FormGroup;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    perKpiType:any;
    editPerformanceKpi:any;
    // Private
    constructor(
        public dialogRef: MatDialogRef<performanceKpiDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }
    performanceKpiClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
        this.editPerformanceKpi = this.data;
      //  console.log(this.editPerformanceKpi);
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.PerformanceForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            kpi_performance_dash_id : [this.editPerformanceKpi.performance_dash, Validators.required],
            kpi_id : [this.editPerformanceKpi.kpi_id, Validators.required]
        });
        this.typePerformanceKpi();
    }
    PerformanceSubmit() {
        this.submitted = true;
        // stop here if PerformanceForm is invalid
        if (this.PerformanceForm.invalid) {
            return;
        }
       /*  console.log(this.PerformanceForm.value);
        return; */
         this.userService.performanceTypeChange(this.PerformanceForm.value).pipe(first()).subscribe(
            (data:any) => {
                this.status_code = data;
                if(this.status_code.status_code == 200){
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.dialogRef.close('YesSubmit');
                }
                else{
                    this.MessageError = data;
                    this.alertService.error(this.MessageError.message, true);
                }
            },
            error => {
                this.alertService.error(error);
        });
    }
    typePerformanceKpi() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.typePerformanceKpi(login_access_token).pipe(first()).subscribe(
            (data:any) => {
                this.perKpiType = data.data;
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