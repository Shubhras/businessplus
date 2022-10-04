import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { InitiativeService } from 'app/main/apps/strategic-obj/initiative/initiative.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { User } from '../../_models';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';






@Component({
  selector: 'master-action',
  templateUrl: './master-action.component.html',
  styleUrls: ['./master-action.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MasterActionComponent implements OnInit {
  currentUser: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  selectedyearint: any;
  unit_id: any;
  animal: string;
  name: string;
  initSelectData: any;
  //initDepartment_masters: any;
  ViewStrategicAllData: any;
  dataDepartment: any;
  status_code: any;
  StraSuccess: any;
  MessageSuccess: any;
  MessageError: any;
  StraError: any;
  strategic_objectives_id: number;
  user_id: number;
  strategicAllData: any;
  currentMonth: any;
  currentYear: any;
  selectYear: any;
  userModulePermission: any;
  deptAccorPermission: any;
  initiDataPermission: any;
  allExpandState = true;
  userDataComment: any;
  strObjActionData: any;
  selectedYearVal: any;
  userrole: any;
  straObjStatus: any;
  start_date: any;
  end_date: any;
  nextDate: any;
  nextd: any;
  companyCreateData: any;
  start_taerget_date: any;
  end_taerget_date: any;
  testindex = 0;
  ttttt: number;
  counter3 = 1;
  //counter = 0;
  //company_reminder_date: any;
  displayedColumns: Array<any>;
  // displayedColumns = ['sr_no', 'definition', 'target', 'co_owner_name', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
  //   'sep', 'oct', 'nov', 'dec', 'status_name', 'comment'];
  renderStrategicData: Array<any>;
  //MONTHS: Array<any>;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  monthNumber = [{ 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 }];
  MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  filter: any = { department_id: '', status_name: '', end_date: '' };
  filteredData: any;
  currentYearSubscription: Subscription;
  userSelectedYear: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  /**
   * Constructor
   *
   * @param {InitiativeService} _initiativeService
   */
  constructor(
    private _initiativeService: InitiativeService,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private bottomSheet: MatBottomSheet,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {

  }
  dept_nameFilter = new FormControl();
  // start_dateFilter = new FormControl();
  end_dateFilter = new FormControl();
  status_nameFilter = new FormControl();
  /**
  * On init
  */

  ngOnInit(): void {

    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    //this.company_reminder_date = 5;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyCreateData = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].company_created_date : null;
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    if (this.companyFinancialYear == 'april-march') {
      this.displayedColumns = ['sr_no', 'definition', 'target', 'co_owner_name', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'status_name', 'comment'];
      let Slice = this.displayedColumns.slice(4, 13);
      //console.log("ssssssssssssss", Slice);
      // this.MONTHS = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];
    }

    else {
      this.displayedColumns = ['sr_no', 'definition', 'target', 'co_owner_name', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
        'sep', 'oct', 'nov', 'dec', 'status_name', 'comment'];
      // this.MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    }

    //   //   this.MONTHS = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];
    // }

    this.getDepartment();
    this.strObjStatusGet();
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewStrategicObjectives();
    });
    let now = new Date();
    this.currentMonth = moment(new Date()).format("MM");
    this.currentYear = moment(now, 'YYYY-MM-DD').format('YYYY');
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Initiative_datas") {
        this.initiDataPermission = this.userModulePermission[i];
      }
    }
    this.selectedYearVal = this.currentYear;
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }

  changeReviewOpen(element, monthDate, selectYear): void {
    if (this.companyFinancialYear == 'jan-dec') {
      if (Number(this.currentYear) == selectYear) {
        if (this.currentMonth >= monthDate) {
          if (this.initiDataPermission.acc_edit == 1) {
            const dialogRef = this.dialog.open(ChangeReview, {
              data: { element, monthDate, selectYear }

            });
            console.log("ele", element);
            dialogRef.afterClosed().subscribe(result => {
              if (result == "YesSubmit") {
                this.viewStrategicObjectives();
              }
            });
          }
        }
      }

      if (Number(this.currentYear) > selectYear) {
        if (this.initiDataPermission.acc_edit == 1) {
          const dialogRef = this.dialog.open(ChangeReview, {
            data: { element, monthDate, selectYear }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result == "YesSubmit") {
              this.viewStrategicObjectives();
            }
          });
        }

      }
    }
    if (this.companyFinancialYear == 'april-march') {
      let monthdte = Number(monthDate + 1);
      console.log("example", monthdte + 1);


      if (monthdte <= 3) {
        var popupy = selectYear + 1;
        console.log("example2", popupy);

        if (Number(this.currentYear) == popupy || Number(this.currentYear) > selectYear) {
          if (this.currentMonth > monthdte) {
            if (this.initiDataPermission.acc_edit == 1) {
              const dialogRef = this.dialog.open(ChangeReview, {
                data: { element, monthDate, selectYear }

              });

              dialogRef.afterClosed().subscribe(result => {
                if (result == "YesSubmit") {
                  this.viewStrategicObjectives();
                }
              });
            }
          }
        }
        if (Number(this.currentYear) > selectYear) {
          if (this.initiDataPermission.acc_edit == 1) {
            const dialogRef = this.dialog.open(ChangeReview, {
              data: { element, monthDate, selectYear }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == "YesSubmit") {
                this.viewStrategicObjectives();
              }
            });
          }

        }
      }
      if (monthdte > 3) {

        if (Number(this.currentYear) == selectYear || Number(this.currentYear) > selectYear) {
          if (this.currentMonth > monthdte) {
            if (this.initiDataPermission.acc_edit == 1) {
              const dialogRef = this.dialog.open(ChangeReview, {
                data: { element, monthDate, selectYear }

              });

              dialogRef.afterClosed().subscribe(result => {
                if (result == "YesSubmit") {
                  this.viewStrategicObjectives();
                }
              });
            }
          }
        }

        if (Number(this.currentYear) > selectYear) {
          if (this.initiDataPermission.acc_edit == 1) {
            const dialogRef = this.dialog.open(ChangeReview, {
              data: { element, monthDate, selectYear }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == "YesSubmit") {
                this.viewStrategicObjectives();
              }
            });
          }

        }
      }
    }

  }
  openUserComment(element): void {
    let login_access_token = this.currentUser.login_access_token;
    let action_plan_id = element.action_plan_id;
    let co_owner_id = element.co_owner_id;
    this.userService.getUserComment(login_access_token, action_plan_id, co_owner_id).pipe(first()).subscribe(
      (data: any) => {
        this.userDataComment = data;
        const bottomSheetRef = this.bottomSheet.open(UserCommentSheet, {
          data: this.userDataComment
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
        });
      },
      error => {
        this.alertService.error(error);
      })
  }
  /* SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      data => {
        this.initSelectData = data;
        this.initDepartment_masters = this.initSelectData.data.department_masters;
      },
      error => {
        this.alertService.error(error);
    });
  } */
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
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
      (data: any) => {
        this.userrole = data;
        // console.log(this.userrole.data);

        this.straObjStatus = this.userrole.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewStrategicObjectives() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    //console.log("sele", selectedYear);

    let financialYear = this.companyFinancialYear;
    this.userService.strategicObjectivesData(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        //
        this.strategicAllData = data.data;
        //console.log(this.strategicAllData);

        //this.strategicAllData = [{ "id": 23, "dept_name": "Research &  Development", "strategic_objectives": [{ "strategic_objectives_id": 68, "target": "SOP on time", "start_date": "2018-04-07", "end_date": "2023-04-08", "unit_id": 3, "unit_name": "Washington", "department_id": 23, "dept_name": "Research &  Development", "user_id": 20, "user_name": "Arpit", "tracking_frequency": "Quarterly", "description": "Launch 25 new product with New technology", "uom_name": "Date", "status_name": "Yellow", "percentage": "90", "initiatives": [{ "sr_no": "68.1", "initiatives_id": 58, "definition": "Created Detailed Product development road map and launch plan for all 25 products", "s_o_id": 68, "description": "Launch 25 new product with New technology", "dept_id": 23, "dept_name": "Research &  Development", "section_id": 31, "section_name": "Design", "user_id": 20, "start_date": "2018-04-11", "end_date": "2023-04-04", "percentage": "89", "status_name": "Red", "action_plans": [{ "sr_no": "67.1.4", "action_plans_id": 176, "definition": "action plane 03-09-2020", "target": "fdgdfgdfgdfg", "start_date": "2019-01-08", "end_date": "2020-07-09", "control_point": "Monthly", "co_owner": "[15,16]", "status": 4, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "95", "status_name": "Yellow", "reminder_date": "16", "action_plans_assign_user": [{ "action_plan_id": 176, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [{ "schedule_id": 90, "month_date": "2019-02-06", "review_month_date": "2021-02-06", "comment": "test-two", "recovery_plan": "testing", "implement_data": "2021-02-09", "co_owner_id": 15, "status": "3", "status_name": "Green", "responsibility_id": 23, "responsibility_name": null, "co_owner_name": "pradeepppp mukati" }] }, { "action_plan_id": 176, "co_owner_id": 16, "user_name": "Rajesh", "schedules": [] }] }, { "sr_no": "68.1.7", "action_plans_id": 191, "definition": "quaterlyyyyyyyyyyy", "target": "business test", "start_date": "2019-01-29", "end_date": "2022-11-18", "control_point": "Quarterly", "co_owner": "[15]", "status": 5, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "18", "action_plans_assign_user": [{ "action_plan_id": 191, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [{ "schedule_id": 122, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 15, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "pradeepppp mukati" }] }] }, { "sr_no": "68.1.9", "action_plans_id": 193, "definition": "quaterly reminde date irs greate", "target": "testing", "start_date": "2020-01-08", "end_date": "2022-08-12", "control_point": "Quarterly", "co_owner": "[3,18]", "status": 5, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "26", "action_plans_assign_user": [{ "action_plan_id": 193, "co_owner_id": 3, "user_name": "sotam", "schedules": [{ "schedule_id": 124, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 3, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 193, "co_owner_id": 18, "user_name": "lata", "schedules": [{ "schedule_id": 125, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 18, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "Arpit" }] }] }, { "sr_no": "68.1.12", "action_plans_id": 203, "definition": "quaterly", "target": "okay", "start_date": "2019-01-09", "end_date": "2023-04-03", "control_point": "Quarterly", "co_owner": "[23]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "19", "action_plans_assign_user": [{ "action_plan_id": 203, "co_owner_id": 23, "user_name": "sotam", "schedules": [{ "schedule_id": 139, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 23, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }] }, { "sr_no": "68.1.14", "action_plans_id": 205, "definition": "quaterly 2", "target": "fdefefe", "start_date": "2019-04-05", "end_date": "2022-03-18", "control_point": "Quarterly", "co_owner": "[21]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "12", "action_plans_assign_user": [{ "action_plan_id": 205, "co_owner_id": 21, "user_name": "kalpna", "schedules": [{ "schedule_id": 141, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 21, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "sotam" }] }] }, { "sr_no": "68.1.15", "action_plans_id": 206, "definition": "half yearly", "target": "okay", "start_date": "2020-01-06", "end_date": "2023-04-03", "control_point": "Half Yearly", "co_owner": "[22,27]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "19", "action_plans_assign_user": [{ "action_plan_id": 206, "co_owner_id": 22, "user_name": "kalpna", "schedules": [{ "schedule_id": 142, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 22, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 206, "co_owner_id": 27, "user_name": "Rajendra Rajput", "schedules": [{ "schedule_id": 143, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 27, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "Rajendra Rajput" }] }] }, { "sr_no": "68.1.16", "action_plans_id": 207, "definition": "half yearly end in jan", "target": "1 Year 0 Month 0 Days", "start_date": "2020-01-01", "end_date": "2022-01-06", "control_point": "Half Yearly", "co_owner": "[20]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "12", "action_plans_assign_user": [{ "action_plan_id": 207, "co_owner_id": 20, "user_name": "Arpit", "schedules": [{ "schedule_id": 144, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 20, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }] }] }, { "sr_no": "68.2", "initiatives_id": 83, "definition": "Develop market for low end and high end and premium segment and distinguish USP and value proposition for all products", "s_o_id": 68, "description": "Launch 25 new product with New technology", "dept_id": 23, "dept_name": "Research &  Development", "section_id": 31, "section_name": "Design", "user_id": 20, "start_date": "2019-02-05", "end_date": "2020-12-30", "percentage": "90", "status_name": "Yellow", "action_plans": [{ "sr_no": "68.2.1", "action_plans_id": 126, "definition": "Market segment product delivery", "target": "95", "start_date": "2019-06-04", "end_date": "2019-11-28", "control_point": "Monthly", "co_owner": "[3]", "status": 4, "initiatives_id": 83, "user_id": 20, "co_owner_name": null, "percentage": "0", "status_name": "Yellow", "reminder_date": "04", "action_plans_assign_user": [{ "action_plan_id": 126, "co_owner_id": 3, "user_name": "sotam", "schedules": [] }] }, { "sr_no": "68.2.2", "action_plans_id": 127, "definition": "Design complete and open delivery gate", "target": "89", "start_date": "2019-06-06", "end_date": "2019-12-20", "control_point": "Monthly", "co_owner": "[3,15]", "status": 5, "initiatives_id": 83, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "04", "action_plans_assign_user": [{ "action_plan_id": 127, "co_owner_id": 3, "user_name": "sotam", "schedules": [{ "schedule_id": 88, "month_date": "2019-08-05", "review_month_date": "2021-02-05", "comment": "testfor", "recovery_plan": "testing project-businessplus", "implement_data": "2021-02-12", "co_owner_id": 3, "status": "3", "status_name": "Green", "responsibility_id": 17, "responsibility_name": "lata", "co_owner_name": null }, { "schedule_id": 89, "month_date": "2019-08-05", "review_month_date": "2021-02-05", "comment": "test-two", "recovery_plan": "testing", "implement_data": "2021-02-13", "co_owner_id": 3, "status": "2", "status_name": "Blue (Hold)", "responsibility_id": 20, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 127, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [] }] }] }] }] }]
        this.processData(this.strategicAllData);
        console.log("hjjjj", this.processData);

      },
      error => {
        this.alertService.error(error);
      });
  }
  filterRenderedData(key: string, value: any) {
    if (key === "end_date") {
      this.filter[key] = moment(value).format('YYYY-MM-DD').toLowerCase();
    }
  
    else {
      this.filter[key] = value;
    }
    let filteredData: any;
    filteredData = this.strategicAllData.map((dept: any) => {
      //console.log("fcdsvcdsvcd", filteredData);

      let str = dept.strategic_objectives.filter((so: any) => {
        let d = this.filter.department_id !== '' ? so.department_id === Number(this.filter.department_id) : true;
        let s = this.filter.status_name !== '' ? so.status_name === this.filter.status_name : true;
        let e_date = this.filter.end_date !== '' ? so.end_date <= this.filter.end_date : true;
        
        return (d && s && e_date);
      });
      return {
        ...dept,
        'strategic_objectives': [...str]
      }
    });
    //console.log(filteredData);
    this.processData(filteredData);
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.status_nameFilter.reset('');
    // this.start_dateFilter.reset('');
    this.end_dateFilter.reset('');
    this.viewStrategicObjectives();
  }
  actionDataByYear(deptId, strObjId, initiativeId, actionPlanId, selectYear) {
    

    this.selectYear = selectYear;

    this.companyFinancialYear = this.companyFinancialYear
    //console.log("check year", this.selectYear);

    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjActionByYear(login_access_token, actionPlanId, this.selectYear, this.companyFinancialYear).pipe(first()).subscribe(
      (data: any) => {
        this.strObjActionData = data.data;
        //console.log("red triangle", this.strObjActionData[0]);

        this.actionPlanSaprate(this.strObjActionData, this.selectYear);


        this.actionDataFiilter(deptId, strObjId, initiativeId, actionPlanId, this.selectYear);
      },


      error => {
        this.alertService.error(error);
      });
  }
  actionDataFiilter(deptId, strObjId, initiativeId, actionPlanId, selectYear) {
    let department;

    if (deptId) {

      this.renderStrategicData.map((d: any) => {


        if (d.id === deptId) {
          d.strategic_objectives.map((s: any) => {
            if (s.strategic_objectives_id === strObjId) {
              s.initiatives.map((i: any) => {
                if (i.initiatives_id === initiativeId) {
                  i.action_plans.map((a: any) => {
                    if (a.action_plans_id === actionPlanId) {
                      a.datasource = this.strObjActionData[0].datasource;
                    }
                  })
                }
              })
            }
          })
        }
      })
      //this.processData(this.renderStrategicData);
    }
  }
  processData(initalldata: any): any {
    //this.renderStrategicData = [...this.strategicAllData];
    this.renderStrategicData = initalldata;
    //console.log("april-button", this.renderStrategicData);

    let counter = 1;
    let counter2 = 1;
    this.renderStrategicData.map((depts: any) => {
      const strategies = [...depts.strategic_objectives];
      if (_.isArray(strategies) && !_.isEmpty(strategies)) {
        strategies.map((strategy: any) => {
          strategy['srno'] = counter;
          counter = counter + 1;
          const initiatives = [...strategy.initiatives];
          if (_.isArray(initiatives) && !_.isEmpty(initiatives)) {
            initiatives.map((initiative: any) => {
              initiative['srrno'] = counter2;
             counter2 = counter2 + 1;
              const actionPlans = [...initiative.action_plans];
              if (_.isArray(actionPlans) && !_.isEmpty(actionPlans)) {

                this.selectYear = Number(this.currentYear);
                this.actionPlanSaprate(actionPlans, this.selectYear);
              }
            })
          }
        });
      }
      else {
        // console.log(`No strategic data for dept ${depts.dept_name}`);
      }
    })
  }


  actionPlanSaprate(actionPlans: any, selectYear) {
    //console.log('actionPlans',actionPlans);
    this.selectYear = selectYear;
    const todayDate = new Date().getDate();
    const currentMonth = moment().format('MM');
    const currentnum = Number(currentMonth);
    const currentnumprevious = currentnum - 1;
    const currentDate = moment().format('DD');
    actionPlans.map((actionPlan: any) => {
      //console.log("years", actionPlan.years);

      let actionPlanYears: Array<any> = [];
      let actionnnnn: Array<any> = [];
      let startYearActionPlan = Number(moment(actionPlan.start_date, 'YYYY-MM-DD').format('YYYY'));
      let startMonthActionPlan = Number(moment(actionPlan.start_date, 'YYY-MM-DD').format('MM'));
      console.log("start---month", startMonthActionPlan);
      console.log("start---year", startYearActionPlan);
      let endMonthActionPlan = moment(actionPlan.end_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
      let endMonthChack2 = moment().month(endMonthActionPlan).format("MM");
      //let endMonthActionPlan = Number(moment(actionPlan.start_date, 'YYY-MM-DD').format('MM'));
      console.log("end---month", endMonthChack2);
      let endYearActionPlan = Number(moment(actionPlan.end_date, 'YYYY-MM-DD').format('YYYY'));
      if (this.companyFinancialYear == "april-march") {
        for (var a = startYearActionPlan - 1; a <= endYearActionPlan; a++) {
          if (endMonthChack2 <= '03') {
            if (a === endYearActionPlan) {
              continue;
            }
          }
          if (startMonthActionPlan > 3) {
            if (a === startYearActionPlan - 1) {
              continue;
            }
          }

          actionPlanYears.push({ "year_key": a, "year_value": `${a}-${(a + 1).toString().substr(2, 2)}` });
          // actionnnnn.push({ "year_key": a, "year_value": `${a - 1}-${(a).toString().substr(2, 2)}` });


        }
      }
      if (this.companyFinancialYear == "jan-dec") {
        for (var a = startYearActionPlan; a <= endYearActionPlan; a++) {
          actionPlanYears.push({ "year_key": a, "year_value": a });
        }

        //console.log('dddd:::', actionPlanYears);
      }

      //console.log(a);
      let SOBJDATA: PeriodicElement[] = [];
      const Owners: any = {
        "definition": actionPlan.definition,
        "target": actionPlan.target,
        "co_owner_name": "",
        "action_plan_id": "",
        "co_owner_id": "",
        "jan": "",
        "feb": "",
        "mar": "",
        "apr": "",
        "may": "",
        "jun": "",
        "jul": "",
        "aug": "",
        "sep": "",
        "oct": "",
        "nov": "",
        "dec": "",
        "yearData": selectYear,
        "status_name": "",
        "comment": ""
      };
      const startMonth = moment(actionPlan.start_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
      //console.log("start month", startMonth);

      const endMonth = moment(actionPlan.end_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
      //console.log("end month", endMonth);
      let startMonthChack = moment().month(startMonth).format("MM");
      //console.log("start-month", startMonthChack);
      let endMonthChack = moment().month(endMonth).format("MM");
      let endmonthtest = Number(moment(actionPlan.end_date, 'YYYY-MM-DD').format('MM'));
      // Number(moment().month(endMonth).format("MM");
      console.log("endmonthtest", endmonthtest);

      // (startMonth , endMonth) For Month  jan feb mar
      // (startMonthChack,endMonthChack,monthChack)  For Month 1 2 3
      // month==0(start month) , month==1( not review month) , month==2(review month) month==3(end month)
      //Owners[startMonth] = "0";
      let actualReviewDate = actionPlan.reminder_date;
      if (actionPlan.control_point == 'Monthly') {
        if (this.companyFinancialYear == 'jan-dec') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            let monthChacktest2 = Number(monthChack);
            console.log("testttt", monthChacktest2);
            var jantttt = endmonthtest + 1;
            if (monthChack == startMonthChack && startYearActionPlan == selectYear) {
              Owners[month] = { "a": "0", "b": false };
            }
            else if (monthChacktest2 == jantttt && endYearActionPlan == selectYear) {
              Owners[month] = { "a": "3", "b": false };
            }
            else if (startYearActionPlan == selectYear && endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest2 < jantttt) {
              let eee = monthChacktest2 + 1;
              if (monthChack < currentMonth && eee !== currentnum) {
                Owners[month] = { "a": "1", "b": true };
              }
              if (monthChack < currentMonth && eee == currentnum) {
                Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
              }
              if (monthChack >= currentMonth) {
                // Owners[month] = { "a": "1", "b": false };
                Owners[month] = { "a": "1", "b": false };
              }

            } else if (startYearActionPlan == selectYear && endYearActionPlan != selectYear && monthChack > startMonthChack) {
              if (startYearActionPlan < this.currentYear) {
                //Owners[month] = { "a": "1", "b": false };
                Owners[month] = { "a": "1", "b": true };
              }
              else {
                Owners[month] = { "a": "1", "b": false };
              }

            } else if (endYearActionPlan == selectYear && startYearActionPlan != selectYear && monthChacktest2 < jantttt) {
              if (endYearActionPlan < this.currentYear) {
                Owners[month] = { "a": "1", "b": true };
              }
              else if (endYearActionPlan >= this.currentYear) {
                Owners[month] = { "a": "1", "b": false };
              }
            }



            else {
              if (selectYear == this.currentYear && currentMonth > monthChack && selectYear != startYearActionPlan && selectYear != endYearActionPlan) {

                Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
              }
              else {
                if (selectYear == this.currentYear && selectYear != startYearActionPlan && selectYear != endYearActionPlan) {
                  if (monthChack < currentMonth && actualReviewDate < todayDate) {

                    Owners[month] = { "a": "1", "b": true };
                  }
                  else {

                    Owners[month] = { "a": "1", "b": false };
                  }

                }

              }
              if (selectYear < this.currentYear && selectYear !== startYearActionPlan && selectYear !== endYearActionPlan
                && selectYear > startYearActionPlan) {
                Owners[month] = { "a": "1", "b": true };
              }
              if (selectYear > this.currentYear && selectYear !== endYearActionPlan && selectYear !== startYearActionPlan) {
                Owners[month] = { "a": "1", "b": false };
              }
            }

          });
        }
        if (this.companyFinancialYear == 'april-march') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            let monthChacktest = Number(monthChack);
            console.log('monthChacktest', monthChacktest);
            // console.log('startYearActionPlan1', startYearActionPlan);
            // console.log('selectYear', selectYear);
            // console.log('startMonthChack', startMonthChack);

            if (selectYear <= startYearActionPlan) {
              if (monthChack <= '03') {
                let gj = startYearActionPlan - 1;
                if (monthChack == startMonthChack && gj == selectYear) {

                  //console.log('startYearActionPlan2', startYearActionPlan);
                  Owners[month] = { "a": "0", "b": false };

                }
              }
              if (monthChack > '03') {
                if (monthChack == startMonthChack && startYearActionPlan == selectYear) {
                  Owners[month] = { "a": "0", "b": false };

                }
              }
            }
            if (selectYear <= endYearActionPlan) {
              if (monthChack <= '03') {
                var ey = endYearActionPlan - 1;
                this.ttttt = endmonthtest + 1;
                console.log("yearplus", this.ttttt);

                if (monthChacktest == this.ttttt && ey == selectYear) {

                  Owners[month] = { "a": "3", "b": false };
                }
              }
              if (monthChack > '03') {
                //  this.ttttt = endmonthtest + 1;
                if (monthChacktest == this.ttttt && endYearActionPlan == selectYear) {

                  Owners[month] = { "a": "3", "b": false };
                }


              }

            }
            if (selectYear == endYearActionPlan && selectYear == startYearActionPlan) {
              if (monthChack <= '03') {
                var ey = endYearActionPlan - 1;

                //console.log("yearplus", tttts);

                if (monthChacktest == this.ttttt && ey == selectYear) {

                  Owners[month] = { "a": "3", "b": false };
                }
              }
              if (monthChack > '03') {
                if (monthChacktest == this.ttttt && endYearActionPlan == selectYear) {

                  Owners[month] = { "a": "3", "b": false };
                }


              }

            }
            if (startYearActionPlan == selectYear && endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest < this.ttttt) {
              if (monthChack >= '04') {
                if (selectYear < this.currentYear) {

                  // Owners[month] = { "a": "1", "b": false };
                  Owners[month] = { "a": "1", "b": true };
                }
                if (selectYear > this.currentYear) {
                  Owners[month] = { "a": "1", "b": false }
                }
                if (selectYear == this.currentYear) {
                  let mnth = monthChack + 1;
                  if (currentMonth > monthChack && mnth == currentMonth) {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate }
                  }
                  if (currentMonth > monthChack && mnth !== currentMonth) {
                    Owners[month] = { "a": "1", "b": true }
                  }
                  if (currentMonth < monthChack) {
                    Owners[month] = { "a": "1", "b": false }
                  }

                }

              }

            }
            if (selectYear <= startYearActionPlan) {
              if (monthChack <= '03') {
                let sy = startYearActionPlan - 1;
                if (sy == selectYear && endYearActionPlan != selectYear && monthChack > startMonthChack) {

                  if (startYearActionPlan < this.currentYear) {

                    //Owners[month] = { "a": "1", "b": false };
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (startYearActionPlan == this.currentYear && monthChack < currentMonth) {

                    Owners[month] = { "a": "1", "b": true };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }

                }
              }
              else if (monthChack > '03') {
                if (startYearActionPlan == selectYear && endYearActionPlan != selectYear && monthChack > startMonthChack) {

                  if (startYearActionPlan < this.currentYear) {

                    //Owners[month] = { "a": "1", "b": false };
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else {

                    Owners[month] = { "a": "1", "b": false };
                  }

                }
              }
            }
            else if (monthChack <= '03') {
              var endytess = endYearActionPlan - 1;
              if (endytess == selectYear && startYearActionPlan != selectYear && monthChacktest < this.ttttt) {

                if (endYearActionPlan < this.currentYear) {

                  Owners[month] = { "a": "1", "b": true };
                }
                if (endYearActionPlan >= this.currentYear) {

                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
            else if (monthChack > '03') {
              if (endYearActionPlan == selectYear && startYearActionPlan != selectYear && monthChacktest < this.ttttt) {

                if (endYearActionPlan < this.currentYear) {

                  Owners[month] = { "a": "1", "b": true };
                }
                else if (endYearActionPlan >= this.currentYear) {

                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }

            // else {

            //   if (selectYear == this.currentYear && currentMonth > monthChack && selectYear != startYearActionPlan && selectYear != endYearActionPlan) {

            //     Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
            //   }
            //   else {

            //     if (selectYear == this.currentYear && selectYear != startYearActionPlan && selectYear != endYearActionPlan) {
            //       if (monthChack < currentMonth && actualReviewDate < todayDate) {

            //         Owners[month] = { "a": "1", "b": true };
            //       }
            //       else {

            //         Owners[month] = { "a": "1", "b": false };
            //       }

            //     }

            //   }
            //   //console.log('ownerMonth:::', Owners[month]);

            //   if (selectYear < this.currentYear && selectYear !== startYearActionPlan && selectYear !== endYearActionPlan
            //     && selectYear > startYearActionPlan) {
            //     console.log("test14");
            //     Owners[month] = { "a": "1", "b": true };
            //   }
            //   if (selectYear > this.currentYear && selectYear !== endYearActionPlan && selectYear !== startYearActionPlan) {
            //     console.log("test15");
            //     Owners[month] = { "a": "1", "b": false };
            //   }
            // }
            if (selectYear >= startYearActionPlan && selectYear <= endYearActionPlan) {
              if (monthChack <= '03') {
                let selyear2 = selectYear - 1;
                let selcurrent = selectYear + 1;
                let selminus = selcurrent - 1;
                if (selectYear < selcurrent && selcurrent < this.currentYear
                  && selcurrent >= startYearActionPlan) {

                  Owners[month] = { "a": "1", "b": true };
                }
                else if (selectYear < selcurrent && selcurrent > this.currentYear
                  && selcurrent >= startYearActionPlan && selcurrent < endYearActionPlan) {
                  //console.log("test15");
                  Owners[month] = { "a": "1", "b": false };
                }
                else if (selectYear == selminus && selcurrent == this.currentYear
                  && selcurrent >= startYearActionPlan && selcurrent <= endYearActionPlan) {

                  if (monthChack < currentMonth) {
                    if (actualReviewDate < currentDate) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    else {
                      Owners[month] = { "a": "1", "b": false };
                    }
                  }
                  if (monthChack >= currentMonth) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            if (selectYear !== startYearActionPlan && selectYear !== endYearActionPlan) {
              if (monthChack > '03') {
                if (selectYear >= this.currentYear && selectYear > startYearActionPlan) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }


          });
        }
      }



      else if (actionPlan.control_point == 'Quarterly') {

        let addMonth = 3;
        const quaterlyMonths = [];
        let currentDate = actionPlan.start_date;
        for (var i = 4; i > 0; i--) {
          this.nextDate = moment(currentDate).add(addMonth, 'months').calendar();
          // console.log("nextdate", this.nextDate);

          currentDate = this.nextDate;
          //console.log("nextDate", nextDate);
          this.nextd = moment(this.nextDate).format("MM");
          // console.log("nexts", this.nextd);

          var QtlMonth = moment(this.nextDate, 'MM/DD/YYYY').format('MMM').toLowerCase();
          quaterlyMonths.push(QtlMonth);
          console.log("qtl", QtlMonth);

        }
        if (this.companyFinancialYear == 'jan-dec') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");

            if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
              //Owners[startMonth] = "0";
              Owners[startMonth] = { "a": "0", "b": false };
              if (startMonthChack <= monthChack) {
                if (quaterlyMonths.indexOf(month) !== -1 && month !== startMonth) {

                  if (selectYear < this.currentYear) {
                    Owners[month] = { "a": "1", "b": true };
                    //console.log("firsat");
                  }

                }
              }
            }
            else if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
              if (endMonthChack >= monthChack) {
                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (selectYear < this.currentYear) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            else if (selectYear < this.currentYear && endYearActionPlan !== selectYear) {
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                Owners[month] = { "a": "1", "b": true };
              }

            }
            else if (selectYear > this.currentYear && endYearActionPlan !== selectYear) {
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                Owners[month] = { "a": "1", "b": false };
              }

            }
            // 1 Year 
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              //console.log("zzzzzzzzzz");
              if (startMonthChack <= monthChack && monthChack <= endMonthChack) {
                if (month === endMonth) {
                  //console.log("trtrtt");
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month === startMonth) {
                  //console.log("trtrtt");
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month !== startMonth && quaterlyMonths.indexOf(month) !== -1) {
                  if (currentMonth > monthChack) {
                    // console.log("zzzzzz");
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    //console.log("yyyyy");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
                else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (currentMonth > monthChack) {
                    //console.log("jjjjjj");
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    //console.log("lllllll");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            // 1 Year End
            else {
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                if (selectYear == this.currentYear && currentMonth > monthChack) {

                  Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                }
                else {
                  if (selectYear == this.currentYear) {
                    if (monthChack < this.nextDate && actualReviewDate < todayDate) {

                      Owners[month] = { "a": "1", "b": true };
                    }
                    else {

                      Owners[month] = { "a": "1", "b": false };
                    }

                  }
                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
          });
        }
        if (this.companyFinancialYear == 'april-march') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            if (selectYear <= startYearActionPlan) {

              if (startMonthChack >= '04') {
                if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
                  //Owners[startMonth] = "0";

                  Owners[startMonth] = { "a": "0", "b": false };

                }
              }
              if (monthChack <= '03') {
                let stYear = startYearActionPlan - 1;
                if ((stYear == selectYear) && (endYearActionPlan != selectYear)) {
                  //Owners[startMonth] = "0";
                  Owners[startMonth] = { "a": "0", "b": false };
                }
              }

            }
            if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
              if (startMonthChack <= monthChack) {
                if (quaterlyMonths.indexOf(month) !== -1 && month !== startMonth) {
                  if (selectYear < this.currentYear) {
                    Owners[month] = { "a": "1", "b": true };
                    //console.log("firsat");
                  }

                }
              }
            }

            else if (selectYear <= endYearActionPlan || selectYear == startYearActionPlan) {

              if (endMonthChack <= '03') {
                var erryy = endYearActionPlan - 1;

                if ((erryy == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }
                  }


                }
              }

              // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              //   if (selectYear > this.currentYear) {
              //     Owners[month] = { "a": "1", "b": false };
              //   }
              //}
              if (endMonthChack >= '04') {

                if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }

                  }
                }
              }


            }
            if (selectYear <= endYearActionPlan || selectYear == startYearActionPlan) {

              if (endMonthChack >= '04') {

                if ((endYearActionPlan == selectYear) && (startYearActionPlan == selectYear)) {

                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }


                }
              }
              if (endMonthChack <= '03') {
                let rftu = endYearActionPlan - 1;
                if ((rftu == selectYear) && (startYearActionPlan == selectYear)) {

                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }


                }
              }
            }

            if (selectYear > this.currentYear && endYearActionPlan !== selectYear && selectYear >= startYearActionPlan && selectYear !== erryy) {

              var te = selectYear + 1;
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {

                Owners[month] = { "a": "1", "b": false };
              }
            }
            if (endYearActionPlan !== selectYear && selectYear >= startYearActionPlan && selectYear == erryy) {

              if (endMonthChack == '02') {


                if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (month !== 'mar' && month !== 'feb') {
                    Owners[month] = { "a": "1", "b": false };
                  }

                }
              }

              if (endMonthChack == '01') {


                if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (month !== 'mar' && month !== 'feb' && month !== 'jan') {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
              if (endMonthChack == '03') {


                if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (month !== 'mar') {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }


              // else {

              //   if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              //     Owners[month] = { "a": "1", "b": false };
              //   }
              //}

            }
            if (selectYear <= this.currentYear && endYearActionPlan !== selectYear && selectYear >= startYearActionPlan) {
              let prr = endYearActionPlan - 1;
              if (selectYear !== prr) {
                if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (month == 'jan') {
                    var erty = selectYear + 1;
                    let ertyyy = erty - 1;

                    if (erty < this.currentYear && ertyyy == selectYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    if (selectYear == this.currentYear && erty !== this.currentYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": false };
                    }
                    if (erty == this.currentYear && ertyyy == selectYear && selectYear >= startYearActionPlan) {
                      let mnthyy = monthChack + 1;
                      if (currentMonth > monthChack && mnthyy == currentMonth) {
                        Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                      }
                      if (currentMonth > monthChack && mnthyy !== currentMonth) {
                        Owners[month] = { "a": "1", "b": true };
                      }
                      if (currentMonth <= monthChack) {
                        Owners[month] = { "a": "1", "b": false };
                      }
                    }
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }

              }
              if (selectYear == prr && endMonthChack >= '04') {
                if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
            if (selectYear >= this.currentYear && endYearActionPlan == selectYear && selectYear >= startYearActionPlan) {
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {

                if (month == 'jan') {
                  let rty = endYearActionPlan - 1;
                  if (selectYear <= this.currentYear && rty == selectYear && selectYear >= startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
                // if (selectYear <= this.currentYear && endYearActionPlan == selectYear && selectYear >= startYearActionPlan) {
                if (month !== 'jan' && monthChack < endMonthChack) {
                  Owners[month] = { "a": "1", "b": false };

                }
                //}

              }
            }
            // 1 Year 
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              //console.log("zzzzzzzzzz");
              if (startMonthChack <= monthChack && monthChack <= endMonthChack) {
                if (month === endMonth) {
                  //console.log("trtrtt");
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month === startMonth) {
                  //console.log("trtrtt");
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month !== startMonth && quaterlyMonths.indexOf(month) !== -1) {
                  if (currentMonth > monthChack) {
                    // console.log("zzzzzz");
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    //console.log("yyyyy");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
                else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                  if (currentMonth > monthChack) {
                    //console.log("jjjjjj");
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    //console.log("lllllll");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            // 1 Year End
            // else {
            //   if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
            //     if (selectYear == this.currentYear && currentMonth > monthChack && selectYear !== erryy) {

            //       Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
            //     }
            //     else {
            //       if (selectYear == this.currentYear) {
            //         if (monthChack < this.nextDate && actualReviewDate < todayDate) {

            //           Owners[month] = { "a": "1", "b": true };
            //         }
            //         // else {

            //         //   Owners[month] = { "a": "1", "b": false };
            //         // }

            //       }
            //       // Owners[month] = { "a": "1", "b": false };
            //     }
            //   }
            // }
          });
        }
      }
      else if (actionPlan.control_point == 'Half Yearly') {
        let halfYearlyMonth = moment(actionPlan.start_date).add(6, 'months').calendar();
        let HalfMonth = moment(halfYearlyMonth, 'MM/DD/YYYY').format('MMM').toLowerCase();
        console.log("half yearlyy month", HalfMonth);
        //let HalfMonthNumber = moment().month(HalfMonth).format("MM");;

        // let HalfMonthNumber = Number(moment(HalfMonth, 'YYY-MM-DD').format('MM'));
        // console.log("half yearlyy month", HalfMonthNumber);
        if (this.companyFinancialYear == 'jan-dec') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
              //Owners[startMonth] = "0";
              Owners[startMonth] = { "a": "0", "b": false };
              if (startMonthChack <= monthChack) {
                if (month == HalfMonth) {

                  // console.log("firstttttt");
                  if (selectYear < this.currentYear) {
                    Owners[month] = { "a": "1", "b": true };

                  }
                  else if (selectYear >= this.currentYear) {
                    // console.log("secondddddddd");
                    Owners[month] = { "a": "1", "b": false };
                  }

                }
              }
            }
            else if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
              if (endMonthChack >= monthChack) {
                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == startMonth || month == HalfMonth) {
                  if (selectYear < this.currentYear) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (selectYear >= this.currentYear) {
                    Owners[month] = { "a": "1", "b": false };
                  }

                }
                else {
                  Owners[month] = "";
                }
              }
            }
            else if (selectYear < this.currentYear && startYearActionPlan !== selectYear) {
              if (month == startMonth || month == HalfMonth) {
                Owners[month] = { "a": "1", "b": true };
              }

            }
            else if (selectYear > this.currentYear && endYearActionPlan !== selectYear) {
              if (month == startMonth || month == HalfMonth) {
                Owners[month] = { "a": "1", "b": false };
              }

            }
            // 1 year 
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              if (startMonthChack <= monthChack && endMonthChack >= monthChack) {
                if (month == startMonth) {
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == HalfMonth) {
                  if (currentMonth > monthChack) {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            // 1 year End
            else {
              // console.log("asasasa");
              if (selectYear == this.currentYear) {
                if (month == startMonth || month == HalfMonth) {
                  if (monthChack < currentMonth && actualReviewDate < todayDate) {
                    Owners[month] = { "a": "1", "b": true };
                  }

                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }

              // if (month == startMonth || month == HalfMonth) {
              //   if (currentMonth > monthChack) {
              //     console.log("kkkkkk");

              //     Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
              //   }
              //   else {
              //     console.log("dfefeef");

              //     Owners[month] = { "a": "1", "b": false };
              //   }
              // }
            }
          });
        }
        if (this.companyFinancialYear == 'april-march') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            if (selectYear !== endYearActionPlan) {
              if (startMonthChack <= '03') {
                let rt = startYearActionPlan - 1;
                if ((rt == selectYear) && (endYearActionPlan != selectYear)) {
                  //Owners[startMonth] = "0";
                  Owners[startMonth] = { "a": "0", "b": false };
                }
                if (startMonthChack <= monthChack) {


                  if (month == HalfMonth || month == startMonth) {

                    // console.log("firstttttt");


                    let ryi = selectYear + 1;
                    if (ryi > this.currentYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": false };
                    }

                    // if (ryi < this.currentYear && selectYear >= startYearActionPlan) {
                    //   Owners[month] = { "a": "1", "b": true };

                    // }

                    if (ryi < this.currentYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    else if (ryi == this.currentYear && selectYear >= startYearActionPlan) {
                      // console.log("secondddddddd");
                      if (currentMonth > monthChack) {
                        Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                      }
                      if (currentMonth < monthChack) {
                        Owners[month] = { "a": "1", "b": false };
                      }
                    }
                  }
                }
              }
              if (startMonthChack >= '04') {
                if ((selectYear == startYearActionPlan) && (endYearActionPlan != selectYear)) {
                  Owners[startMonth] = { "a": "0", "b": false };
                }
              }

              if (monthChack >= '04') {
                if (month == HalfMonth || month == startMonth) {

                  // console.log("firstttttt");
                  if (selectYear < this.currentYear && selectYear >= startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": true };

                  }
                  else if (selectYear >= this.currentYear) {
                    // console.log("secondddddddd");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }

            if (selectYear <= endYearActionPlan || selectYear == startYearActionPlan) {

              if (endMonthChack <= '03') {
                var erryy = endYearActionPlan - 1;

                if ((erryy == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }
                  }
                }
                if ((erryy == selectYear) && (startYearActionPlan == selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }
                  }
                }




              }

              // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              //   if (selectYear > this.currentYear) {
              //     Owners[month] = { "a": "1", "b": false };
              //   }
              //}
              if (endMonthChack >= '04') {

                if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }

                  }
                }
              }

            }



            if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
              if (endMonthChack >= monthChack) {
                // if (month == endMonth) {
                //   Owners[month] = { "a": "3", "b": false };
                // }
                if (month == startMonth || month == HalfMonth) {
                  if (monthChack >= '04' && endMonthChack > monthChack) {

                    if (selectYear < this.currentYear) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    // for previous month review just before endmonth
                    else if (selectYear >= this.currentYear) {

                      Owners[month] = { "a": "1", "b": false };

                    }
                  }

                }
                // else {
                //   Owners[month] = "";
                // }
              }
            }
            else if (selectYear < this.currentYear && startYearActionPlan !== selectYear && selectYear >= startYearActionPlan) {
              if (month == startMonth || month == HalfMonth) {
                Owners[month] = { "a": "1", "b": true };
              }

            }
            else if (selectYear > this.currentYear && endYearActionPlan !== selectYear) {
              let selyaer = selectYear + 1;
              if (selyaer !== endYearActionPlan) {
                if (month == startMonth || month == HalfMonth) {
                  Owners[month] = { "a": "1", "b": false };
                }

              }
            }
            // 1 year 
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              if (startMonthChack <= monthChack && endMonthChack >= monthChack) {
                if (month == startMonth) {
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == HalfMonth) {
                  if (currentMonth > monthChack) {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            //1 year End
            else {
              // console.log("asasasa");
              if (selectYear >= startYearActionPlan && selectYear < endYearActionPlan) {
                let rtt = endYearActionPlan - 1;
                let plus = selectYear + 1;
                if (plus !== endYearActionPlan && endMonthChack >= '04') {
                  if (selectYear !== rtt) {
                    if (selectYear == this.currentYear) {
                      if (month == startMonth || month == HalfMonth) {
                        if (monthChack < currentMonth && actualReviewDate < todayDate) {
                          Owners[month] = { "a": "1", "b": true };
                        }

                        else {
                          Owners[month] = { "a": "1", "b": false };
                        }
                      }
                    }

                    if (month == startMonth || month == HalfMonth) {
                      if (currentMonth > monthChack) {
                        console.log("kkkkkk");

                        Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                      }
                      // else {
                      //   console.log("dfefeef");

                      //   Owners[month] = { "a": "1", "b": false };
                      // }
                    }
                  }
                }
              }
            }

          });
        }
      }
      else if (actionPlan.control_point == 'Yearly') {
        let YearlyMonth = moment(actionPlan.start_date).add(11, 'months').calendar();
        let YlyMonth = moment(YearlyMonth, 'MM/DD/YYYY').format('MMM').toLowerCase();
        if (this.companyFinancialYear == 'jan-dec') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
              //Owners[startMonth] = "0";
              Owners[startMonth] = { "a": "0", "b": false };
              if (startMonthChack <= monthChack) {
                if (month == YlyMonth) {
                  if (startYearActionPlan < this.currentYear) {
                    if (currentMonth > monthChack) {

                      Owners[month] = { "a": "1", "b": true };
                    }
                  }
                  else {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                }
              }
            }
            else if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
              // if (startMonthChack <= monthChack) {
              if (month == endMonth) {
                Owners[month] = { "a": "3", "b": false };
              }
              // else if (month == startMonth) {
              //   // monthChack < endMonth &&
              //   Owners[month] = { "a": "1", "b": false };
              // }
              /* else if (month == startMonth) {
                Owners[month] = { "a": "1", "b": false };
              } */
              // else {
              //   Owners[month] = "";
              // }
              // }
            }
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              if (startMonthChack <= monthChack && endMonthChack >= monthChack) {
                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == startMonth) {
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month == YlyMonth) {
                  if (currentMonth > monthChack) {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }

            if (month == startMonth) {
              if (selectYear == this.currentYear) {
                if (currentMonth > monthChack && actualReviewDate < todayDate) {

                  Owners[month] = { "a": "1", "b": true };
                }
                else if (currentMonth > monthChack && actualReviewDate > todayDate) {
                  Owners[month] = { "a": "1", "b": false };
                }
                else if (currentMonth < monthChack) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
              else if (selectYear < this.currentYear && startYearActionPlan !== selectYear) {
                Owners[month] = { "a": "1", "b": true };
              }
              else if (selectYear > this.currentYear && startYearActionPlan !== selectYear && selectYear !== endYearActionPlan) {
                Owners[month] = { "a": "1", "b": false };
              }
            }

          });
        }

        if (this.companyFinancialYear == 'april-march') {
          this.MONTHS.map((month) => {
            let monthChack = moment().month(month).format("MM");
            if (selectYear !== endYearActionPlan) {
              if (startMonthChack <= '03') {
                let rt = startYearActionPlan - 1;
                if ((rt == selectYear) && (endYearActionPlan != selectYear)) {
                  //Owners[startMonth] = "0";
                  Owners[startMonth] = { "a": "0", "b": false };
                }
                if (startMonthChack <= monthChack) {


                  if (month == startMonth) {

                    // console.log("firstttttt");


                    let ryi = selectYear + 1;
                    if (ryi > this.currentYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": false };
                    }

                    // if (ryi < this.currentYear && selectYear >= startYearActionPlan) {
                    //   Owners[month] = { "a": "1", "b": true };

                    // }

                    if (ryi < this.currentYear && selectYear >= startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    else if (ryi == this.currentYear && selectYear >= startYearActionPlan) {
                      // console.log("secondddddddd");
                      if (currentMonth > monthChack) {
                        Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                      }
                      if (currentMonth < monthChack) {
                        Owners[month] = { "a": "1", "b": false };
                      }
                    }
                  }
                }
                // if ((startYearActionPlan == selectYear) && (endYearActionPlan != selectYear)) {
                //   //Owners[startMonth] = "0";
                //   Owners[startMonth] = { "a": "0", "b": false };
                // if (startMonthChack <= monthChack) {
                //   if (month == YlyMonth) {
                //     if (startYearActionPlan < this.currentYear) {
                //       if (currentMonth > monthChack) {

                //         Owners[month] = { "a": "1", "b": true };
                //       }
                //     }
                //     else {
                //       Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                //     }
                //   }
                // }
              }
              if (startMonthChack >= '04') {
                if ((selectYear == startYearActionPlan) && (endYearActionPlan != selectYear)) {
                  Owners[startMonth] = { "a": "0", "b": false };
                }
              }

              if (monthChack >= '04') {
                if (month == startMonth) {

                  // console.log("firstttttt");
                  if (selectYear < this.currentYear && selectYear >= startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": true };

                  }
                  else if (selectYear >= this.currentYear) {
                    // console.log("secondddddddd");
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }

            // hhhh


            if (selectYear <= endYearActionPlan || selectYear == startYearActionPlan) {

              if (endMonthChack <= '03') {
                var erryy = endYearActionPlan - 1;

                if ((erryy == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }
                  }
                }
                if ((erryy == selectYear) && (startYearActionPlan == selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }
                  }
                }




              }

              // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              //   if (selectYear > this.currentYear) {
              //     Owners[month] = { "a": "1", "b": false };
              //   }
              //}
              if (endMonthChack >= '04') {

                if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }

                  }
                }
              }


              if (endMonthChack >= '04') {

                if ((endYearActionPlan == selectYear) && (startYearActionPlan == selectYear)) {
                  if (endMonthChack >= monthChack) {
                    if (month == endMonth) {
                      Owners[month] = { "a": "3", "b": false };
                    }

                  }
                }
              }

            }
            // hhh

            else if ((endYearActionPlan == selectYear) && (startYearActionPlan != selectYear)) {
              if (startMonthChack <= monthChack) {
                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                // else if (month == startMonth) {
                //   // monthChack < endMonth &&
                //   Owners[month] = { "a": "1", "b": false };
                // }
                /* else if (month == startMonth) {
                  Owners[month] = { "a": "1", "b": false };
                } */
                else {
                  Owners[month] = "";
                }
              }
            }
            else if ((startYearActionPlan == selectYear) && (endYearActionPlan == selectYear)) {
              if (startMonthChack <= monthChack && endMonthChack >= monthChack) {
                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }
                else if (month == startMonth) {
                  Owners[month] = { "a": "0", "b": false };
                }
                else if (month == YlyMonth) {
                  if (currentMonth > monthChack) {
                    Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
              }
            }
            else {
              if (month == startMonth) {
                if (selectYear == this.currentYear) {
                  if (currentMonth > monthChack && actualReviewDate < todayDate) {

                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (currentMonth > monthChack && actualReviewDate > todayDate) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                  else if (currentMonth < monthChack) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
                else if (selectYear < this.currentYear && startYearActionPlan !== selectYear && selectYear > startYearActionPlan) {
                  Owners[month] = { "a": "1", "b": true };
                }
                else if (selectYear > startYearActionPlan && selectYear < endYearActionPlan && endMonthChack > '04') {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
          });
        }
      }

      const coOwners = [...actionPlan.action_plans_assign_user];

      if (_.isArray(coOwners) && !_.isEmpty(coOwners)) {
        coOwners.map((coOwner: any) => {
          const _owners = { ...Owners };
          //user last month status
          _owners['co_owner_name'] = coOwner.user_name;
          _owners['action_plan_id'] = coOwner.action_plan_id;
          _owners['co_owner_id'] = coOwner.co_owner_id;
          const schedules = [...coOwner.schedules];
          if (_.isArray(schedules) && !_.isEmpty(schedules)) {
            let lastMonthStatus = _.sortBy(coOwner.schedules, function (dateObj) {
              return new Date(dateObj.month_date);
            });
            _owners['status_name'] = lastMonthStatus.slice(-1)[0].status_name;
            this.MONTHS.map((month) => {
              let monthChack2 = parseInt(moment().month(month).format("MM"));
              // let monthhhh = Number(monthChack2);
              // console.log("fdfdf", monthhhh);

              schedules.map((schedule: any) => {
                console.log('schedule schedule', schedule);

                // scheduleMonth format Month  ( jan feb mar )
                //  monthChack  format Month  (1 to 12)
                // reviewMonthDay  format day
                // reviewMonth   format Month  (1 to 12)
                const scheduleMonth = moment(schedule.month_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
                console.log("scheduleMonth", scheduleMonth);

                const monthChack = parseInt(moment(schedule.month_date, 'YYYY-MM-DD').format('MM'));

                console.log("fdfdf", monthChack);

                let monthhhh = Number(moment(schedule.month_date, 'YYYY-MM-DD').format('MM'));
                console.log("fdfdf", monthhhh);

                const monthChackYear = parseInt(moment(schedule.month_date, 'YYYY-MM-DD').format('YYYY'));
                console.log("monthChackYear", monthChackYear);
                const reviewMonth = parseInt(moment(schedule.review_month_date, 'YYYY-MM-DD').format('MM'));
                console.log("reviewMonth", reviewMonth);
                const reviewMonthYear = parseInt(moment(schedule.review_month_date, 'YYYY-MM-DD').format('YYYY'));

                const reviewMonthDay = moment(schedule.review_month_date, 'YYYY-MM-DD').format('DD');

                let rtt = monthhhh + 1;
                if ((reviewMonthYear > monthChackYear) && (monthChack !== currentnumprevious)) {
                  _owners[scheduleMonth] = { "a": "2", "b": true };
                }
                if ((reviewMonthYear > monthChackYear)) {
                  _owners[scheduleMonth] = { "a": "2", "b": true };
                }

                else if (reviewMonthYear == monthChackYear) {

                  if ((monthhhh == currentnumprevious) && (selectYear == this.currentYear)) {
                    _owners[scheduleMonth] = { "a": "2", "b": false };

                  }
                  if ((monthhhh !== currentnumprevious) && (selectYear == this.currentYear)) {
                    _owners[scheduleMonth] = { "a": "2", "b": true };

                  }
                }




                // else if (reviewMonthYear == monthChackYear) {


                //   if (reviewMonth > monthChack) {
                //     _owners[scheduleMonth] = { "a": "2", "b": true };
                //   }
                //   if (reviewMonth <= monthChack) {
                //     _owners[scheduleMonth] = { "a": "2", "b": false };
                //   }

                // }




                // else if ((reviewMonth > monthChack) && (reviewMonthYear == monthChackYear)) {
                //   //console.log('2222ttttt22');
                //   let testt = monthChack + 1;
                //   if (testt == this.currentMonth) {
                //     _owners[scheduleMonth] = { "a": "2", "b": reviewMonthDay > actualReviewDate };
                //   } else if (testt !== this.currentMonth) {
                //     //console.log('222rrr222');
                //     _owners[scheduleMonth] = { "a": "2", "b": true };
                //   }

                // }
                // else if (reviewMonth == monthChack && this.currentYear > monthChackYear) {
                //   _owners[scheduleMonth] = { "a": "2", "b": false };
                //   console.log('11111');
                // }
                // else {
                //   _owners[scheduleMonth] = { "a": "2", "b": false };
                //   console.log('222222');
                // }


                _owners['comment'] = schedule.comment;
              })
            })
          }
          SOBJDATA.push(_owners);
        });
      }
      SOBJDATA.map((co_owner_id: any, index: number) => {
        co_owner_id.sr_no = index + 1;
      });
      actionPlan['datasource'] = new MatTableDataSource<PeriodicElement>(SOBJDATA);
      actionPlan['years'] = actionPlanYears;
    })

  }
  initiativeDataPDF() {
    this.loaderService.show();
    this.allExpandState = true;
    setTimeout(() => {
      var data = document.getElementById('initiative-data');
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jspdf('p', 'mm', 'a4');
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('masterActionPlan.pdf');
        this.loaderService.hide();
        this.allExpandState = true;
      });
    }, 50);
  }
}


export interface PeriodicElement {
  sr_no: number;
  definition: string;
  target: string;
  co_owner_name: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  jan: string;
  feb: string;
  mar: string;
  status: string;
  status_name: string;
  comment: string;
}
export interface DialogData {
  animal: string;
  name: string;
}
export interface PeriodicElementLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_LESENT: PeriodicElementLesent[] = [
  { lesent_name: 'Green', lesent_description: 'Closed' },
  { lesent_name: 'Yellow', lesent_description: 'Open' },
  { lesent_name: 'Red', lesent_description: 'Delayed' },
  { lesent_name: 'Gray', lesent_description: 'Closed With Delay' },
  { lesent_name: 'Blue', lesent_description: 'On Hold' }
];
@Component({
  selector: 'change-review',
  templateUrl: 'change_review.component.html',
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ChangeReview implements OnInit {
  // minDate = new Date(2000, 0, 1);
  minMaxDate = new Date();
  implement_data: any;
  changeReviewForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  currentUser: any;
  reviewDataGet: any;
  userrole: any;
  straObjStatus: any;
  responsibleUser: any;
  commentStatus: any;
  requiredDta: any
  allExpandState: any;
  month_date: any;
  reviewMonthDate: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  dataActionOwner: any;
  constructor(
    public dialogRef: MatDialogRef<ChangeReview>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe
    // @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));

    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

    this.allExpandState = true;
    this.reviewDataGet = this.data;
    let action_plan_id = this.reviewDataGet.element.action_plan_id;
    let co_owner_id = this.reviewDataGet.element.co_owner_id;
    var dateObj = new Date();
    var month = this.reviewDataGet.monthDate + 1;
    var day = dateObj.getUTCDate();
    if (this.companyFinancialYear == 'jan-dec') {
      var year = this.reviewDataGet.selectYear;
    }
    else if (this.companyFinancialYear == 'april-march') {
      var year22 = this.reviewDataGet.selectYear;
      if (month <= 3) {
        var year = year22 + 1;
      }
      else if (month > 3) {
        var year = year22;
      }
    }
    let newdate = day + "/" + month + "/" + year;
    this.month_date = moment(newdate, 'DD-MM-YYYY').format('DD-MM-YYYY');  //selectYear
    console.log("monthDate", this.month_date);

    let now = new Date();
    this.reviewMonthDate = moment(now, 'MM-DD-YYYY').format('DD-MM-YYYY');
    console.log("reviewMonthDate", this.reviewMonthDate);

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.changeReviewForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      action_plan_id: [action_plan_id, Validators.required],
      co_owner_id: [co_owner_id, Validators.required],
      month_date: [this.month_date, Validators.required],
      review_month_date: [this.reviewMonthDate],
      status: ['', Validators.required],
      comment: ['', Validators.required],
      recovery_plan: [''],
      implement_data: [''],
      responsibility: [''],
    });
    this.strObjStatusGet();
    this.SelectModuleGet();
    this.commentStatus = false;
  }
  // SelectModuleGet() {
  //   this.userService.GetSelectModule().pipe(first()).subscribe(
  //     (data: any) => {
  //       this.userrole = data;
  //       this.responsibleUser = this.userrole.data.users;
  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }
  SelectModuleGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe((data: any) => {
      this.dataActionOwner = data.data;
      //console.log("user-order", this.dataActionOwner)
      // this.userService.GetSelectModule().pipe(first()).subscribe(
      //     (data: any) => {
      //         this.dataActionOwner = data.data.users;
      //         console.log("user-order", this.dataActionOwner);


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
        //.str_obj_statuses
      },
      error => {
        this.alertService.error(error);
      });
  }
  changeStatus(event: any) {
    if (event == 5) {
      this.commentStatus = true;
    }
    else {
      this.commentStatus = false;
    }
  }
  changeReviewClose(): void {
    this.dialogRef.close();
  }
  changeReviewSubmit() {
    this.submitted = true;
    if (this.changeReviewForm.invalid) {
      return;
    }

    let latest_implement_data = this.datepipe.transform(this.implement_data, 'dd/MM/yyyy');
    this.changeReviewForm.value.implement_data = latest_implement_data;
    this.userService.changeReview(this.changeReviewForm.value).pipe(first()).subscribe(
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
}
@Component({
  selector: 'user-comment-sheet',
  templateUrl: 'user-comment-sheet.html',
})
export class UserCommentSheet implements OnInit {
  currentUser: any;
  CommentDataGet: any;
  co_owner_name: any;
  displayedColumnsComment: string[] = ['sr_no', 'month_date', 'definition', 'comment', 'recovery_plan', 'implement_data', 'responsibility_name', 'status_name'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<UserCommentSheet>,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
  ) {
  }
  ngOnInit(): void {
    this.CommentDataGet = this.data;
    this.co_owner_name = this.CommentDataGet.data[0].co_owner_name;
    this.CommentDataGet.data.map((ActionComment: any, index: number) => {
      ActionComment.sr_no = index + 1;
    });
    const ELEMENT_DATA_COMMENT: PeriodicElementComment[] = this.CommentDataGet.data;
    this.dataSource = new MatTableDataSource<PeriodicElementComment>(ELEMENT_DATA_COMMENT);
  }
}
export interface PeriodicElementComment {
  sr_no: number;
  month_date: string;
  recovery_plan: string;
  definition: string;
  comment: string;
  implement_data: string;
  responsibility_name: string;
  status_name: string;
}
