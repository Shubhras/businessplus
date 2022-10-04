import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';

import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';
import { LeadkpiperformanceComponent } from './leadkpiperformance/leadkpiperformance.component';
export interface PeriodicElementStrength {
    sr_no: number;
    strength: string;
    keywords: string;
    action: string;
}
export interface PeriodicElementWeakness {
    sr_no: number;
    weaknesses: string;
    keywords: string;
    action: string;
}
export interface PeriodicElementOpportunity {
    sr_no: number;
    opportunities: string;
    keywords: string;
    action: string;
}
export interface PeriodicElementThreats {
    sr_no: number;
    threats: string;
    keywords: string;
    action: string;
}
@Component({
    selector: 'edit-strategic-dialog',
    templateUrl: 'editstrategic.component.html',
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

export class EditStrategicDialog {
    direction = 'row';
    //minDate = new Date();
    minDate = new Date(2019, 0, 1);
    maxDate = new Date(2020, 0, 1);
    currentUser: any;
    unit_id: any;
    EditStraDataGet: any;
    EditStraForm: FormGroup;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    dataDepartment: any;
    straObjStatus: any;
    dataunitOfMeasur: any;
    start_date: any;
    end_date: any;
    viewVision: any;
    viewMission: any;
    viewPriorityData: any;
    viewObjData: any;
    viewStrengthData: any;
    opportunityData: any;
    viewWeaknesData: any;
    viewThreatData: any;
    currentYearSubscription: Subscription;
    userSelectedYear: any;
    allDetailsCompany: any;
    companyFinancialYear: any;
    company_id: any;
    displayedColumnsStrength: string[] = ['sr_no', 'strength', 'keywords'];
    dataSourceStrength: any;
    displayedColumnsWeakness: string[] = ['sr_no', 'weaknesses', 'keywords'];
    dataSourceWeakness: any;
    displayedColumnsOpportunity: string[] = ['sr_no', 'opportunities', 'keywords'];
    dataSourceOpportunity: any;
    displayedColumnsThreats: string[] = ['sr_no', 'threats', 'keywords'];
    dataSourceThreats: any;
    // Private
    /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */

    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditStrategicDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        private dataYearService: DataYearService, private _fuseSidebarService: FuseSidebarService,

        private _fuseConfigService: FuseConfigService
    ) {

        // this._fuseConfigService.config = {
        //     layout: {
        //         navbar: {
        //             hidden: true
        //         },
        //         toolbar: {
        //             hidden: false
        //         },

        //         sidepanel: {
        //             hidden: true
        //         }
        //     }
        // };
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    ngOnInit(): void {
        this.EditStraDataGet = this.data;
        this.start_date = this.EditStraDataGet.start_date;
        this.end_date = this.EditStraDataGet.end_date;
        let user_id = this.EditStraDataGet.user_id;
        let strategic_objectives_id = this.EditStraDataGet.strategic_objectives_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        // Reactive Form
        this.EditStraForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [user_id, Validators.required],
            strategic_objectives_id: [strategic_objectives_id, Validators.required],
            target: ['', Validators.required],
            unit_of_measurement: ['', Validators.required],
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: ['', Validators.required],
            //tracking_frequency: ['', Validators.required],
            description: ['', Validators.required],
            status: ['', Validators.required],
            comment: ['', Validators.required],
        });

        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
            this.getDepartment();
            this.strObjStatusGet();
            this.unitOfMeasurementGet();
            this.viewVisionData();
            this.priorityGet();
            this.strengthsGet();
            this.objectiveGet();
            this.opportunityGet();
            this.weaknessGet();
            this.threatsGet();
        });
    }
    EditStrategicPopupClose(): void {
        this.dialogRef.close();
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: false
                },
                // toolbar: {
                //     hidden: true
                // },
            }
        };
    }
    performanceOpen(): void {
        // const dialogRef = this.dialog.open(PerformanceEditDialog, {
        //     //width: '450px',
        //     //height: '400px',
        //     //data: element
        // });
        const dialogRef = this.dialog.open(LeadkpiperformanceComponent, {
            // panelClass: 'leadperformance_size',
            // width: '450px',
            minWidth: '1350px',
            minHeight:'700px'
            // data: element
        });
        dialogRef.afterClosed().subscribe(result => {
        });

    }
    EditStrategicSubmit() {
        this.submitted = true;

        // stop here if EditStraForm is invalid
        if (this.EditStraForm.invalid) {
            return;
        }
        /*if (this.EditStraForm.value.department_id.length != 0
            && typeof this.EditStraForm.value.department_id[0] != 'number') {
               let departmentValue = [];
               this.EditStraForm.value.department_id.forEach(function (value) {
                departmentValue.push(value.id);
             });
            this.EditStraForm.value.department_id =departmentValue;
        }*/
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd/MM/yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd/MM/yyyy');
        this.EditStraForm.value.start_date = latest_start_date;
        this.EditStraForm.value.end_date = latest_end_date;
        this.userService.StrategicEditSubmit(this.EditStraForm.value).pipe(first()).subscribe(
            (data: any) => {
                this.status_code = data;
                if (this.status_code.status_code == 200) {
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.dialogRef.close('YesSubmit');
                    this._fuseConfigService.config = {
                        layout: {
                            navbar: {
                                hidden: false
                            },
                            // toolbar: {
                            //     hidden: true
                            // },
                        }
                    };
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
    getDepartment() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let dept_id = this.currentUser.dept_id;
        let role_id = this.currentUser.role_id;
        this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
            (data: any) => {
                // this.DataStraUnits = this.userrole.data.units;
                //this.DataStraFunctions = this.userrole.data.functions;
                this.dataDepartment = data.data;
                /*   this.EditStraDataGet.department_id = this.EditStraDataGet.department_masters.map((departmentTo: any) => {
                       return departmentTo.dept_id;
                   })
                   let department_id = this.DataStraDepartment.filter(department => {
                       return this.EditStraDataGet.department_id.indexOf(department.id) !== -1;
                   })
                   this.EditStraForm.get('department_id').setValue(department_id);*/
            },
            error => {
                this.alertService.error(error);
            });
    }
    strObjStatusGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
            (data: any) => {
                this.straObjStatus = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    /*compareFn(v1: any, v2: any): boolean {
        return v1 === v2.id;
    }*/
    unitOfMeasurementGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getUnitOfMeasurement(login_access_token, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataunitOfMeasur = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    viewVisionData() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.VisionDataView(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewVision = data.data.vision;
                this.viewMission = data.data.mission;
            },
            error => {
                this.alertService.error(error);
            });
    }
    priorityGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        this.userService.getBusinessPriority(login_access_token, selectedYear, financialYear, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewPriorityData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    objectiveGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        this.userService.getBusinessObj(login_access_token, selectedYear, financialYear, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewObjData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    strengthsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;
        this.userService.getStrengths(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewStrengthData = data.data;
                this.viewStrengthData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementStrength[] = this.viewStrengthData;
                this.dataSourceStrength = new MatTableDataSource<PeriodicElementStrength>(ELEMENT_DATA);
                console.log('this.dataSourceStrength', this.dataSourceStrength);
            },
            error => {
                this.alertService.error(error);
            });
    }
    opportunityGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;

        this.userService.getOpportunity(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.opportunityData = data.data;
                this.opportunityData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementOpportunity[] = this.opportunityData;
                this.dataSourceOpportunity = new MatTableDataSource<PeriodicElementOpportunity>(ELEMENT_DATA);
            },
            error => {
                this.alertService.error(error);
            });
    }
    weaknessGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;

        this.userService.getWeakness(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).
        subscribe(
            (data: any) => {
                this.viewWeaknesData = data.data;
                this.viewWeaknesData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementWeakness[] = this.viewWeaknesData;
                this.dataSourceWeakness = new MatTableDataSource<PeriodicElementWeakness>(ELEMENT_DATA);
            },
            error => {
                this.alertService.error(error);
            });
    }
    threatsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;

        this.userService.getThreats(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewThreatData = data.data;
                this.viewThreatData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementThreats[] = this.viewThreatData;
                this.dataSourceThreats = new MatTableDataSource<PeriodicElementThreats>(ELEMENT_DATA);
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
@Component({
    selector: 'performance-dialog',
    templateUrl: 'performance.component.html',
})
export class PerformanceEditDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PerformanceEditDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit(): void {
    }
    performanceClose(): void {
        this.dialogRef.close();
    }
}