import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';

import { AddsectioninitiativeComponent } from './addsectioninitiative/addsectioninitiative.component';
@Component({
    selector: 'add-initiative-dialog',
    templateUrl: 'addinitiative.component.html',
    styleUrls: ['./addinitiative.component.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddInitiativeDialog {
    direction = 'row';
    minStartDate: any;
    maxStartDate: any;
    datepickerDisable: any;
    deptStrObjDisable: any;
    start_date: any;
    end_date: any;
    currentUser: any;
    company_id: number;
    unit_id: any; getStrOjeData: any;
    unitsData: any;
    userListAllData: any;
    AddSectionForm: FormGroup;
    SectionFromShow: any;
    addsectionPlus = true;
    addsectionMinus: boolean;
    LoginUserDetails: any;
    addInitiaForm: FormGroup;
    userrole: any;
    submitted = false;
    date = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataDepartment: any;
    userSections: any;
    dataSections: any;
    dataStraObj: any;
    sections: any;
    startDate2: any;
    endDate2: any;
    showStrDate = false;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;

    showsectionplus = false;
    // Private
    private _unsubscribeAll: Subject<any>;
    selected_dept_id: any;
    userModulePermission: any;
    sectionPermission: any;
    constructor(
        public dialogRef: MatDialogRef<AddInitiativeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    addInitiativeClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.showsectionplus = false;
        this.SectionFromShow = false;
        this.addsectionPlus = true;
        this.addsectionMinus = false;
        this.getStrOjeData = this.data;
        this.datepickerDisable = true;
        this.deptStrObjDisable = false;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
          if (this.userModulePermission[i].module_name == "Sections") {
            this.sectionPermission = this.userModulePermission[i];
          }
        }
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
        let user_id = this.LoginUserDetails.id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

        // Add Section Form
        this.AddSectionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: ['', Validators.required],
            dept_id: ['', Validators.required],
            section_name: ['', Validators.required],
            role_id: ['6', Validators.required],
            user_id: ['', Validators.required],
            enable: ['Yes', Validators.required],
        });
        //this.SelectModuleGet();
        // this.departmentGetUnit();
        this.userLisetGet();
        this.unitsGet()

        // Reactive Form
        this.addInitiaForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            dept_id: ['', Validators.required],
            s_o_id: ['', Validators.required],
            so_sno: [''],
            definition: ['', Validators.required],
            section_id: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
        });
        ;
        this.departmentGetUnit();
        // add Initive from strategic objective page
        if (this.getStrOjeData) {
            console.log('getStrOjeData',this.getStrOjeData);
            
            this.deptStrObjDisable = true; 
            this.addInitiaForm.patchValue({ dept_id: this.getStrOjeData.department_id });
            this.addInitiaForm.patchValue({ s_o_id: this.getStrOjeData.strategic_objectives_id });
            // this.addInitiaForm.value.so_sno = this.getStrOjeData.so_sno;
            // this.addInitiaForm.patchValue({ so_sno: this.getStrOjeData.so_sno });
            this.strategicObjGet(this.getStrOjeData.department_id);
            this.sectionGet(this.getStrOjeData.department_id);
            //this.mainMaxDtaeStrObj(this.getStrOjeData.strategic_objectives_id);
            let startDate = this.getStrOjeData.start_date.replace(/\-/gi, ",");
            this.minStartDate = new Date(startDate);
            let endDate = this.getStrOjeData.end_date.replace(/\-/gi, ",");
            this.maxStartDate = new Date(endDate); //yy-mm-dd
            this.datepickerDisable = false;
        }
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
        });
    }

    addInitiative() {
        this.submitted = true;
        // stop here if addInitiaForm is invalid
        console.log("this.addInitiaForm", this.addInitiaForm.value);
        
        if (this.addInitiaForm.invalid) {
            return;
        }
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd-MM-yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd-MM-yyyy');
        this.addInitiaForm.value.start_date = latest_start_date;
        this.addInitiaForm.value.end_date = latest_end_date; 
        this.userService.initiativeAdd(this.addInitiaForm.value).pipe(first()).subscribe(
            (data: any) => {
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
            (data: any) => {
                this.dataStraObj = data.data.strategic_objectives;
                console.log('dataStraObj',data);
                
                if (this.dataStraObj.length == 0) {
                    alert('No Strategic object');
                }
                this.mainMaxDtaeStrObj(this.getStrOjeData.strategic_objectives_id);
            },
            error => {
                this.alertService.error(error);
            });
    }
    mainMaxDtaeStrObj(event: any) {
        this.date = true;
        this.showStrDate = true;
        this.start_date = '';
        this.end_date = '';
        const strObj = this.dataStraObj.filter((strObj) => {
            return strObj.id === Number(event);
        });
        let startDate = strObj[0].start_date.replace(/\-/gi, ",");
        this.startDate2 = strObj[0].start_date;
        this.minStartDate = new Date(startDate);
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
            (data: any) => {
                this.dataDepartment = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }

    // addSectionShow() {
    //     this.SectionFromShow = true;
    //     this.addsectionPlus = false;
    //     this.addsectionMinus = true;
    // }
    // addSectionHide() {
    //     this.SectionFromShow = false;
    //     this.addsectionPlus = true;
    //     this.addsectionMinus = false;
    // }

    unitsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getUnitChange(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.unitsData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }

    userLisetGet() {
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    addSectionShow(): void {
        this.addsectionPlus = false;
        this.addsectionMinus = true;
        const dialogRef = this.dialog.open(AddsectioninitiativeComponent, {
            data: {
                id: this.selected_dept_id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.addsectionPlus = true;
            this.addsectionMinus = false;

            if (result) {
                this.sectionGet(result.data.dept_id);
                this.addsectionPlus = true;
                this.addsectionMinus = false;
            }
        });
    }
    // AddSectionSubmit() {
    //     this.submitted = true;
    //     // stop here if AddUnitForm is invalid
    //     if (this.AddSectionForm.invalid) {
    //         return;
    //     }
    //     this.userService.addSectionChange(this.AddSectionForm.value).pipe(first()).subscribe(
    //         (data: any) => {
    //             if (data.status_code == 200) {
    //                 this.alertService.success(data.message, true);
    //                 // this.dialogRef.close('YesSubmit');
    //                 this.addSectionHide();
    //             }
    //             else {
    //                 this.alertService.error(data.message, true);
    //             }
    //         },
    //         error => {
    //             this.alertService.error(error);
    //         });
    // }
    sectionGet(event: any) {
        this.selected_dept_id = event;
        if (this.selected_dept_id) {
            this.showsectionplus = true;
        }
        let dept_id = event;
        this.showStrDate = false;
        this.userService.getSectionDepartment(dept_id, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userSections = data;
                this.dataSections = this.userSections.data.sections;
                if (this.dataSections.length == 0) {
                    alert('No Section');
                }
                //this.dataSections = [...this.dataSections, { 'id': 0, 'section_name': "Not Applicable" }]
                //this.dataSections = this.dataSections.slice(1, 0, { 'id': 0, 'section_name': "Not Applicable" })
                // this.dataSections.unshift({ 'id': 0, 'section_name': "Not Applicable" });
            },
            error => {
                this.alertService.error(error);
            });
    }

    departmentGet(event: any) {
        let unit_id = event;
        let profile = 'section';
        this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
}
/* export interface DialogData {
  animal: string;
  name: string;
} */