import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
import { AddStrengths } from 'app/main/apps/strategic-obj/swot-analysis/addstrengths.component';
import { EditStrengths } from 'app/main/apps/strategic-obj/swot-analysis/editstrengths.component';
import { AddWeakness } from 'app/main/apps/strategic-obj/swot-analysis/addweaknesses.component';
import { EditWeakness } from 'app/main/apps/strategic-obj/swot-analysis/editweaknesses.component';
import { AddOpportunities } from 'app/main/apps/strategic-obj/swot-analysis/addopportunities.component';
import { EditOpportunities } from 'app/main/apps/strategic-obj/swot-analysis/editopportunities.component';
import { AddThreats } from 'app/main/apps/strategic-obj/swot-analysis/addthreats.component';
import { EditThreats } from 'app/main/apps/strategic-obj/swot-analysis/editthreats.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
import {trigger} from '@angular/animations';
import { LeadkpiperformanceComponent } from './leadkpiperformance/leadkpiperformance.component';
@Component({
    selector: 'add-strategic-dialog',
    templateUrl: 'addstrategic.component.html',
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
export class AddStrategicDialog {
    AddDeptForm: FormGroup;
    addUomForm: FormGroup;
    [x: string]: any;
    direction = 'row';
    //minDate = new Date();
    minDate = new Date();
    SprUsr: number;
    //maxDate = new Date(2020, 0, 1);
    currentUser: any;
    unit_id: any;
    user_id: any;
    login_access_token:any;
    AddStraForm: FormGroup;
    submitted = false;
    message: any;
    //MessageSuccess: any;
    //MessageError: any;
    dataDepartment: any;
    DepartmentFromShow: any;
    UnitFromShow: any;
    adddepartmentPlus: any;
    addunitPlus: any;
    adddepartmentMinus: any;
    addunitMinus: any;
    userListAllData: any;
    unitsData: any;
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
    swotPermission: any;
    deptPermisiion: any;
    userModulePermission: any;
    buttonDisabled: boolean;
    displayedColumnsStrength: string[] = ['sr_no', 'strength', 'keywords', 'action'];
    dataSourceStrength: any;
    displayedColumns: string[] = ['sr_no', 'weaknesses', 'keywords', 'action'];
    dataSource: any;
    displayedColumnsOpportunity: string[] = ['sr_no', 'opportunities', 'keywords', 'action'];
    dataSourceOpportunity: any;
    displayedColumnsThreats: string[] = ['sr_no', 'threats', 'keywords', 'action'];
    dataSourceThreats: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddStrategicDialog>,
        private confirmationDialogService: ConfirmationDialogService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        private dataYearService: DataYearService,
        private _fuseConfigService: FuseConfigService,

    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));

        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Swot_analyses") {
                this.swotPermission = this.userModulePermission[i];
            }
            if (this.userModulePermission[i].module_name == "Department_masters") {
                this.deptPermisiion = this.userModulePermission[i]; 
            }
        }
        
        this.DepartmentFromShow = false;
        this.UnitFromShow = false;
        this.adddepartmentPlus = true;
        this.addunitPlus = true;
        this.adddepartmentMinus = false;
        this.addunitMinus = false;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.login_access_token = login_access_token;
        this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'))
        this.SprUsr = this.LoginUserDetails.id;
        this.user_id = this.currentUser.data.id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.allDetailsCompany.general_data[0].company_id;

        // Add Unit Form
        let company_id = this.currentUser.data.company_id;
        this.addUomForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            name: ['', Validators.required]
        });
        //Add Department Form
        this.AddDeptForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            SprUsr: [this.SprUsr, Validators.required],
            unit_id: ['', Validators.required],
            company_id: [this.company_id, Validators.required],
            dept_name: ['', Validators.required],
            role_id: ['4', Validators.required],
            user_id: ['', Validators.required],
        });
        this.userLisetGet();
        this.unitsGet();
        // Reactive Form
        this.AddStraForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            target: ['', Validators.required],
            unit_of_measurement: [''], //Validators.required
            start_date: ['', Validators.required],
            end_date: ['', Validators.required],
            user_id: [this.user_id, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            department_id: ['', Validators.required],
            //tracking_frequency: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
            this.userSelectedYear = messageYear;
            this.getDepartment();
            this.unitOfMeasurementGet();
            this.viewVisionData();
            this.priorityGet();
            this.strengthsGet();
            this.objectiveGet();
            // this.CreateSoSno(this.company_id,this.unit_id, login_access_token);
            this.opportunityGet();
            this.weaknessGet();
            this.threatsGet();
        });
    }
    ngOnDestroy(): void {
        this.currentYearSubscription.unsubscribe();
    }

    disableButton() {
        let currentYear = this.userSelectedYear;
        if (this.companyFinancialYear == 'april-march') {
            let currentFullDate = new Date(); //Year, Month, Date
            let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
            let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
            if (currentFullDate.getTime() >= dateOne.getTime() && currentFullDate.getTime() <= dateTwo.getTime()) {
                this.buttonDisabled = false;
            } else {
                this.buttonDisabled = true;
            }
        } else {
            if (this.userSelectedYear == currentYear) {
                this.buttonDisabled = false;
            } else {
                this.buttonDisabled = true;
            }
        }
    }

    AddStrategicPopupClose(): void {
        this.dialogRef.close();
    }
    performanceOpen(): void {
        // const dialogRef = this.dialog.open(PerformanceDialog, {
        //     width: '450px',
        //     height: '400px',
        //     // data: element
        // });
        const dialogRef = this.dialog.open(LeadkpiperformanceComponent, {
            // panelClass: 'leadperformance_size',
            // width: '450px',
            minWidth: '800px',
            minHeight:'650px'
            // data: element
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    AddStrategicSubmit() {
        this.submitted = true;
        // stop here if AddStraForm is invalid
        if (this.AddStraForm.invalid) {
            return;
        }
        // console.log('formdata', this.AddStraForm.value.department_id.length);
        let latest_start_date = this.datepipe.transform(this.start_date, 'dd-MM-yyyy');
        let latest_end_date = this.datepipe.transform(this.end_date, 'dd-MM-yyyy');
        this.AddStraForm.value.start_date = latest_start_date;
        this.AddStraForm.value.end_date = latest_end_date;
        this.userService.strategicAddSubmit(this.AddStraForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                    this.CreateSoSno(this.company_id, this.unit_id, this.AddStraForm.value.department_id.length, this.AddStraForm.value.department_id, this.login_access_token);
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    CreateSoSno(company_id: any, unit_id:any, total_dept: any, dept_id: any, login_token:any) {

        this.userService.addSoSno(company_id, unit_id, total_dept, dept_id, login_token).pipe(first()).subscribe(
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
    addUomSubmit() {
        this.submitted = true;
        // stop here if addUomForm is invalid
        if (this.addUomForm.invalid) {
            return;
        }
        this.userService.addUomChange(this.addUomForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.status_code = data;
                    if (this.status_code.status_code == 200) {
                        this.MessageSuccess = data;
                        this.alertService.success(this.MessageSuccess.message, true);
                        this.unitOfMeasurementGet();
                        this.addUnitHide();
                        // this.dialogRef.close('YesSubmit');
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

    AddDeptSubmit() {

        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddDeptForm.invalid) {
            return;
        }
        // if (this.AddDeptForm.valid) {
        //     console.log('iii', this.AddDeptForm);
        //     return;
        // }
        this.userService.addDepartmentChange(this.AddDeptForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    const storeDeptIdOld = this.currentUser.dept_id;
                    let newDeptId = data.data.dept_id;
                    const storeAllDept = storeDeptIdOld.concat(',', newDeptId);
                    this.currentUser.dept_id = storeAllDept;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.alertService.success(data.message, true);
                    // this.dialogRef.close('YesSubmit');
                    this.getDepartment();
                    this.addDepartmentHide();
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
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
    addDepartmentShow() {
        this.DepartmentFromShow = true;
        this.adddepartmentPlus = false;
        this.adddepartmentMinus = true;
    }
    addDepartmentHide() {
        this.DepartmentFromShow = false;
        this.adddepartmentPlus = true;
        this.adddepartmentMinus = false;
    }

    addUnitShow() {
        this.UnitFromShow = true;
        this.addunitPlus = false;
        this.addunitMinus = true;
    }
    addUnitHide() {
        this.UnitFromShow = false;
        this.addunitPlus = true;
        this.addunitMinus = false;
    }

    getDepartment() {
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
    unitOfMeasurementGet() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.getUnitOfMeasurement(login_access_token, this.company_id).pipe(first()).subscribe(
            (data: any) => {
                this.dataunitOfMeasur = data.data;
                // this.dataunitOfMeasur.unshift({ 'uom_id': 0, 'uom_name': "Not Applicable" });
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
    addStrengthsOpen(): void {
        const dialogRef = this.dialog.open(AddStrengths);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.strengthsGet();
            }
        });
    }
    editStrengthsOpen(element): void {
        const dialogRef = this.dialog.open(EditStrengths, {
            width: 'auto',
            data: element
        });
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.strengthsGet();
            }
        });
    }
    deleteStrengths(strength_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('strength');
        confirmResult.afterClosed().subscribe((result) => {
            if (result == true) {
                this.userService.deleteStrengths(login_access_token, strength_id).pipe(first()).subscribe(
                    (data: any) => {
                        if (data.status_code == 200) {
                            this.alertService.success(data.message, true);
                            this.strengthsGet();
                        }
                        else {
                            this.alertService.error(data.message, true);
                        }
                    },
                    error => {
                        this.alertService.error(error);
                    });
            }
        });
    }
    strengthsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;
        // console.log('unitid', unit_id);
        
        this.userService.getStrengths(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.viewStrengthData = data.data;
                this.viewStrengthData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementStrength[] = this.viewStrengthData;
                this.dataSourceStrength = new MatTableDataSource<PeriodicElementStrength>(ELEMENT_DATA);
                // console.log('this.dataSourceStrength', this.dataSourceStrength);

            },
            error => {
                this.alertService.error(error);
            });
    }
    addWeaknessOpen(): void {
        const dialogRef = this.dialog.open(AddWeakness);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.weaknessGet();
            }
        });
    }
    editWeaknessOpen(element): void {
        const dialogRef = this.dialog.open(EditWeakness, {
            width: 'auto',
            data: element
        });
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.weaknessGet();
            }
        });
    }
    weaknessGet() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;
        this.userService.getWeakness(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            data => {
                this.viewWeaknesData = data;
                this.weaknesAllData = this.viewWeaknesData.data;
                this.weaknesAllData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElement[] = this.weaknesAllData;
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
                //this.dataSource.paginator = this.paginator;
            },
            error => {
                this.alertService.error(error);
            });
    }
    deleteWeakness(weaknesses_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('weaknesses');
        confirmResult.afterClosed().subscribe((result) => {
            if (result == true) {
                this.userService.deleteWeakness(login_access_token, weaknesses_id).pipe(first()).subscribe(
                    (data: any) => {
                        if (data.status_code == 200) {
                            this.alertService.success(data.message, true);
                            this.weaknessGet();
                        }
                        else {
                            this.alertService.error(data.message, true);
                        }
                    },
                    error => {
                        this.alertService.error(error);
                    });
            }
        });
    }
    addOpportunity(): void {
        const dialogRef = this.dialog.open(AddOpportunities);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.opportunityGet();
            }
        });
    }
    editOpportunity(element): void {
        const dialogRef = this.dialog.open(EditOpportunities, {
            width: 'auto',
            data: element
        });
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                }
            };
            if (result == "YesSubmit") {
                this.opportunityGet();
            }
        });
    }
    opportunityGet() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;
        this.userService.getOpportunity(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            data => {
                this.viewUomData = data;
                this.uomAllData = this.viewUomData.data;
                this.uomAllData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementOpportunity[] = this.uomAllData;
                this.dataSourceOpportunity = new MatTableDataSource<PeriodicElementOpportunity>(ELEMENT_DATA);
                //this.dataSource.paginator = this.paginator;
            },
            error => {
                this.alertService.error(error);
            });
    }
    deleteOpportunity(opportunities_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('opportunities');
        confirmResult.afterClosed().subscribe((result) => {
            if (result == true) {
                this.userService.deleteOpportunity(login_access_token, opportunities_id).pipe(first()).subscribe(
                    (data: any) => {
                        if (data.status_code == 200) {
                            this.alertService.success(data.message, true);
                            this.opportunityGet();
                        }
                        else {
                            this.alertService.error(data.message, true);
                        }
                    },
                    error => {
                        this.alertService.error(error);
                    });
            }
        });
    }
    addThreatsOpen(): void {
        const dialogRef = this.dialog.open(AddThreats);
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                // toolbar: {
                //   hidden: false
                // },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                    // toolbar: {
                    //   hidden: true
                    // },
                }
            };
            if (result == "YesSubmit") {
                this.threatsGet();
            }
        });
    }
    editThreatsOpen(element): void {
        const dialogRef = this.dialog.open(EditThreats, {
            width: 'auto',
            data: element
        });
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                // toolbar: {
                //   hidden: false
                // },
                sidepanel: {
                    hidden: true
                }
            }
        };
        dialogRef.afterClosed().subscribe(result => {
            this._fuseConfigService.config = {
                layout: {
                    navbar: {
                        hidden: false
                    },
                    // toolbar: {
                    //   hidden: true
                    // },
                }
            };
            if (result == "YesSubmit") {
                this.threatsGet();
            }
        });
    }
    threatsGet() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let selectedYear = this.userSelectedYear;
        let financialYear = this.companyFinancialYear;
        let company_id = this.company_id;
        let unit_id = this.unit_id;
        this.userService.getThreats(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
            data => {
                this.viewThreatData = data;
                this.threatAllData = this.viewThreatData.data;
                this.threatAllData.map((CATEGORY: any, index: number) => {
                    CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElementThreats[] = this.threatAllData;
                this.dataSourceThreats = new MatTableDataSource<PeriodicElementThreats>(ELEMENT_DATA);
                //this.dataSource.paginator = this.paginator;
            },
            error => {
                this.alertService.error(error);
            });
    }
    deleteThreats(threats_id) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('threats');
        confirmResult.afterClosed().subscribe((result) => {
            if (result == true) {
                this.userService.deleteThreats(login_access_token, threats_id).pipe(first()).subscribe(
                    (data: any) => {
                        if (data.status_code == 200) {
                            this.alertService.success(data.message, true);
                            this.threatsGet();
                        }
                        else {
                            this.alertService.error(data.message, true);
                        }
                    },
                    error => {
                        this.alertService.error(error);
                    });
            }
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
export class PerformanceDialog implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<PerformanceDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    ngOnInit(): void {
    }
    performanceClose(): void {
        this.dialogRef.close();
    }
}

export interface PeriodicElementStrength {
    sr_no: number;
    strength: string;
    keywords: string;
    action: string;
}
export interface PeriodicElement {
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