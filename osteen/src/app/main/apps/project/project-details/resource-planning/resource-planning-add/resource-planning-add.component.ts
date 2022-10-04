import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'resource-planning-add',
    templateUrl: './resource-planning-add.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ResourcePlanningAddComponent {
    direction = 'row';
    addRiskAccessmentForm: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    currentUser: any;
    unit_id: any;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<ResourcePlanningAddComponent>,
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
        // Reactive addRiskAccessmentForm
        this.addRiskAccessmentForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            project_id: [this.data],
            unit_id: [this.unit_id, Validators.required],
            risk_item: ['', Validators.required],
            time_required: ['', Validators.required],
            risk_level: ['', Validators.required],
            responsibility: ['', Validators.required],
            mitigation_plan: ['', Validators.required],
            projectDetails: ['projectIssueTracker']
        });
    }
    addRiskAccessment() {
        this.submitted = true;
        // stop here if addRiskAccessmentForm is invalid
        if (this.addRiskAccessmentForm.invalid) {
            return;
        }
        console.log(this.addRiskAccessmentForm.value);
        return;
    }
}