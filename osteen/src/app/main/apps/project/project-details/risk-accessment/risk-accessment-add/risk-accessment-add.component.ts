import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'risk-accessment-add',
    templateUrl: './risk-accessment-add.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class RiskAccessmentAddComponent {
    direction = 'row';
    addRiskAccessmentForm: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    currentUser: any;
    unit_id: any;
    addRiskAccessmentError: any;
    taskDataPriorities: any;
    private _unsubscribeAll: Subject<any>;
    project_id: any;
    proCompanyUser: any;
    selectedSearchUser: any;
    constructor(
        public dialogRef: MatDialogRef<RiskAccessmentAddComponent>,
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
        // Reactive addRiskAccessmentForm
        this.addRiskAccessmentForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            project_id: [this.project_id],
            unit_id: [this.unit_id, Validators.required],
            risk_item: ['', Validators.required],
            risk_time_required: ['', Validators.required],
            risk_level: ['', Validators.required],
            risk_responsibility: ['', Validators.required],
            risk_mtiqation_plan: ['', Validators.required],
            projectDetails: ['RiskAccessmentLog']
        });
        this.singleViewProjects();
        this.SelectModuleGet();
    }
    addRiskButton() {
        this.submitted = true;
        // stop here if addRiskAccessmentForm is invalid
        if (this.addRiskAccessmentForm.invalid) {
            return;
        }
        //   if (this.addRiskAccessmentError !== false) {
        //     return;
        //   }
        this.addRiskAccessmentForm.value.project_id = this.project_id;
        this.userService.ProjectAdd(this.addRiskAccessmentForm.value).pipe(first()).subscribe(
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
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.taskDataPriorities = data.data.priorities;
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
                this.proCompanyUser = data.data.project_member_data;
                this.selectedSearchUser = this.proCompanyUser;
            },
            error => {
                this.alertService.error(error);
            });
    }
    /*     companyUserSearch(value) {
            this.selectedSearchUser = this.searchCompanyUser(value);
          }
          // Filter the user list and send back to populate the selectedSearchUser**
          searchCompanyUser(value: string) {
            let filter = value.toLowerCase();
            return this.proCompanyUser.filter(option => option.name.toLowerCase().startsWith(filter));
          } */
}