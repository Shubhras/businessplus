import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
    selector: 'edit-kpi-dialog',
    templateUrl: 'editkpi.component.html',
})
export class EditKpiDialog {
    direction = 'row';
    currentUser: any;
    unit_id: any;
    EditDataGet: any;
    EditKpiForm: FormGroup;
    userrole: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataEditUnits: any;
    dataEditDepartment: any;
    dataEditSection: any;
    dataStraObj: any;
    initiativesData: any;
    actionPlansData: any;
    dataunitOfMeasur: any;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    company_id:number;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditKpiDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    EditKpiPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        console.log("editkpi", this.EditDataGet);
        
        let user_id = this.EditDataGet.user_id;
        let kpi_id = this.EditDataGet.kpi_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.currentUser.data.company_id;
        // Reactive Form
        this.EditKpiForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [user_id, Validators.required],
            kpi_id: [kpi_id, Validators.required],
            kpi_name: [this.EditDataGet.kpi_name, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: [this.EditDataGet.department_id, Validators.required],
            section_id: [this.EditDataGet.section_id, Validators.required],
            s_o_id: [this.EditDataGet.s_o_id],
            initiatives_id: [this.EditDataGet.initiatives_id],
            action_plan_id: [this.EditDataGet.action_plans],
            ideal_trend: [this.EditDataGet.ideal_trend, Validators.required],
            unit_of_measurement: [this.EditDataGet.unit_of_measurement, Validators.required],
            target_range_min: [this.EditDataGet.target_range_min, Validators.required],
            target_condition: [this.EditDataGet.target_condition, Validators.required],
            kpi_definition: [this.EditDataGet.kpi_definition, Validators.required],
            lead_kpi: [this.EditDataGet.lead_kpi, Validators.required],
            kpi_performance: [this.EditDataGet.kpi_performance, Validators.required],
            frequency: [this.EditDataGet.frequency, Validators.required],
        });
        this.departmentGet();
        this.sectionGet(this.EditDataGet.department_id);
        this.strategicObjGet(this.EditDataGet.department_id);
        this.initiativesGet(this.EditDataGet.s_o_id);
        this.actionPlansGet(this.EditDataGet.initiatives_id);
        this.unitOfMeasurementGet();
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
        });
    }
    editKpiSubmit() {
        this.submitted = true;
        console.log('nagar',this.EditKpiForm);
        // return;
        // stop here if EditKpiForm is invalid
        if (this.EditKpiForm.invalid) {
           
            return;
        }
        console.log('nagar',this.EditKpiForm.value);

        if (this.EditKpiForm.value.action_plan_id.length != 0
            && typeof this.EditKpiForm.value.action_plan_id[0] != 'number') {
            let ACTIONValue = [];
            this.EditKpiForm.value.action_plan_id.forEach(function (value) {
                ACTIONValue.push(value.action_plan_id);
                
            });
            console.log("ACTIONValue", ACTIONValue);
            this.EditKpiForm.value.action_plan_id = ACTIONValue;
        }
        this.userService.KpiEditSubmit(this.EditKpiForm.value).pipe(first()).subscribe(
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
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.dataEditDepartment = this.userrole.data;
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
                this.dataEditSection = data.data.sections;
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
        this.userService.getInitiatives(login_access_token, unit_id, s_o_id, financialYear, financialYear).pipe(first()).subscribe(
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
                let actionData = this.EditDataGet.action_plans.map((ActionId) => {
                    return ActionId.action_plan_id;
                });
                let ActionPlan = this.actionPlansData.filter(action => {
                    return actionData.indexOf(action.action_plan_id) !== -1;
                });
                this.EditKpiForm.get('action_plan_id').setValue(ActionPlan);
            },
            error => {
                this.alertService.error(error);
            });
    }
    compareActionFn(v1: any, v2: any): boolean {
        return v1 === v2.action_plan_id;
    }
    unitOfMeasurementGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getUnitOfMeasurement(login_access_token,this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userrole = data;
                this.dataunitOfMeasur = this.userrole.data;
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