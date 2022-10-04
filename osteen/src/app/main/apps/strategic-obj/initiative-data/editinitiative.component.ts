import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import {trigger} from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
@Component({
    selector: 'edit-initiative-dialog',
    templateUrl: 'editinitiative.component.html',
    animations: fuseAnimations,      
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class EditInitiativeDialog {
    direction = 'row';
    minStartDate: any;
    maxStartDate: any;
    datepickerDisable: any;
    start_date: any;
    end_date: any;
    currentUser: any;
    company_id: number;
    unit_id: any;
    LoginUserDetails: any;
    editInitiativeGet: any;
    editInitiaForm: FormGroup;
    userrole: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataStraUnits: any;
    DataStraFunctions: any;
    userDepartment: any;
    dataDepartment: any;
    userSections: any;
    dataSections: any;
    strategicObj: any;
    dataStraObj: any;
    sections: any;
    definition: any;
    initiatives_id: any;
    s_o_id: any;
    dept_id: any;
    section_id: any;
    status: any;
    straObjStatus: any;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    startDate: any;
    startDate2: any;
    endDate2: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditInitiativeDialog>,
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

    editInitiativeClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        //this.datepickerDisable = true;
        this.editInitiativeGet = this.data;
        this.initiatives_id = this.editInitiativeGet.initiatives_id;
        this.definition = this.editInitiativeGet.definition;
        this.s_o_id = this.editInitiativeGet.s_o_id;
        this.dept_id = this.editInitiativeGet.dept_id;
        this.section_id = this.editInitiativeGet.section_id;
        this.start_date = this.editInitiativeGet.start_date;
        this.end_date = this.editInitiativeGet.end_date;
        this.status = this.editInitiativeGet.status_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
        let user_id = this.LoginUserDetails.id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        // Reactive Form
        this.editInitiaForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            initiatives_id: [this.initiatives_id, Validators.required],
            s_o_id: [this.s_o_id, Validators.required],
            definition: [this.definition, Validators.required],
            dept_id: [this.dept_id, Validators.required],
            section_id: [this.section_id, Validators.required],
            start_date: [this.start_date, Validators.required],
            end_date: [this.end_date, Validators.required],
            status: [this.status, Validators.required],
            comment: ['', Validators.required],
        });
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
        });
        this.departmentGetUnit();
        this.strategicObjGet(this.dept_id);
        this.sectionGet(this.dept_id);
        this.strObjStatusGet();

    }
    editInitiative() {
        this.submitted = true;
        // stop here if addInitiaForm is invalid
        if (this.editInitiaForm.invalid) {
            return;
        }
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        this.editInitiaForm.value.start_date = latest_start_date;
        this.editInitiaForm.value.end_date = latest_end_date;
        this.userService.initiativeEdit(this.editInitiaForm.value).pipe(first()).subscribe(data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
                this.MessageSuccess = data;
                this.alertService.success(this.MessageSuccess.message, true);
                this.dialogRef.close('YesSubmit');
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
        this.userService.getStrategicObj(login_access_token, unit_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
            data => {
                this.strategicObj = data;
                this.dataStraObj = this.strategicObj.data.strategic_objectives;
                this.mainMaxDtaeStrObj(this.s_o_id, 0);
            },
            error => {
                this.alertService.error(error);
            });
    }
    mainMaxDtaeStrObj(event: any, a) {
        if (a == 1) {
            this.start_date = '';
            this.end_date = '';
        }
        const strObj = this.dataStraObj.filter((strObj) => {
            return strObj.id === Number(event);
        });
        this.startDate = strObj[0].start_date.replace(/\-/gi, ",");
        this.startDate2 = strObj[0].start_date;
        this.minStartDate = new Date(this.startDate);
        this.startDate2 = this.datepipe.transform(this.minStartDate, 'dd-MM-yyyy');
        let endDate = strObj[0].end_date.replace(/\-/gi, ",");
        this.endDate2 = strObj[0].end_date;
        this.maxStartDate = new Date(endDate); //yy-mm-dd
        this.maxStartDate.setDate(this.maxStartDate.getDate() - 1);
        let tem_maxStartDate = this.maxStartDate;
        this.endDate2 = this.datepipe.transform(tem_maxStartDate, 'dd-MM-yyyy');
        this.datepickerDisable = false;
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
    sectionGet(event: any) {
        let dept_id = event;
        this.userService.getSectionDepartment(dept_id, this.company_id).pipe(first()).subscribe(
            data => {
                this.userSections = data;
                this.dataSections = this.userSections.data.sections;
            },
            error => {
                this.alertService.error(error);
            });
    }
    strObjStatusGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.straObjStatus = this.userrole.data;
                //console.log("zzzz", this.straObjStatus  );

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