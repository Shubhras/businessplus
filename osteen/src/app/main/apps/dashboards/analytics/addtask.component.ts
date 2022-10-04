import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {AddTaskEventDialog} from './task-events/addtaskevents.component'
@Component({
    selector: 'add-task-overview-dialog',
    templateUrl: 'addtask.component.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddTaskOverviewDialog {
    minDate = new Date();
    // maxDate = new Date(2020, 0, 1);
    direction = 'row';
    AddtaskForm: FormGroup;
    taskDataPriorities: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    start_date: any;
    end_date: any;
    currentUser: any;
    user_id: number;
    login_access_token: string;
    unit_id: any;
    userListAllData: any;
    dataDepartment: any;
    viewProjectData: any;
    viewEventsData: any;
    companyFinancialYear: any;
    company_id: any;
    allDetailsCompany: any;
    userSelectedYear: any;
    EventFromShow: any;
    addeventMinus: any;
    AddTaskForm: FormGroup;
    addeventPlus: any;
    currentYear: any;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        // width: '70rem',
        //width: 'auto',
        placeholder: 'Enter text here...',
        translate: 'no',
        uploadUrl: 'v1/images', // if needed
        customClasses: [ // optional
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ]
    };
    currentYearSubscription: Subscription;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddTaskOverviewDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
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
        this.EventFromShow = false;
        this.addeventPlus = true;
        this.addeventMinus = false;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.login_access_token = this.currentUser.login_access_token;
        this.user_id = this.currentUser.data.id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        // Reactive AddtaskForm
        this.currentYear = new Date().getFullYear();
        this.AddtaskForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            user_id: [this.user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            task_name: ['', Validators.required],
            priority_id: ['', Validators.required],
            event_id: ['', Validators.required],
            department_id: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            task_owner_id: ['', Validators.required],
            assign_to: [''],
            reminder_frequency: ['', Validators.required],
            EventFromShow: this._formBuilder.array([this.createItem()])

        });
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
            this.viewEvents();
        });
        this.userLisetGet();
        this.SelectModuleGet();
        this.getDepartment();
    }
    ngOnDestroy(): void {
        this.currentYearSubscription.unsubscribe();
    }
    AddTaskSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddTaskForm.invalid) {
            return;
        }
        else {
            console.log('not true', this.AddTaskForm.value);
        }
        this.userService.addTaskEventChange(this.AddTaskForm.value).pipe(first()).subscribe(
            (data: any) => {

                if (data.status_code == 200) {

                    // this.viewEvents();
                    // console.log("kittu", this.viewEvents);

                    const storeUnitIdOld = this.currentUser.unit_id;
                    //let newUnitId = data.data.unit_id;
                    // const storeAllUnit = storeUnitIdOld.concat(',', newUnitId);
                    // this.currentUser.unit_id = storeAllUnit;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.alertService.success(data.message, true);
                    // this.dialogRef.close('YesSubmit');
                    this.addEventHide();
                    this.viewEvents();

                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    AddTaskPopupClose(): void {
        this.dialogRef.close();
    }
    AddTask() {
        if (this.EventFromShow == false) {
            this.AddtaskForm.removeControl('EventFromShow');
        }
        this.submitted = true;
        // stop here if AddtaskForm is invalid
        if (this.AddtaskForm.invalid) {
            return;
        }
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        this.AddtaskForm.value.start_date = latest_start_date;
        this.AddtaskForm.value.end_date = latest_end_date;
        // let dataFromKPI;
        // if (this.EventFromShow == true) {
        //     this.AddtaskForm.value.EventFromShow[0].event_id = this.AddtaskForm.value.event_id;
        //     dataFromKPI = this.AddtaskForm.value.EventFromShow[0]
        // }
        // else {
        //     dataFromKPI = '';
        // }
        // let allDataFrom = {
        //     "login_access_token": this.login_access_token,
        //     "company_id": this.company_id,
        //     "user_id": this.user_id,
        //     "unit_id": this.unit_id,
        //     "actionData": this.AddtaskForm.value,
        //     "kpData": dataFromKPI,
        // }
        this.userService.TaskAdd(this.AddtaskForm.value).pipe(first()).subscribe((data: any) => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
                this.MessageSuccess = data;
                this.alertService.success(this.MessageSuccess.message, true);
                this.dialogRef.close('YesSubmit');
            } else {
                this.MessageError = data;
            }
        },
            error => {
                this.alertService.error(error);
            });
    }
    createItem() {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.AddTaskForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id, Validators.required],
            event_name: [''],
            event_area: [''],
            event_objective: [''],
            event_description: [''],
            company_id: [company_id, Validators.required],


        });
    }
    addEventShow() {
        this.EventFromShow = true;
        this.addeventPlus = false;
        this.addeventMinus = true;
    }
    addEventHide() {
        this.EventFromShow = false;
        this.addeventPlus = true;
        this.addeventMinus = false;
    }
    // viewProjects() {
    //     let unit_id = this.unit_id;
    //     let selectedYear = this.userSelectedYear;
    //     let financialYear = this.companyFinancialYear;
    //     this.userService.ProjectsView(this.login_access_token, unit_id, selectedYear, financialYear).pipe(first()).subscribe(
    //         (data: any) => {
    //             this.viewProjectData = data.data;
    //         },
    //         error => {
    //             this.alertService.error(error);
    //         });
    // }
    viewEvents() {

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
    userLisetGet() {
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getAllUserList(this.login_access_token, role_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data;
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
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(this.login_access_token, unit_id,role_id, dept_id).pipe(first()).subscribe(
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