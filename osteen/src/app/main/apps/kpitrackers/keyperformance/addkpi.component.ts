import { Component, Inject } from '@angular/core';
import { MatDialogRef,MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { Subscription, Subject } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
//import * as _ from 'lodash';
//import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { log } from 'console';
import { AddsectioninitiativeComponent } from '../../strategic-obj/initiative-add/addsectioninitiative/addsectioninitiative.component';
@Component({
    selector: 'add-kpi-dialog',
    templateUrl: 'addkpi.component.html',
})
export class AddKpiDialog {
    direction = 'row';
    currentUser: any;
    login_access_token: string;
    unit_id: any;
    AddKpiForm: FormGroup;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataDepartment: any;
    dataSections: any;
    dataStraObj: any;
    initiativesData: any;
    actionPlansData: any;
    dataunitOfMeasur: any;
    currentYear: number;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    company_id: number;
    start_date: any;
    end_date: any;
    startDate2: any;
    endDate2: any
    minStartDate: any;
    addsectionPlus = true;
    addsectionMinus: boolean;
    showsectionplus = false;
    userModulePermission: any;
    sectionPermission: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    kpiDataFromStr: any;
    selected_dept_id: any;
    constructor(
        public dialogRef: MatDialogRef<AddKpiDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        private dataYearService: DataYearService,
        public datepipe: DatePipe,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    AddKpiPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.addsectionPlus = true;
        this.addsectionMinus = false;
        this.showsectionplus = false;
        this.kpiDataFromStr = this.data;
       
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
          if (this.userModulePermission[i].module_name == "Sections") {
            this.sectionPermission = this.userModulePermission[i];
          }
        }
        this.login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.currentUser.data.company_id;
        this.currentYear = new Date().getFullYear();
        // Reactive Form
        this.AddKpiForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            user_id: [this.currentUser.data.id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: ['', Validators.required],
            section_id: ['', Validators.required],
            s_o_id: [''],
            initiatives_id: [''],
            action_plan_id: [''],
            kpi_name: ['', Validators.required],
            kpi_definition: ['', Validators.required],
            ideal_trend: ['', Validators.required],
            unit_of_measurement: ['', Validators.required],
            target_condition: ['', Validators.required],
            lead_kpi: ['', Validators.required],
            kpi_performance: ['yes', Validators.required],
            frequency: ['', Validators.required],
            target_year: [this.currentYear],
            start_date: [''],
            end_date: [''],
            jan: ['', Validators.required],
            feb: ['',  Validators.required],
            mar: ['', Validators.required],
            apr: ['', Validators.required],
            may: ['', Validators.required],
            jun: ['', Validators.required],
            jul: ['', Validators.required],
            aug: ['', Validators.required],
            sep: ['', Validators.required],
            oct: ['', Validators.required],
            nov: ['', Validators.required],
            dec: ['', Validators.required],
        });
        this.departmentGet();
        this.unitOfMeasurementGet();
        // add kpi from Strategic Objectives page
        if (this.kpiDataFromStr) {
            this.AddKpiForm.patchValue({ department_id: this.kpiDataFromStr.dept_id });
            this.AddKpiForm.patchValue({ section_id: this.kpiDataFromStr.section_id });
            this.AddKpiForm.patchValue({ s_o_id: this.kpiDataFromStr.s_o_id });
            this.AddKpiForm.patchValue({ initiatives_id: this.kpiDataFromStr.initiatives_id });
            //this.mainMaxDtaeInit(this.kpiDataFromStr.actionPlansData.action_plan_id);
            this.AddKpiForm.patchValue({ action_plan_id: this.kpiDataFromStr.actionPlansData });
            //  console.log("kpi", test);

            this.sectionGet(this.kpiDataFromStr.dept_id);
            console.log("kpiiidata",  this.kpiDataFromStr.dept_id);
            
            this.strategicObjGet(this.kpiDataFromStr.dept_id);
            this.initiativesGet(this.kpiDataFromStr.s_o_id);
            this.actionPlansGet(this.kpiDataFromStr.initiatives_id);
        }
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
        });
    }
    ngOnDestroy(): void {
        this.currentYearSubscription.unsubscribe();
    }
    AddKpiSubmit() {
        this.submitted = true;
        // stop here if AddKpiForm is invalid
        if (this.AddKpiForm.invalid) {
            return;
        }
        //this.AddKpiForm.value.start_date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
        if (this.AddKpiForm.value.action_plan_id.length != 0
            && typeof this.AddKpiForm.value.action_plan_id[0] != 'number') {
            let ACTIONValue = [];
            this.AddKpiForm.value.action_plan_id.forEach(function (value) {
                ACTIONValue.push(value.action_plan_id);
            });
            this.AddKpiForm.value.action_plan_id = ACTIONValue;
        }

        this.AddKpiForm.value.start_date = "01-01-2020";
        if (this.companyFinancialYear == "april-march") {
            this.AddKpiForm.value.end_date = '31-03-' + (this.currentYear + 1);
        } else {
            this.AddKpiForm.value.end_date = '31-12-' + (this.currentYear);
        }
        this.userService.kpiAddSubmit(this.AddKpiForm.value).pipe(first()).subscribe(
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
    departmentGet() {
        this.userService.getDepartmentUnit(this.login_access_token, this.unit_id, this.currentUser.role_id, this.currentUser.dept_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    sectionGet(event: any) {
        this.selected_dept_id = event;
        if (this.selected_dept_id) {
            this.showsectionplus = true;
        }
        let dept_id = event;
        this.userService.getSection(this.login_access_token, dept_id, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataSections = data.data.sections;
                if (this.dataSections.length == 0) {
                    alert('No Section');
                  }
            },
            error => {
                this.alertService.error(error);
            });
    }

    addSectionShow(): void {
        this.addsectionPlus = false;
        this.addsectionMinus = true;
        const dialogRef = this.dialog.open(AddsectioninitiativeComponent,{
            data: {
                id: this.selected_dept_id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            // console.log(`Dialog result: ${this.selected_dept_id}`);
            console.log("popdata", result);
            this.addsectionPlus = true;
            this.addsectionMinus = false;

            if (result) {
                console.log("popdata1", result.data.dept_id);
                this.sectionGet(result.data.dept_id);
                this.addsectionPlus = true;
                this.addsectionMinus = false;
            }
        });
    }
    strategicObjGet(event: any) {
        let dept_id = event;
        this.userService.getStrategicObj(this.login_access_token, this.unit_id, dept_id, this.userSelectedYear, this.companyFinancialYear).pipe(first()).subscribe(
            (data: any) => {
                this.dataStraObj = data.data.strategic_objectives;
                if (this.dataStraObj.length == 0) {
                    alert('No Strategic Objective');
                  }
            },
            error => {
                this.alertService.error(error);
            });
    }
    initiativesGet(event: any) {
        let s_o_id = event;
        this.userService.getInitiatives(this.login_access_token, this.unit_id, s_o_id, this.userSelectedYear, this.companyFinancialYear).pipe(first()).subscribe(
            (data: any) => {
                this.initiativesData = data.data.initiatives;
                if (this.initiativesData.length == 0) {
                    alert('No Strategic Initiative');
                  }
            },
            error => {
                this.alertService.error(error);
            });
    }
    actionPlansGet(event: any) {
        let initiatives_id = event;
        this.userService.getActionPlans(this.login_access_token, this.unit_id, initiatives_id).pipe(first()).subscribe(
            (data: any) => {
                this.actionPlansData = data.data;
                if (this.actionPlansData.length == 0) {
                    alert('No Action Plan');
                  }
                this.mainMaxDtaeaction(this.kpiDataFromStr.actionPlansData);
            },
            error => {
                this.alertService.error(error);
            });
    }

    mainMaxDtaeaction(event: any) {
        this.start_date = '';
        this.end_date = '';
        const Initiative = this.actionPlansData.filter((Actionplan) => {
            return Actionplan.id === Number(event);
        });
        let startDate = Initiative[0].start_date.replace(/\-/gi, ",");
        this.startDate2 = Initiative[0].start_date;
        console.log("start", this.startDate2);

        this.minStartDate = new Date(startDate);
        let endDate = Initiative[0].end_date.replace(/\-/gi, ",");
        this.endDate2 = Initiative[0].end_date;
        console.log("dat", this.endDate2);

        // this.maxStartDate = new Date(endDate); //yy-mm-dd
        // this.datepickerDisable = false;
    }

    compareActionFn(v1: any, v2: any): boolean {
        return v1 === v2.action_plan_id;
    }
    unitOfMeasurementGet() {
        this.userService.getUnitOfMeasurement(this.login_access_token, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataunitOfMeasur = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    numberValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
}