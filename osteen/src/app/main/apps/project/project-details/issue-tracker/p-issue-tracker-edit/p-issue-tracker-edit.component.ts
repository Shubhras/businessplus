import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
@Component({
  selector: 'app-p-issue-tracker-edit',
  templateUrl: './p-issue-tracker-edit.component.html',
  styleUrls: ['./p-issue-tracker-edit.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class PIssueTrackerEditComponent implements OnInit {
  minDate = new Date();
  issue_start_date: any;
  issue_end_date: any;
  userListAllData: any;
  direction = 'row';
  dataDepartment: any;
  submitted = false;
  editIssueFormGroup: FormGroup;
  currentUser: any;
  unit_id: any;
  proAllDetails: any;
  project_id: any;
  projectDetails: any;
  taskDataPriorities: any;
  issue_id: any;
  issue_remindr_freq: any;
  selectedSearchUser: any;
  constructor(
    public dialogRef: MatDialogRef<PIssueTrackerEditComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,

  ) { }

  ngOnInit() {
    console.log('', this.data);
    this.project_id = this.data.project_id;
    this.issue_id = this.data.id;
    this.issue_start_date = this.data.issue_start_date;
    this.issue_end_date = this.data.issue_end_date;
    let coOwnerIds = this.data.issue_task_co_ownwer_value.map(co_owner_val => co_owner_val.co_owner_id);
    this.issue_remindr_freq = this.data.issue_remindr_freq;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.editIssueFormGroup = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      project_id: [this.project_id],
      issue_id: [this.issue_id],
      issue_task_name: [this.data.issue_task_name, Validators.required],
      issue_task_priority: [this.data.issue_task_priority, Validators.required],
     // issue_task_dept: [parseInt(this.data.issue_task_dept), Validators.required],
     issue_task_dept: [this.data.issue_task_dept, Validators.required],
      issue_start_date: [this.issue_start_date, Validators.required],
      issue_end_date: [this.issue_end_date, Validators.required],
      issue_task_owner: [parseInt(this.data.issue_task_owner), Validators.required],
      issue_task_reason: [this.data.issue_task_reason, Validators.required],
      //issue_task_co_owner: [coOwnerIds, Validators.required],
      //issue_remindr_freq: [this.issue_remindr_freq, Validators.required],
      projectDetails: ['projectIssueTracker']
    });
    this.SelectModuleGet();
    this.getDepartment();
    this.singleViewProjects();
  }
  PopupClose(): void {
    this.dialogRef.close();
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
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data.project_member_data;
        this.selectedSearchUser = this.userListAllData;
      },
      error => {
        this.alertService.error(error);
      });
  }
/*   companyUserSearch(value) {
    this.selectedSearchUser = this.searchCompanyUser(value);
  }
  // Filter the user list and send back to populate the selectedSearchUser**
  searchCompanyUser(value: string) {
    let filter = value.toLowerCase();
    return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
  } */
  EditIssueTaskSubmit() {
    this.submitted = true;
    if (this.editIssueFormGroup.invalid) {
      return;
    }
  /*   console.log(this.editIssueFormGroup.value);
    return; */
   /*  this.editIssueFormGroup.value.issue_task_co_owner = (this.editIssueFormGroup.value.issue_task_co_owner).toString(); */
    let latest_start_date = this.datepipe.transform(this.issue_start_date, 'dd/MM/yyyy');
    let latest_end_date = this.datepipe.transform(this.issue_end_date, 'dd/MM/yyyy');
    this.editIssueFormGroup.value.issue_start_date = latest_start_date
    this.editIssueFormGroup.value.issue_end_date = latest_end_date
    this.userService.ProjectUpdate(this.editIssueFormGroup.value).pipe(first()).subscribe(
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
