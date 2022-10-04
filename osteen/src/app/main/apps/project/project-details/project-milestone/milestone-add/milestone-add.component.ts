import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'milestone-add',
    templateUrl: './milestone-add.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class MilestoneAddComponent {
    direction = 'row';
    mileStoneFormGroup: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    currentUser: any;
    unit_id: any;
    private _unsubscribeAll: Subject<any>;
    project_id: any;
    proAllDetails: any;
    constructor(
        public dialogRef: MatDialogRef<MilestoneAddComponent>,
        //@Inject(MAT_DIALOG_DATA) public data: DialogData,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    PopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.project_id = this.data;
        // Reactive mileStoneFormGroup
        this.mileStoneFormGroup = this._formBuilder.group({
            company_id:this.currentUser.data.company_id,
            login_access_token:login_access_token,
            unit_id:this.unit_id,
            projectDetails:'projectKeyDates',
            project_id:this.project_id,
            start_date:[''],
            end_date:[''],
            project_duration:[''],
            project_milestone_id: [''],
            milestone_name: ['', Validators.required],
            mile_stone_date: ['', Validators.required],
            description: ['', Validators.required],
            symbol: ['', Validators.required],
        });
        this.singleViewProjects();
    }

    addMileStone() {
        this.submitted = true;
        // stop here if mileStoneFormGroup is invalid
        if (this.mileStoneFormGroup.invalid) {
            return;
        }
        this.mileStoneFormGroup.value.mile_stone_date = this.datepipe.transform(this.mileStoneFormGroup.value.mile_stone_date, 'dd-MM-yyyy')
        let milestoneData = {
            company_id:this.mileStoneFormGroup.value.company_id,
            login_access_token:this.mileStoneFormGroup.value.login_access_token,
            unit_id:this.mileStoneFormGroup.value.unit_id,
            projectDetails:'projectKeyDates',
            project_id:this.mileStoneFormGroup.value.project_id,
            start_date:this.mileStoneFormGroup.value.start_date,
            end_date:this.mileStoneFormGroup.value.end_date,
            project_duration:this.mileStoneFormGroup.value.project_duration,
            mile_stone:[{
                project_id:this.mileStoneFormGroup.value.project_id,
                project_milestone_id:this.mileStoneFormGroup.value.project_milestone_id,
                milestone_name:this.mileStoneFormGroup.value.milestone_name,
                mile_stone_date:this.mileStoneFormGroup.value.mile_stone_date,
                symbol:this.mileStoneFormGroup.value.symbol,
                description:this.mileStoneFormGroup.value.description,
            }]
        }
        this.userService.ProjectAdd(milestoneData).pipe(first()).subscribe(
            (data: any) => {
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
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.proAllDetails = data.data.projectData[0];
                this.mileStoneFormGroup.patchValue({ start_date: this.proAllDetails.start_date});
                this.mileStoneFormGroup.patchValue({ end_date: this.proAllDetails.end_date});
                this.mileStoneFormGroup.patchValue({ project_duration: this.proAllDetails.project_duration});
            },
            error => {
                this.alertService.error(error);
            });
    }

}