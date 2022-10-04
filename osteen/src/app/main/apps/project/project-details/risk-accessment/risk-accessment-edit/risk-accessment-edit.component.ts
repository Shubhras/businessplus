import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'risk-accessment-edit',
    templateUrl: './risk-accessment-edit.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class RiskAccessmentEditComponent {
    direction = 'row';
    editRiskAccessmentForm: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    currentUser: any;
    unit_id: any;
    addRiskAccessmentError: any;
    private _unsubscribeAll: Subject<any>;
    project_id: any;
    risk_time_required: any;
    taskDataPriorities: any;
    proCompanyUser: any;
    selectedSearchUser: any;
    constructor(
        public dialogRef: MatDialogRef<RiskAccessmentEditComponent>,
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
        // Reactive editRiskAccessmentForm
        this.project_id = this.data.project_id;
        this.editRiskAccessmentForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            project_id: [this.project_id],
            id: [this.data.id],
            unit_id: [this.unit_id, Validators.required],
            risk_item: [this.data.risk_item, Validators.required],
            risk_time_required: [this.data.risk_time_required, Validators.required],
            risk_level: [this.data.risk_level, Validators.required],
            risk_responsibility: [this.data.risk_responsibility, Validators.required],
            risk_mtiqation_plan: [this.data.risk_mtiqation_plan, Validators.required],
            projectDetails: ['RiskAccessmentLog']
        });
        this.singleViewProjects();
        this.SelectModuleGet();
    }
    editRiskButton() {
        this.submitted = true;
        // stop here if editRiskAccessmentForm is invalid
        if (this.editRiskAccessmentForm.invalid) {
            return;
        }
        //   if (this.addRiskAccessmentError !== false) {
        //     return;
        //   }
        this.editRiskAccessmentForm.value.project_id = this.project_id;
        this.userService.ProjectUpdate(this.editRiskAccessmentForm.value).pipe(first()).subscribe(
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
 /*    companyUserSearch(value) {
        this.selectedSearchUser = this.searchCompanyUser(value);
      }
      // Filter the user list and send back to populate the selectedSearchUser**
      searchCompanyUser(value: string) {
        let filter = value.toLowerCase();
        return this.proCompanyUser.filter(option => option.name.toLowerCase().startsWith(filter));
      } */
}