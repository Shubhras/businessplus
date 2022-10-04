import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
//import { AddStrategicDialog } from 'app/main/apps/strategic-obj/strategic/addstrategic.component';
//import { EditStrategicDialog } from 'app/main/apps/strategic-obj/strategic/editstrategic.component';
import { AddInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-add/addinitiative.component';
import { AddActionPlanDialog } from 'app/main/apps/strategic-obj/action-plan-add/addactionplan.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription, concat } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
//import { LoaderService } from 'app/main/apps/loader/loader.service';
//import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
/* import * as moment from 'moment';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { STATUSES } from '../../_constants'; */
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { AddStrategicDialog } from '../strategic/addstrategic.component';
import { AddKpiDialog } from '../../kpitrackers/keyperformance/addkpi.component';
@Component({
  selector: 'str-initi-action-kpi',
  templateUrl: './str-initi-action-kpi.component.html',
  styleUrls: ['./str-initi-action-kpi.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class StrInitiActionKpiComponent implements OnInit, OnDestroy {
  sub: any;
  currentUser: any;
  unit_id: any;
  userSelectedYear: any;
  start_date: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  deptAccorPermission: any;
  strObjPermission: any;
  initiativesPermission: any;
  actionPlanPermission: any;
  kpiPermission: any;
  currentYearSubscription: Subscription;
  strategicAllData: any;
  renderStrategicData: Array<any>;
  buttonDisabled: boolean;
  userModulePermission: any;
  dataDepartment: any;
  test = false;
  strategicObjectivesId: number;
  /**
* Constructor
*
*
*/
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    //private confirmationDialogService: ConfirmationDialogService,
    private bottomSheet: MatBottomSheet,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    //private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
    // Register the custom chart.js plugin
  }
  dept_nameFilter = new FormControl();
  /**
 * On init
 */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.sub = this.route.params.subscribe(params => {
      if (params['strObjId']) {
        this.strategicObjectivesId = params['strObjId'];
        console.log('sir obj id', this.strategicObjectivesId);
      }
    });
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewSingleStrObje();
      this.viewSingleStrObje11();
      this.disableButton();
    });
    this.getDepartment();
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Strategic_objectives") {
        this.strObjPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Initiatives") {
        this.initiativesPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Action_plans") {
        this.actionPlanPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Add_kpis") {
        this.kpiPermission = this.userModulePermission[i];
      }
    }
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.viewSingleStrObje();
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  viewSingleStrObje() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strObjeSingleStrData(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.strategicAllData = data.data;
        this.processData(this.strategicAllData);
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewSingleStrObje11() {
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let s_o_id = this.strategicObjectivesId;
    let unit_id = this.unit_id;
    this.userService.strObjeSingleStrData11(login_access_token, s_o_id, selectedYear, unit_id).pipe(first()).subscribe(
      (data: any) => {
        this.renderStrategicData = data.data;
        console.log('hhhhhiiiiiii', this.renderStrategicData);
        if (this.renderStrategicData[0].initiatives[0].action_plans[0].kpis.length == 0) {
          this.test = true;
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  processData(initalldata: any): any {
    //this.renderStrategicData = initalldata;
  }
  filterRenderedData(deptId) {
    let department;
    if (deptId) {
      department = this.strategicAllData.filter((d: any) => {
        return d.id === Number(deptId);
      });
    } else {
      department = this.strategicAllData;
    }
    this.processData(department);
    console.log(deptId, 'department', department);
  }
  disableButton() {
    let currentYear = this.userSelectedYear;
    // let currentMonth = new Date().getMonth();
    // let currentDate = new Date().getDate();
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
  AddStrategicPopupOpen(): void {
    const dialogRef = this.dialog.open(AddStrategicDialog, {
      panelClass: 'adding-dial',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewSingleStrObje();
      }
    });
  }
  addInitiativeOpen(element): void {
    const dialogRef = this.dialog.open(AddInitiativeDialog, {
      data: element,
      panelClass: 'adding-dial',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewSingleStrObje11();
      }
    });
  }
  addActionPlanOpen(element): void {
    const dialogRef = this.dialog.open(AddActionPlanDialog, {
      data: element,
      panelClass: 'adding-dial',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewSingleStrObje11();
      }
    });
  }
  AddKpiPopupOpen(dept_id, section_id, s_o_id, initiatives_id, action_plans_id): void {
    const element = {
      "dept_id": dept_id,
      "section_id": section_id,
      "s_o_id": s_o_id,
      "initiatives_id": initiatives_id,
      "actionPlansData": [{ action_plan_id: action_plans_id }],
    }
    const dialogRef = this.dialog.open(AddKpiDialog, {
      data: element,
      panelClass: 'adding-dial',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewSingleStrObje11();
      }
    });
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
}