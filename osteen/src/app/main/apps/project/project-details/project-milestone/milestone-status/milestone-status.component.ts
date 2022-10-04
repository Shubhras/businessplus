import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'milestone-status',
    templateUrl: 'milestone-status.html',
    styleUrls: ['milestone-status.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})

export class MilestoneStatusComponent implements OnInit {
    direction = 'row';
    currentUser: any;
    project_id: any;
    unit_id;
    mileStatusFormGroup: FormGroup;
    submitted = false;
    company_id: any;
    proAllDetails: any;
    projectDetails: any;
    proStart_date: any;
    project_step_id: number[] = [1, 5];
    current_project_steps_idtwo: number;
    constructor(
        public dialogRef: MatDialogRef<MilestoneStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
    ) {

    }
    ngOnInit(): void {

        this.project_id = this.data.project_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.singleViewProjects();
        this.mileStatusFormGroup = this._formBuilder.group({
            project_id: [this.project_id],
            project_milestone_id: [this.data.project_milestone_id, Validators.required],
            milestone_status: [this.data.milestone_status, Validators.required],
            actual_date: [this.data.actual_date, Validators.required],
            comment: [this.data.comment, Validators.required],
        });
    }
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.proAllDetails = data.data;
                this.projectDetails = data.data.projectData[0];
                this.current_project_steps_idtwo = (this.projectDetails.project_step_id);
                console.log(this.current_project_steps_idtwo);

                this.proStart_date = new Date(this.projectDetails.start_date);
            },
            error => {
                this.alertService.error(error);
            });
    }
    AddKpiPopupClose(): void {
        this.dialogRef.close();
    }
    moileStatusSubmit() {
        this.submitted = true;
        if (this.current_project_steps_idtwo == 5) {
            this.mileStatusFormGroup.value.project_step_id = this.project_step_id[1];
            // alert("hello-yes");
        }
        else {
            this.mileStatusFormGroup.value.project_step_id = this.project_step_id[0];
            // alert("hello-no");
        }
        this.mileStatusFormGroup.value.actual_date = this.datepipe.transform(this.mileStatusFormGroup.value.actual_date, 'dd-MM-yyyy');
        const mileData = {
            "login_access_token": this.currentUser.login_access_token,
            "company_id": this.company_id,
            "unit_id": this.unit_id,
            "project_id": this.project_id,
            "start_date": this.projectDetails.start_date,
            "end_date": this.projectDetails.end_date,
            "project_duration": this.projectDetails.project_duration,
            "projectDetails": "projectKeyDates",
            "mile_stone": [this.mileStatusFormGroup.value]
        }
        // stop here if mileStatusFormGroup is invalid
        if (this.mileStatusFormGroup.invalid) {
            return;
        }
        this.userService.ProjectAdd(mileData).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                } else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
}