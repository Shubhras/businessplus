import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
    selector: 'edit-hoshin',
    templateUrl: 'edithoshin.component.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class EditHoshin {
    direction = 'row';
    minDate = new Date();
    maxDate = new Date(2020, 0, 1);
    currentUser: any;
    unit_id: any;
    editActonDataGet: any;
    editActionForm: FormGroup;
    userrole: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataActionOwner: any;
    initiativesData: any;
    dataInitiatives: any;
    action_plan_definition: any;
    initiatives_id: any;
    kpi_id: any;
    s_o_id: any;
    dept_id: any;
    target: any;
    co_owner: any;
    start_date: any;
    end_date: any;
    control_point: any;
    status: any;
    straObjStatus: any;
    userDepartment: any;
    dataDepartment: any;
    strategicObj: any;
    dataStraObj: any;
    kpiData: any;
    kpiDataList: any;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditHoshin>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    editActionPlanClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.editActonDataGet = this.data;
        this.action_plan_definition = this.editActonDataGet.action_plan_definition;
        this.dept_id = this.editActonDataGet.dept_id;
        this.s_o_id = this.editActonDataGet.s_o_id;
        this.initiatives_id = this.editActonDataGet.initiatives_id;
        this.kpi_id = this.editActonDataGet.kpi_id;
        this.target = this.editActonDataGet.target;
        this.co_owner = this.editActonDataGet.co_owner;
        this.start_date = this.editActonDataGet.start_date;
        this.end_date = this.editActonDataGet.end_date;
        this.control_point = this.editActonDataGet.control_point;
        this.status = this.editActonDataGet.status_id;
        let user_id = this.editActonDataGet.user_id;
        let action_plan_id = this.editActonDataGet.action_plan_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.editActionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            action_plan_id: [action_plan_id, Validators.required],
            dept_id: [this.dept_id, Validators.required],
            s_o_id: [this.s_o_id, Validators.required],
            initiatives_id: [this.initiatives_id, Validators.required],
            kpi_id: [this.kpi_id, Validators.required],
            action_plan_definition: [this.action_plan_definition, Validators.required],
            target: [this.target, Validators.required],
            co_owner: [this.co_owner, Validators.required],
            start_date: [this.start_date, Validators.required],
            end_date: [this.end_date, Validators.required],
            control_point: [this.control_point, Validators.required],
            status: [this.status, Validators.required],
            comment: ['', Validators.required],
        });
        this.SelectModuleGet();
        this.strategicObjGet(this.dept_id);
        this.kpiGet(this.dept_id);
        this.initiativesGet(this.s_o_id);
        this.strObjStatusGet();
        this.departmentGetUnit();
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;

        });
    }
    departmentGetUnit() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
            data => {
                this.userDepartment = data;
                this.dataDepartment = this.userDepartment.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    actionPlanEdit() {
        this.submitted = true;
        // stop here if editActionForm is invalid
        if (this.editActionForm.invalid) {
            return;
        }
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        this.editActionForm.value.start_date = latest_start_date;
        this.editActionForm.value.end_date = latest_end_date;
        if (this.editActionForm.value.co_owner.length != 0
            && typeof this.editActionForm.value.co_owner[0] != 'number') {
            let co_ownerValue = [];
            this.editActionForm.value.co_owner.forEach(function (value) {
                co_ownerValue.push(value.id);
            });
            this.editActionForm.value.co_owner = co_ownerValue;
        }
        this.userService.editActionPlan(this.editActionForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.status_code = data;
                    if (this.status_code.status_code == 200) {
                        this.MessageSuccess = data;
                        this.alertService.success(this.MessageSuccess.message, true);
                        this.editActionPlanClose();
                    }
                    else {
                        this.MessageError = data;
                        this.alertService.error(this.MessageError.message, true);
                    }
                },
                error => {
                    this.alertService.error(error);

                });
    }
    strategicObjGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = event;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        this.userService.getStrategicObj(login_access_token, unit_id, dept_id,selectedYear,financialYear).pipe(first()).subscribe(
            data => {
                this.strategicObj = data;
                this.dataStraObj = this.strategicObj.data.strategic_objectives;
            },
            error => {
                this.alertService.error(error);
            });
    }
    initiativesGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let s_o_id = event;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        this.userService.getInitiatives(login_access_token, unit_id, s_o_id,selectedYear,financialYear).pipe(first()).subscribe(
            data => {
                this.initiativesData = data;
                this.dataInitiatives = this.initiativesData.data.initiatives;
            },
            error => {
                this.alertService.error(error);
            });
    }
    kpiGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = event;
        this.userService.getKpi(login_access_token, unit_id, dept_id).pipe(first()).subscribe(
            data => {
                this.kpiData = data;
                this.kpiDataList = this.kpiData.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.dataActionOwner = this.userrole.data.users;
                let co_owners = this.editActonDataGet.assign_action_plan_user.map((coowner) => {
                    return coowner.co_owner;
                })
                let co_owner = this.dataActionOwner.filter(user => {
                    return co_owners.indexOf(user.id) !== -1;
                })
                this.editActionForm.get('co_owner').setValue(co_owner);
            },
            error => {
                this.alertService.error(error);
            });
    }
    compareFn(v1: any, v2: any): boolean {
        return v1 === v2.id;
    }
    strObjStatusGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.straObjStatus = this.userrole.data.str_obj_statuses;
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