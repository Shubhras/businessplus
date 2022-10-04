import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';

@Component({
    selector: 'addkpi-next-year-dialog',
    templateUrl: 'addkpi-next-year.component.html',
})
export class AddKpiForNextYearDialog {
    direction = 'row';
    currentUser: any;
    unit_id: any;
    AddKpiForm: FormGroup;
    submitted = false;
    message: any;
    dataDepartment: any;
    dataSections: any;
    dataStraObj: any;
    initiativesData: any;
    actionPlansData: any;
    dataunitOfMeasur: any;
    currentYearSubscription: Subscription;
    currentYear: number;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    company_id:number;
    // Private
    private _unsubscribeAll: Subject<any>;
    kpiDataGet: any;
    constructor(
        public dialogRef: MatDialogRef<AddKpiForNextYearDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    AddKpiPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.kpiDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.currentUser.data.company_id
        this.currentYear = new Date().getFullYear();
        // Reactive Form
        this.AddKpiForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.currentUser.data.id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: [{ value: this.kpiDataGet.department_id, disabled: true }, Validators.required],
            section_id: [{ value: this.kpiDataGet.section_id, disabled: true }, Validators.required],
            s_o_id: [{ value: this.kpiDataGet.s_o_id, disabled: true }],
            initiatives_id: [{ value: this.kpiDataGet.initiatives_id, disabled: true }],
            action_plan_id: [{ value: this.kpiDataGet.action_plans, disabled: true }],
            kpi_id: [this.kpiDataGet.kpi_id],
            kpi_name: [{ value: this.kpiDataGet.kpi_name, disabled: true }, Validators.required],
            kpi_definition: [{ value: this.kpiDataGet.kpi_definition, disabled: true }, Validators.required],
            ideal_trend: [{ value: this.kpiDataGet.ideal_trend, disabled: true }, Validators.required],
            unit_of_measurement: [{ value: this.kpiDataGet.unit_of_measurement, disabled: true }, Validators.required],
            target_condition: [{ value: this.kpiDataGet.target_range_min, disabled: true }, Validators.required],
            lead_kpi: [{ value: this.kpiDataGet.lead_kpi, disabled: true }, Validators.required],
            kpi_performance: [{ value: this.kpiDataGet.kpi_performance, disabled: true }, Validators.required],
            frequency: [{ value: this.kpiDataGet.frequency, disabled: true }, Validators.required],
            target_year: [this.currentYear + 1],
            end_date: [''],
            jan: [null],
            feb: [null],
            mar: [null],
            apr: [null],
            may: [null],
            jun: [null],
            jul: [null],
            aug: [null],
            sep: [null],
            oct: [null],
            nov: [null],
            dec: [null],
        });
        this.departmentGet();
        this.sectionGet(this.kpiDataGet.department_id);
        this.strategicObjGet(this.kpiDataGet.department_id);
        this.initiativesGet(this.kpiDataGet.s_o_id);
        this.actionPlansGet(this.kpiDataGet.initiatives_id);
        this.unitOfMeasurementGet();
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
        if (this.companyFinancialYear == "april-march") {
            this.AddKpiForm.value.end_date = (this.currentYear + 2) + '-03-31';
        } else {
            //this.AddKpiForm.value.target_year = 2020;
            //this.AddKpiForm.value.kpi_end_date = 2020 + '-12-31';
            this.AddKpiForm.value.end_date = (this.currentYear + 1) + '-12-31';
        }
        // return;
        this.userService.kpiAddSubmit(this.AddKpiForm.value).pipe(first()).subscribe(
            (data: any) => {
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
    departmentGet() {
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
    sectionGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let dept_id = event;
        this.userService.getSection(login_access_token, dept_id,this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataSections = data.data.sections;
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
        this.userService.getInitiatives(login_access_token, unit_id, s_o_id, selectedYear, financialYear).pipe(first()).subscribe(
            (data: any) => {
                this.initiativesData = data.data.initiatives;
            },
            error => {
                this.alertService.error(error);
            });
    }
    actionPlansGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let initiatives_id = event;
        this.userService.getActionPlans(login_access_token, unit_id, initiatives_id).pipe(first()).subscribe(
            (data: any) => {
                this.actionPlansData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    compareActionFn(v1: any, v2: any): boolean {
        console.log('v1=>', v1, 'v2=>', v2)
        return v1 === v2.action_plan_id;
    }
    unitOfMeasurementGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getUnitOfMeasurement(login_access_token,this.company_id).pipe(first()).subscribe(
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
export interface DialogData {
    animal: string;
    name: string;
}