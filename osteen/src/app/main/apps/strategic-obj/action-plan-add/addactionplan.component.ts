import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { Subscription } from 'rxjs';
import {trigger} from '@angular/animations';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
// import * as _ from 'underscore';
@Component({
    selector: 'add-action-plan-dialog',
    templateUrl: 'addactionplan.component.html',
    styleUrls: ['./addactionplan.component.scss'],
    animations: [
        trigger('animateStagger', [
        ])
      ],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddActionPlanDialog {
    direction = 'row';
    // selectedItems = [];
    dropdownSettings = {};

    minStartDate: any;
    maxStartDate: any;
    datepickerDisable: any;
    deptStrIniDisable: any;
    start_date: any;
    end_date: any;
    reminder_date: any;
    currentUser: any;
    login_access_token: string;
    unit_id: any;
    LoginUserDetails: any;
    addActionForm: FormGroup;
    userrole: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataActionOwner: [];
    dataActionOwnername: any;
    dataInitiatives: any;
    dataDepartment: any;
    dataSections: any;
    dataunitOfMeasur: any;
    dataStraObj: any;
    kpiData: any;
    kpiDataList: any;
    kpiFromShow: any;
    addKpiPlus: any;
    addKpiMinus: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    userSelectedYear: any;
    startDate2: any;
    endDate2: any;
    showInitDate = false;
    showInitDate2 = false;
    currentYearSubscription: Subscription;
    // linkedKPI:any;
    // Private
    private _unsubscribeAll: Subject<any>;
    getInitData: any;
    currentYear: number;
    company_id: any;
    user_id: any;
    testt = false;
    userModulePermission: any;
    kpiPermission: any;
    constructor(
        public dialogRef: MatDialogRef<AddActionPlanDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        private dataYearService: DataYearService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    addActionPlanClose(): void {
        this.dialogRef.close();
    }
    /*addKpiOpen(): void {
   let element = this.addActionForm.value.dept_id;
     if (element != '') {
         const dialogRef = this.dialog.open(AddKpiDialog, {
             data: element
         });
         dialogRef.afterClosed().subscribe(result => {
             this.kpiGet(element);
         });
     }
 }*/
    ngOnInit(): void {
        this.kpiFromShow = false;
        this.addKpiPlus = true;
        this.addKpiMinus = false;
        this.datepickerDisable = true;
        this.deptStrIniDisable = false;
        this.getInitData = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.login_access_token = this.currentUser.login_access_token;
        this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Add_kpis") {
              this.kpiPermission = this.userModulePermission[i];
            }
          }

        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.user_id = this.currentUser.data.id
        this.unit_id = localStorage.getItem('currentUnitId');
        this.company_id = this.currentUser.data.company_id;

        this.departmentGetUnit();
        this.unitOfMeasurementGet();
        this.currentYear = new Date().getFullYear();
        // Reactive Form

        this.addActionForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            company_id: [this.company_id, Validators.required],
            user_id: [this.user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            dept_id: ['', Validators.required],
            s_o_id: ['', Validators.required],
            init_sno:[''],
            initiatives_id: ['', Validators.required],
            kpi_id: [''],
            definition: ['', Validators.required],
            target: [''],
            co_owner: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            reminder_date: ['', Validators.required],
            control_point: ['', Validators.required],
            status: ['Blue'],
            kpiFromData: this._formBuilder.array([this.createItem()])
        });
        // add action plan from Initive page
        if (this.getInitData) {
            this.deptStrIniDisable = true;
            this.addActionForm.patchValue({ dept_id: this.getInitData.dept_id });
            this.addActionForm.patchValue({ s_o_id: this.getInitData.s_o_id });
            this.addActionForm.patchValue({ initiatives_id: this.getInitData.initiatives_id });
            this.addActionForm.patchValue({ initiatives_id: this.getInitData.initiatives_id }); 
            this.addActionForm.patchValue({ init_sno: this.getInitData.sr_no });
            this.strategicObjGet(this.getInitData.dept_id);
            this.SelectModuleGet(this.getInitData.dept_id);
            //this.mainMaxDtaeInit(this.getInitData.initiatives_id);
            this.kpiGet(this.getInitData.dept_id);
            this.sectionGet(this.getInitData.dept_id);
            this.initiativesGet(this.getInitData.s_o_id);

            // te.getDate() - 1);
            // let tem_maxStartDate = this.maxStartDate;
            // this.endDate2 = this.datepipe.transform(tem_maxStartDate, 'dd-MM-yyyy');

            let startDate = this.getInitData.start_date.replace(/\-/gi, ",");
            this.minStartDate = new Date(startDate);
            let tem_minStartDate = this.minStartDate;
            this.startDate2 = this.datepipe.transform(tem_minStartDate, 'dd-MM-yyyy');
            let endDate = this.getInitData.end_date.replace(/\-/gi, ",");
            this.maxStartDate = new Date(endDate); //yy-mm-dd
            this.maxStartDate.setDate(this.maxStartDate.getDate() - 1);
            let tem_maxStartDate = this.maxStartDate;
            this.endDate2 = this.datepipe.transform(tem_maxStartDate, 'dd-MM-yyyy');
            // this.endDate2 = this.maxStartDate;
            // let tem_maxStartDate = this.maxStartDate;
            this.datepickerDisable = false;
            this.showInitDate2 = true;
            this.showInitDate = false;
        }
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;

        });
    }
    createItem(): FormGroup {
        let start_date;
        let end_date
        //start_date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
        start_date = "01-01-2020";
        if (this.companyFinancialYear == "april-march") {
            end_date = '31-03-' + (this.currentYear + 1);
        } else {
            end_date = '31-12-' + (this.currentYear);
        }
        return this._formBuilder.group({
            login_access_token: [this.currentUser.login_access_token],
            user_id: [this.user_id],
            unit_id: [this.unit_id],
            department_id: [''],
            section_id: ['', Validators.required],
            kpi_name: ['', Validators.required],
            kpi_definition: ['', Validators.required],
            ideal_trend: ['', Validators.required],
            unit_of_measurement: ['', Validators.required],
            target_condition: ['', Validators.required],
            lead_kpi: ['', Validators.required],
            kpi_performance: ['', Validators.required],
            frequency: ['', Validators.required],
            target_year: [this.currentYear],
            start_date: [start_date],
            end_date: [end_date],
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
    }
    /* noLinkedKPI(kpi){
       if(kpi == ''){
           this.linkedKPI= true;
       }
       else{
           this.linkedKPI= false;
       }
   } */
    addKpiShow() {
        this.kpiFromShow = true;
        this.addKpiPlus = false;
        this.addKpiMinus = true;
    }
    addKpiHide() {
        this.kpiFromShow = false;
        this.addKpiPlus = true;
        this.addKpiMinus = false;
    }
    departmentGetUnit() {
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(this.login_access_token, unit_id,role_id , dept_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
                this.showInitDate = true;
            },
            error => {
                this.alertService.error(error);
            });
    }

    strategicObjGet(event: any) {
        this.SelectModuleGet(event);
        let unit_id = this.unit_id;
        let dept_id = event;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        this.userService.getStrategicObj(this.login_access_token, unit_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
            (data: any) => {
                // this.strategicObj = data;
                this.dataStraObj = data.data.strategic_objectives;
                if (this.dataStraObj.length == 0) {
                    alert('No Strategic object');
                }
                this.showInitDate = true;
            },
            error => {
                this.alertService.error(error);
            });
    }
    kpiGet(event: any) {
        let unit_id = this.unit_id;
        let dept_id = event;
        this.userService.getKpi(this.login_access_token, unit_id, dept_id).pipe(first()).subscribe(
            data => {
                this.kpiData = data;
                this.kpiDataList = this.kpiData.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    initiativesGet(event: any) {
        let unit_id = this.unit_id;
        let s_o_id = event;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        this.userService.getInitiatives(this.login_access_token, unit_id, s_o_id, selectedYear, financialYear).pipe(first()).subscribe(
            (data: any) => {
                this.dataInitiatives = data.data.initiatives;
                if (this.dataInitiatives.length == 0) {
                    alert('No Strategic Initiative');
                }
                this.showInitDate2 = true;
                this.mainMaxDtaeInit(this.dataInitiatives.id);
                this.showInitDate = false;
                // this.mainMaxDtaeInit(this.getInitData.initiatives_id);
            },
            error => {
                this.alertService.error(error);
            });
    }
    mainMaxDtaeInit(event: any) {
        this.start_date = '';
        this.end_date = '';
        this.showInitDate = true;

        if (this.showInitDate2 == true) {
            this.showInitDate = false;
            // this.showInitDate2 = false;
        }
        const Initiative = this.dataInitiatives.filter((Initiative) => {
            return Initiative.id === Number(event);
        });
        this.testt = true;
        let startDate = Initiative[0].start_date.replace(/\-/gi, ",");
        this.startDate2 = Initiative[0].start_date;
        this.minStartDate = new Date(startDate);
        this.startDate2 = this.datepipe.transform(this.minStartDate, 'dd-MM-yyyy');
        let endDate = Initiative[0].end_date.replace(/\-/gi, ",");
        this.endDate2 = Initiative[0].end_date;
        this.maxStartDate = new Date(endDate); //yy-mm-dd
        this.maxStartDate.setDate(this.maxStartDate.getDate() - 1);
        this.endDate2 = this.datepipe.transform(this.maxStartDate, 'dd-MM-yyyy');
        let tem_maxStartDate= this.maxStartDate;
        this.endDate2 = this.datepipe.transform(tem_maxStartDate, 'dd-MM-yyyy');
        this.datepickerDisable = false;
        // if(this.startDate2 != null)
        // {
        //     alert('selected')
        // }
    }


    SelectModuleGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let company_id = this.currentUser.data.company_id;
        let dept_id = event;
        this.userService.getdepartmentUser(login_access_token, unit_id, company_id, dept_id).pipe(first()).subscribe((data: any) => {
            this.dataActionOwner = data.data;
            console.log('hi' ,  this.dataActionOwner);
            // this.userService.GetSelectModule().pipe(first()).subscribe(
            //     (data: any) => {
            //         this.dataActionOwner = data.data.users;

            //   this.selectedItems = [
            //     { item_id: 3, item_text: 'Pune' },
            //     { item_id: 4, item_text: 'Navsari' }
            //   ];
              this.dropdownSettings = {
                singleSelection: false,
                idField: 'user_id',
                textField: 'name',
                selectAllText: 'Select All',
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 2,
                allowSearchFilter: true
              };


        },
            error => {
                this.alertService.error(error);
            });
    }
    // start use function for kpi
    sectionGet(event: any) {
        let dept_id = event;
        this.userService.getSection(this.login_access_token, dept_id, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataSections = data.data.sections;
            },
            error => {
                this.alertService.error(error);
            });
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
    // end use function for kpi
    addActionPlan() {
        if (this.kpiFromShow == false) {
            this.addActionForm.removeControl('kpiFromData');
        }
        this.submitted = true;
        // console.log("formdata", this.addActionForm.value.kpiFromData);
        
        // stop here if addActionForm is invalid
        if (this.addActionForm.invalid) {
            return;
        }
        if (this.addActionForm.value.kpi_id == "") {
            this.addActionForm.value.kpi_id = [];
        }
        
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        let latest_reminder_date = this.datepipe.transform(this.reminder_date, 'dd/MM/yyyy');
        this.addActionForm.value.start_date = latest_start_date;
        this.addActionForm.value.end_date = latest_end_date;
        this.addActionForm.value.reminder_date = latest_reminder_date;
        let dataFromKPI;
        if (this.kpiFromShow == true) {
            console.log("formdata", this.addActionForm.value.kpiFromData);
            
            this.addActionForm.value.kpiFromData[0].department_id = this.addActionForm.value.dept_id;
            dataFromKPI = this.addActionForm.value.kpiFromData[0]
        }
        else {
            dataFromKPI = '';
        }

        let co_ownerValue = [];
        this.addActionForm.value.co_owner.forEach(function (value) {
            co_ownerValue.push(value.user_id);
        });
        this.addActionForm.value.co_owner = co_ownerValue;

        let allDataFrom = {
            "login_access_token": this.login_access_token,
            "company_id": this.company_id,
            "user_id": this.user_id,
            "unit_id": this.unit_id,
            "actionData": this.addActionForm.value,
            "kpData": dataFromKPI,
        }  
//console.log('allDataFrom22',this.addActionForm.value.co_owner);


        this.userService.addActionPlans(allDataFrom).pipe(first()).subscribe(
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
test(){
    this.userService.kpiAddSubmit(this.addActionForm.value.kpiFromData).pipe(first()).subscribe(
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
    AddkpiSubmit() {

    }

    onItemSelect(item: any) {
        // console.log(item);
      }
      onSelectAll(items: any) {
        // console.log(items);
      }
      onItemDeSelect(item: any) {
        // console.log(item);
      }
}
/* export interface DialogData {
    animal: string;
    name: string;
}
@Component({
    selector: 'addkpi-dialog',
    templateUrl: 'addkpi.component.html',
})
export class AddKpiDialog implements OnInit {
    kpiData: any;
    direction = 'row';
    currentUser: any;
    unit_id:any;
    AddKpiForm: FormGroup;
    userrole: any;
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
    dept_id: any;
    constructor(
        public dialogRef: MatDialogRef<AddKpiDialog>,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        private _formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: User,
    ) { }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.kpiData = this.data;
        this.dept_id = this.kpiData;
        // Reactive Form
        this.AddKpiForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: [this.dept_id, Validators.required],
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
            kpi_performance: ['', Validators.required],
            frequency: ['', Validators.required],
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
        this.unitOfMeasurementGet();
        this.sectionGet(this.dept_id);
        this.strategicObjGet(this.dept_id);
    }
    AddKpiPopupClose(): void {
        this.dialogRef.close();
    }
    AddKpiSubmit() {
        this.submitted = true;
        // stop here if AddKpiForm is invalid
        if (this.AddKpiForm.invalid) {
            return;
        }
        this.userService.KpiAddSubmit(this.AddKpiForm.value).pipe(first()).subscribe(
            data => {
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
        this.userService.getDepartmentUnit(login_access_token, unit_id, dept_id).pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.dataDepartment = this.userrole.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    sectionGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let dept_id = event;
        this.userService.getSection(login_access_token, dept_id).pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.dataSections = this.userrole.data.sections;
            },
            error => {
                this.alertService.error(error);
            });
    }
    strategicObjGet(event: any) {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = event;
        this.userService.getStrategicObj(login_access_token, unit_id, dept_id).pipe(first()).subscribe(
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
        this.userService.getInitiatives(login_access_token, unit_id, s_o_id).pipe(first()).subscribe(
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
    unitOfMeasurementGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getUnitOfMeasurement(login_access_token).pipe(first()).subscribe(
            (data:any) => {
                this.userrole = data;
                this.dataunitOfMeasur = this.userrole.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
} */