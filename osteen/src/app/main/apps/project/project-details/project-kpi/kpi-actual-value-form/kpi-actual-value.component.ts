import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'kpi-actual-value',
    templateUrl: 'kpi-actual-value.html',
    styleUrls: ['kpi-actual-value.scss']
})

export class KpiActualValueComponent implements OnInit {
    direction = 'row';
    currentUser: any;
    project_id: any;
    unit_id;
    mileValueFormGroup: FormGroup;
    kpiValueError: any;
    kpiValueErrorShow: any;
    userrole: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataDepartment: any;
    company_id: any;
    selectedMileStone: Array<number> = [];
    dataSections: any;
    mileStoneGet: any;
    dataStraObj: any;
    initiativesData: any;
    actionPlansData: any;
    dataunitOfMeasur: any;
    proAllDetails: any;

    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<KpiActualValueComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void {
       // this.project_id = this.data;
    console.log('hhii',this.data);
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.mileValueFormGroup = this._formBuilder.group({
            company_id: [this.company_id, Validators.required],
            login_access_token: [login_access_token, Validators.required],
            milestone_id: [this.data.milestone_id],
            project_id: [this.data.project_id],
            projct_kpi_dstrbt_vl: [{ value: this.data.projct_kpi_dstrbt_vl, disabled: true }],
            //project_kpi_id: [this.data.project_kpi_id],
            project_kpi_actual: [this.data.project_kpi_actual, Validators.required],
            kpi_mile_stone_id: [this.data.kpi_mile_stone_id],
            milestone_name: [{ value: this.data.milestone_name, disabled: true }],
            project_kpi_status: [this.data.project_kpi_status],
            sr_no: [this.data.project_kpi_sr_no],
            project_kpi_reason: [this.data.project_kpi_reason, Validators.required],
            project_kpi_solution: [this.data.project_kpi_solution, Validators.required],
            projectDetails: ['kpiProject'],
        });
        this.mileValueFormGroup.get('project_kpi_actual').valueChanges.subscribe(val => {
            if (this.data.projct_kpi_dstrbt_vl > val) {
                let chnge = ((val / this.data.projct_kpi_dstrbt_vl) * 100);
                if (chnge >= 90) {
                    this.mileValueFormGroup.patchValue({ project_kpi_status: 'Yellow' });
                }
                else if (chnge < 90) {
                    this.mileValueFormGroup.patchValue({ project_kpi_status: 'Red' });
                }
            }
            else {
                this.mileValueFormGroup.patchValue({ project_kpi_status: 'Green' });
            }
        })
    }
    AddKpiPopupClose(): void {
        this.dialogRef.close();
    }
    ActualValueSubmit() {
        this.submitted = true;
        // stop here if mileValueFormGroup is invalid
        if (this.mileValueFormGroup.invalid) {
            return;
        }
        else if (this.mileValueFormGroup.value.project_kpi_actual > this.mileValueFormGroup.value.projct_kpi_dstrbt_vl) {
            alert("actual value should be lesser or equal to  target value");
            return;
        }
        else {
            // this.mileValueFormGroup.value.project_id = this.project_id;
            this.userService.ProjectUpdate(this.mileValueFormGroup.value).pipe(first()).subscribe(
                (data: any) => {
                    // this.status_code = data;
                    if (data.status_code == 200) {
                        this.alertService.success(data.message, true);
                        this.dialogRef.close('YesSubmit');
                    }
                    else {
                        this.alertService.error(data.message, true);
                    }
                },
                error => {
                    this.alertService.error(error);
                });
        }
    }
}