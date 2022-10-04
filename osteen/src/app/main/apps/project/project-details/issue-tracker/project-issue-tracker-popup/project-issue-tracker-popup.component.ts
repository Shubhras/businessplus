import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'project-issue-tracker-popup',
    templateUrl: './project-issue-tracker-popup.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class ProjectIssueTrackerPopup {
   // minDate = new Date();
   minDate = new Date(2020, 0, 1);
    // maxDate = new Date(2020, 0, 1);
    direction = 'row';
    AddtaskForm: FormGroup;
    taskDataPriorities: any;
    submitted = false;
    message: any;
    MessageError: any;
    issue_start_date: any;
    issue_end_date: any;
    currentUser: any;
    unit_id: any;
    userListAllData: any;
    dataDepartment: any;
    project_id: any;
    private _unsubscribeAll: Subject<any>;
    selectedSearchUser: any;
    constructor(
        public dialogRef: MatDialogRef<ProjectIssueTrackerPopup>,
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
        // Reactive AddtaskForm
        this.AddtaskForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            project_id: [this.project_id],
            unit_id: [this.unit_id, Validators.required],
            issue_task_name: ['', Validators.required],
            issue_task_priority: ['', Validators.required],
            issue_task_dept: ['', Validators.required],
            issue_start_date: ['', Validators.required],
            issue_end_date: ['', Validators.required],
            issue_task_owner: ['', Validators.required],
            // issue_task_co_owner: "",
            // issue_remindr_freq: ['', Validators.required],
            projectDetails: ['projectIssueTracker']
        });
        this.singleViewProjects();
        this.SelectModuleGet();
        this.getDepartment();
    }
    AddTask() {
        this.submitted = true;
        // stop here if AddtaskForm is invalid
        if (this.AddtaskForm.invalid) {
            return;
        }
        let latest_issue_start_date = this.datepipe.transform(this.issue_start_date, 'dd/MM/yyyy');
        let latest_issue_end_date = this.datepipe.transform(this.issue_end_date, 'dd/MM/yyyy');
        //let latest_issue_task_co_owner =  (this.AddtaskForm.value.issue_task_co_owner).toString();

        this.AddtaskForm.value.issue_start_date = latest_issue_start_date;
        this.AddtaskForm.value.issue_end_date = latest_issue_end_date;
        // this.AddtaskForm.value.issue_task_co_owner = latest_issue_task_co_owner;
        this.userService.ProjectAdd(this.AddtaskForm.value).pipe(first()).subscribe((data: any) => {
            if (data.status_code == 200) {
                this.alertService.success(data.message, true);
                this.dialogRef.close('YesSubmit');
            } else {
                this.MessageError = data;
            }
        },
            error => {
                this.alertService.error(error);
            });
    }
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id =  this.project_id
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data.project_member_data;
                this.selectedSearchUser = this.userListAllData;
            },
            error => {
                this.alertService.error(error);
            });
    }
    companyUserSearch(value) {
        this.selectedSearchUser = this.searchCompanyUser(value);
      }
      // Filter the user list and send back to populate the selectedSearchUser**
      searchCompanyUser(value: string) {
        let filter = value.toLowerCase();
        return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
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
    getDepartment() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
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