import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common'
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'edit-task-overview-dialog',
    templateUrl: 'edittask.component.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})

export class EditTaskOverviewDialog {
    // minDate = new Date();
    direction = 'row';
    dataEdit: any;
    edittaskForm: FormGroup;
    currentUser: any;
    user_id: string;
    login_access_token: string;
    unit_id: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataPriorities: any;
    DataStatus: any;
    start_date: any;
    end_date: any;
    dataDepartment: any;
    viewProjectData: any;
    userListAllData: any;
    companyFinancialYear: any;
    allDetailsCompany: any;
    userSelectedYear: any;
    viewEventsData: any;
    company_id: any;
    currentYearSubscription: Subscription;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditTaskOverviewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    PopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.dataEdit = this.data;
        console.log("test event id", this.dataEdit);
        console.log("test event id", this.dataEdit.events_id);


        this.start_date = this.dataEdit.start_date;
        this.end_date = this.dataEdit.end_date;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        this.login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;

        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        // Reactive edittaskForm
        this.edittaskForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            task_id: [this.dataEdit.tasks_id, Validators.required],
            user_id: [this.user_id, Validators.required],
            task_name: [this.dataEdit.task_name, Validators.required],
            priority_id: [this.dataEdit.priority_id, Validators.required],
            event_id: [this.dataEdit.event_id, Validators.required],
            department_id: [this.dataEdit.department_master_id, Validators.required],
            start_date: [this.start_date, Validators.required],
            end_date: [this.end_date, Validators.required],
            status_id: [this.dataEdit.status_id, Validators.required],
            task_owner_id: [this.dataEdit.task_owner_id, Validators.required],
            assign_to: ['', Validators.required],
            reminder_frequency: [this.dataEdit.reminder_frequency, Validators.required],
        });
        let memberSet = [];
        this.dataEdit.task_assigns_data.forEach(function (value) {
            memberSet.push(value.user_id);
        });
        // set member for disable and selected member
        this.edittaskForm.get('assign_to').setValue(memberSet)
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
            this.viewEvents();
            //this.viewProjects();
        });
        this.userLisetGet();
        this.SelectModuleGet();
        this.getDepartment();
    }
    ngOnDestroy(): void {
        this.currentYearSubscription.unsubscribe();
    }
    EditTask() {
        this.submitted = true;
        // stop here if edittaskForm is invalid
        if (this.edittaskForm.invalid) {
            return;
        }
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        this.edittaskForm.value.start_date = latest_start_date;
        this.edittaskForm.value.end_date = latest_end_date;
        /* if (this.edittaskForm.value.assign_to.length != 0
            && typeof this.edittaskForm.value.assign_to[0] != 'number') {
                console.log(this.edittaskForm.value,'22222')
            let assignValue = [];
            this.edittaskForm.value.assign_to.forEach(function (value) {
                assignValue.push(value.id);
            });
            this.edittaskForm.value.assign_to = assignValue;
        } */
        this.userService.TaskEdit(this.edittaskForm.value).pipe(first()).subscribe(
            (data: any) => {
                this.status_code = data;
                if (this.status_code.status_code == 200) {
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.dialogRef.close('YesSubmit');
                }
                else {
                    this.MessageError = data;
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    viewEvents() {
        // let company_id = this.currentUser.data.company_id;


        this.userService.viewTaskEventChange(this.login_access_token, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewEventsData = data.data;
                console.log("Dataa", this.viewEventsData);
            },
            error => {
                this.alertService.error(error);
            }

        );
    }
    // viewProjects() {
    //     this.userService.ProjectsView(this.login_access_token, this.unit_id, this.userSelectedYear, this.companyFinancialYear).pipe(first()).subscribe(
    //         (data: any) => {
    //             this.viewProjectData = data.data;
    //         },
    //         error => {
    //             this.alertService.error(error);
    //         });
    // }
    userLisetGet() {
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getAllUserList(this.login_access_token, role_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data;
                /*    this.dataEdit.assign_to = this.dataEdit.task_assigns_data.map((assignTo: any) => {
                       return assignTo.user_id;
                   })
                   let assign_to = this.userListAllData.filter(user => {
                       return this.dataEdit.assign_to.indexOf(user.user_id) !== -1;
                   })
                   this.edittaskForm.get('assign_to').setValue(assign_to); */
            },
            error => {
                this.alertService.error(error);
            });
    }
    /*  compareFn(v1: any, v2: any): boolean {
         return v1 === v2.user_id;
     } */
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.DataPriorities = data.data.priorities;
                this.DataStatus = data.data.status;
            },
            error => {
                this.alertService.error(error);
            });
    }
    getDepartment() {
        this.userService.getDepartmentUnit(this.login_access_token, this.unit_id,this.currentUser.role_id, this.currentUser.dept_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
}
