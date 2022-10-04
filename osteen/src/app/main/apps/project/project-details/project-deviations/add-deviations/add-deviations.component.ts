import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
    selector: 'add-deviations',
    templateUrl: './add-deviations.html',
    styleUrls: ['./add-deviations.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddDeviationsComponent {
   // minDate = new Date();
   minDate = new Date(2020, 0, 1);
    direction = 'row';
    selectedFile: File = null;
    deviationsFormGroup: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    issue_start_date: any;
    issue_end_date: any;
    currentUser: any;
    unit_id: any;
    private _unsubscribeAll: Subject<any>;
    company_id: any;
    project_id: any;
    userListAllData: any;
    dataDepartment: any;
    taskDataPriorities: any;
    selectedSearchUser: any;
    constructor(
        public dialogRef: MatDialogRef<AddDeviationsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    // Receive user input and send to search method**

    PopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.company_id = this.currentUser.data.company_id;
        this.project_id = this.data;
        // Reactive deviationsFormGroup
        this.deviationsFormGroup = this._formBuilder.group({
            company_id: [this.company_id, Validators.required],
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            project_id: this.project_id,
            deviation_name: ['', Validators.required],
            deviation_region: ['', Validators.required],
            deviation_risk: ['', Validators.required],
            deviation_start_date: ['', Validators.required],
            deviation_end_date: ['', Validators.required],
            deviation_qty: ['', Validators.required],
            deviation_dept: ['', Validators.required],
            deviation_aprove_usr: ['', Validators.required],
            upload_id: [''],
            projectDetails: ['projectDeviation'],
        });
        this.userLisetGet();
        this.SelectModuleGet();
        this.getDepartment();
    }
    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }
    userLisetGet() {
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.company_id;
        this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data;
                this.selectedSearchUser = this.userListAllData;
            },
            error => {
                this.alertService.error(error);
            });
    }
    // Receive user input and send to search method**
    /*   companyUserSearch(value) {
        this.selectedSearchUser = this.searchCompanyUser(value);
      }
      // Filter the user list and send back to populate the selectedSearchUser**
      searchCompanyUser(value: string) {
        let filter = value.toLowerCase();
        return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
      } */
    addDeviations() {
        this.submitted = true;
        // stop here if deviationsFormGroup is invalid
        if (this.deviationsFormGroup.invalid) {
            return;
        }
        const fd = new FormData();
        if (this.selectedFile != undefined) {
            fd.append('upload_id', this.selectedFile, this.selectedFile.name);
        }
        else {
            fd.append('upload_id', this.deviationsFormGroup.value.upload_id);
        }
        fd.append('login_access_token', this.deviationsFormGroup.value.login_access_token);
        fd.append('project_id', this.deviationsFormGroup.value.project_id);
        fd.append('deviation_name', this.deviationsFormGroup.value.deviation_name);
        fd.append('deviation_region', this.deviationsFormGroup.value.deviation_region);
        fd.append('deviation_risk', this.deviationsFormGroup.value.deviation_risk);

        let latest_deviation_start_date = this.datepipe.transform(this.deviationsFormGroup.value.deviation_start_date, 'dd-MM-yyyy');
        fd.append('deviation_start_date', latest_deviation_start_date);
        let latest_deviation_end_date = this.datepipe.transform(this.deviationsFormGroup.value.deviation_end_date, 'dd-MM-yyyy');

        fd.append('deviation_end_date', latest_deviation_end_date);
        fd.append('deviation_qty', this.deviationsFormGroup.value.deviation_qty);
        fd.append('deviation_dept', this.deviationsFormGroup.value.deviation_dept);
        fd.append('deviation_aprove_usr', this.deviationsFormGroup.value.deviation_aprove_usr);
        fd.append('projectDetails', this.deviationsFormGroup.value.projectDetails);
        this.userService.ProjectAdd(fd).pipe(first()).subscribe((data: any) => {
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