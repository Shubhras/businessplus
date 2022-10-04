import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
//import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import { ComboChartConfig } from './ComboChartConfig';
import { LineChartConfig } from './LineChartConfig';
import * as _ from 'lodash';
import * as moment from 'moment';
import { targetActualDialod } from '../../common-dialog/kpi-actual/target-actual.component';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../../_models';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { addActualDialod } from '../../kpitrackers/addkpidata/addactual.component';

@Component({
  selector: 'action-comment',
  templateUrl: './action-comment.component.html',
  styleUrls: ['./action-comment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActionCommentComponent implements OnInit {
  currentUser: any;
  id: number;
  sub: any;
  modulesAllData: any;
  module: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  ttttt: number;

  lesentGreen: any;
  lesentYellow: any;
  lesentRed: any;
  actionCommentData: any;
  strategic_objectives_sr_no: any;
  strategic_objectives_description: any;
  initiatives_sr_no: any;
  initiatives_definition: any;
  action_plans_sr_no: any;
  action_plans_definition: any;
  kpiGraphData: any;
  renderKPIData: Array<any>;
  kpisData: any;
  dept_name: string;
  public chartType: string = 'line';
  hasBackdrop: any;
  mode: any;
  elementID: string;
  IdealTrend: string;
  comparekpi: any;
  config1: LineChartConfig;
  currentYear: any;
  currentYearPlusOne: any;
  currentYearFull: any;
  selectYear: any;
  actionPlanYears: Array<any> = [];
  selectedYearVal: any;
  startYearActionPlan: any;
  endYearActionPlan: any;
  displayedColumns: Array<any>;

  // DateAdapter:any;
  // actionPlanColor:any;
  displayedColumnsAction: string[] = ['action_plans_sr_no', 'definition', 'action_plans_assign_user', 'dept_name', 'action_plan_kpi_data',
    'target', 'start_date', 'end_date', 'percentage', 'status_name'];
  dataSourceAction: any;

  dataSource: any;
  MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  displayedColumnsComment: string[] = ['sr_no', 'comment', 'recovery_plan', 'review_date'];
  dataSourceComment: any;
  displayedColumnsKPI: string[] = ['definition', 'year_for', 'one_year', 'two_year', 'three_year', 'four_year'];
  dataSourceKPI: any;
  userModulePermission: any;
  currentMonth: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  allDetailsCompany: any;
  initiDataPermission: any;
  companyFinancialYear: any;
  currentYear2: string;
  currentYearSubscription: any;
  userSelectedYear: any;
  unit_id: any;
  nextDate: any;
  nextd: any;

  strategicAllData: any;
  deptAccorPermission: any;
  kpiDataPermission: any;
  kpiTargetsPermission: any;
  kpiActualsPermission: any;
  login_access_token: any;
  company_id: any;
  userSelectedYearFull: any;
  targetAndActualDisabled: any;
  testreviewstatus2: any;
  testreviewkpi_id: any;
  /**
   * Constructor
   *
   * @param {ActionPlanService} _initiativeService
   */
  constructor(
    private route: ActivatedRoute,
    private router: RouterModule,
    private routers: Router,

    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.config1 = new LineChartConfig('', 0);
    let nowCurrentYear = new Date();
    this.currentYearFull = Number(moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY'));
    this.selectedYearVal = this.currentYearFull;
    this.currentYear = moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY');
    this.currentYearPlusOne = Number(this.currentYear) + 1;

    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

    if (this.companyFinancialYear == 'april-march') {
      this.displayedColumns = ['sr_no', 'definition', 'target', 'co_owner_name', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'status_name'];


      let Slice = this.displayedColumns.slice(4, 13);
    }



    else {
      this.displayedColumns = ['sr_no', 'definition', 'target', 'co_owner_name', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
        'sep', 'oct', 'nov', 'dec', 'status_name'];

    }
    this.currentMonth = moment(new Date()).format("MM");
    this.currentYear2 = moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY');
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.deptAccorPermission = this.currentUser.dept_id;
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Initiative_datas") {
        this.initiDataPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Kpi_datas") {
        this.kpiDataPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Kpi_targets") {
        this.kpiTargetsPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Kpi_actuals") {
        this.kpiActualsPermission = this.userModulePermission[i];
      }
    }


    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;     
      this.viewStrategicObjectives();
      this.targetAndActualButton();
      this.actionDataByYear(this.userSelectedYearFull);
    });
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    //set header by financial year and month
    if (this.companyFinancialYear == "april-march") {
      this.displayedColumnsKPI.push('apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'ytd', 'action');
    }
    else {
      this.displayedColumnsKPI.push('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd', 'action');
    }
    this.actionPlansComment();
    this.strObjStatusGet();
  }
  targetAndActualButton() {

    let currentYear = this.userSelectedYear;
    if (this.companyFinancialYear == 'april-march') {
      let currentFullDate = new Date(); //Year, Month, Date
      let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
      let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
      if (currentFullDate.getTime() >= dateOne.getTime() && currentFullDate.getTime() <= dateTwo.getTime()) {
        this.targetAndActualDisabled = false;
      } else {
        this.targetAndActualDisabled = true;
      }
    } else {
      if (this.userSelectedYear == currentYear) {
        this.targetAndActualDisabled = false;
      } else {
        this.targetAndActualDisabled = true;
      }
    }
  }
  getColorActual(eleYear, eleMonth, eleLabel) {
    if (eleYear === 'Actual' && eleMonth !== '') {
      if (eleLabel == '#f40000' || eleLabel == '#4caf50') {
        return {
          'background-color': eleLabel,
          'color': '#fff',
          'font-weight': '700',
          //'font-size': '12px'
        };
      }
      else {
        return {
          'background-color': eleLabel,
          'font-weight': '700',
          //'font-size': '12px'
        };
      }
    }
    else {
      return { 'background-color': '' };
    }
  }

  getColor(year_for: any, color: any) {
    if (year_for == 'Actual') {
      if (color == '#f40000' || color == '#4caf50') {
        return {
          'background-color': color,
          'color': '#fff',
          'font-weight': '700',
        };
      }
      else {
        return {
          'background-color': color,
          'font-weight': '700',
        };
      }
    }
    else {
      return { 'background-color': '' };
    }
  }

  changeReviewOpen(element, monthDate, selectYear): void {
    if (this.companyFinancialYear == 'jan-dec') {
      if (Number(this.currentYear2) == selectYear) {
        if (monthDate + 1 <= this.currentMonth) {
          if (this.initiDataPermission.acc_edit == 1) {
            const dialogRef = this.dialog.open(ChangeReview, {
              data: { element, monthDate, selectYear }

            });
            // console.log("ele", element);
            dialogRef.afterClosed().subscribe(result => {
              if (result == "YesSubmit") {
                this.viewStrategicObjectives();
              }
            });
          }
        }
      }

      if (Number(this.currentYear2) > selectYear) {
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
      // console.log("example", monthdte + 1);


      if (monthdte <= 3) {
        var popupy = selectYear + 1;
        // console.log("example2", popupy);

        if (Number(this.currentYear2) == popupy || Number(this.currentYear2) > selectYear) {
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
        // if (Number(this.currentYear2) > selectYear) {
        //   if (this.initiDataPermission.acc_edit == 1) {
        //     const dialogRef = this.dialog.open(ChangeReview, {
        //       data: { element, monthDate, selectYear }
        //     });
        //     dialogRef.afterClosed().subscribe(result => {
        //       if (result == "YesSubmit") {
        //         this.viewStrategicObjectives();
        //       }
        //     });
        //   }

        // }
      }
      if (monthdte > 3) {

        if (Number(this.currentYear2) == selectYear || Number(this.currentYear2) > selectYear) {
          if (this.currentMonth >= monthdte) {
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

        if (Number(this.currentYear2) > selectYear) {
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


  viewStrategicObjectives() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;

    let financialYear = this.companyFinancialYear;
    this.userService.strategicObjectivesData(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {

        this.strategicAllData = data.data;


        //this.strategicAllData = [{ "id": 23, "dept_name": "Research &  Development", "strategic_objectives": [{ "strategic_objectives_id": 68, "target": "SOP on time", "start_date": "2018-04-07", "end_date": "2023-04-08", "unit_id": 3, "unit_name": "Washington", "department_id": 23, "dept_name": "Research &  Development", "user_id": 20, "user_name": "Arpit", "tracking_frequency": "Quarterly", "description": "Launch 25 new product with New technology", "uom_name": "Date", "status_name": "Yellow", "percentage": "90", "initiatives": [{ "sr_no": "68.1", "initiatives_id": 58, "definition": "Created Detailed Product development road map and launch plan for all 25 products", "s_o_id": 68, "description": "Launch 25 new product with New technology", "dept_id": 23, "dept_name": "Research &  Development", "section_id": 31, "section_name": "Design", "user_id": 20, "start_date": "2018-04-11", "end_date": "2023-04-04", "percentage": "89", "status_name": "Red", "action_plans": [{ "sr_no": "67.1.4", "action_plans_id": 176, "definition": "action plane 03-09-2020", "target": "fdgdfgdfgdfg", "start_date": "2019-01-08", "end_date": "2020-07-09", "control_point": "Monthly", "co_owner": "[15,16]", "status": 4, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "95", "status_name": "Yellow", "reminder_date": "16", "action_plans_assign_user": [{ "action_plan_id": 176, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [{ "schedule_id": 90, "month_date": "2019-02-06", "review_month_date": "2021-02-06", "comment": "test-two", "recovery_plan": "testing", "implement_data": "2021-02-09", "co_owner_id": 15, "status": "3", "status_name": "Green", "responsibility_id": 23, "responsibility_name": null, "co_owner_name": "pradeepppp mukati" }] }, { "action_plan_id": 176, "co_owner_id": 16, "user_name": "Rajesh", "schedules": [] }] }, { "sr_no": "68.1.7", "action_plans_id": 191, "definition": "quaterlyyyyyyyyyyy", "target": "business test", "start_date": "2019-01-29", "end_date": "2022-11-18", "control_point": "Quarterly", "co_owner": "[15]", "status": 5, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "18", "action_plans_assign_user": [{ "action_plan_id": 191, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [{ "schedule_id": 122, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 15, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "pradeepppp mukati" }] }] }, { "sr_no": "68.1.9", "action_plans_id": 193, "definition": "quaterly reminde date irs greate", "target": "testing", "start_date": "2020-01-08", "end_date": "2022-08-12", "control_point": "Quarterly", "co_owner": "[3,18]", "status": 5, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "26", "action_plans_assign_user": [{ "action_plan_id": 193, "co_owner_id": 3, "user_name": "sotam", "schedules": [{ "schedule_id": 124, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 3, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 193, "co_owner_id": 18, "user_name": "lata", "schedules": [{ "schedule_id": 125, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 18, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "Arpit" }] }] }, { "sr_no": "68.1.12", "action_plans_id": 203, "definition": "quaterly", "target": "okay", "start_date": "2019-01-09", "end_date": "2023-04-03", "control_point": "Quarterly", "co_owner": "[23]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "19", "action_plans_assign_user": [{ "action_plan_id": 203, "co_owner_id": 23, "user_name": "sotam", "schedules": [{ "schedule_id": 139, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 23, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }] }, { "sr_no": "68.1.14", "action_plans_id": 205, "definition": "quaterly 2", "target": "fdefefe", "start_date": "2019-04-05", "end_date": "2022-03-18", "control_point": "Quarterly", "co_owner": "[21]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "12", "action_plans_assign_user": [{ "action_plan_id": 205, "co_owner_id": 21, "user_name": "kalpna", "schedules": [{ "schedule_id": 141, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 21, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "sotam" }] }] }, { "sr_no": "68.1.15", "action_plans_id": 206, "definition": "half yearly", "target": "okay", "start_date": "2020-01-06", "end_date": "2023-04-03", "control_point": "Half Yearly", "co_owner": "[22,27]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "19", "action_plans_assign_user": [{ "action_plan_id": 206, "co_owner_id": 22, "user_name": "kalpna", "schedules": [{ "schedule_id": 142, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 22, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 206, "co_owner_id": 27, "user_name": "Rajendra Rajput", "schedules": [{ "schedule_id": 143, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 27, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": "Rajendra Rajput" }] }] }, { "sr_no": "68.1.16", "action_plans_id": 207, "definition": "half yearly end in jan", "target": "1 Year 0 Month 0 Days", "start_date": "2020-01-01", "end_date": "2022-01-06", "control_point": "Half Yearly", "co_owner": "[20]", "status": 1, "initiatives_id": 58, "user_id": 20, "co_owner_name": null, "percentage": "", "status_name": "Gray (Started)", "reminder_date": "12", "action_plans_assign_user": [{ "action_plan_id": 207, "co_owner_id": 20, "user_name": "Arpit", "schedules": [{ "schedule_id": 144, "month_date": "0000-00-00", "review_month_date": null, "comment": "", "recovery_plan": "", "implement_data": "0000-00-00", "co_owner_id": 20, "status": "1", "status_name": "Gray (Started)", "responsibility_id": 0, "responsibility_name": null, "co_owner_name": null }] }] }] }, { "sr_no": "68.2", "initiatives_id": 83, "definition": "Develop market for low end and high end and premium segment and distinguish USP and value proposition for all products", "s_o_id": 68, "description": "Launch 25 new product with New technology", "dept_id": 23, "dept_name": "Research &  Development", "section_id": 31, "section_name": "Design", "user_id": 20, "start_date": "2019-02-05", "end_date": "2020-12-30", "percentage": "90", "status_name": "Yellow", "action_plans": [{ "sr_no": "68.2.1", "action_plans_id": 126, "definition": "Market segment product delivery", "target": "95", "start_date": "2019-06-04", "end_date": "2019-11-28", "control_point": "Monthly", "co_owner": "[3]", "status": 4, "initiatives_id": 83, "user_id": 20, "co_owner_name": null, "percentage": "0", "status_name": "Yellow", "reminder_date": "04", "action_plans_assign_user": [{ "action_plan_id": 126, "co_owner_id": 3, "user_name": "sotam", "schedules": [] }] }, { "sr_no": "68.2.2", "action_plans_id": 127, "definition": "Design complete and open delivery gate", "target": "89", "start_date": "2019-06-06", "end_date": "2019-12-20", "control_point": "Monthly", "co_owner": "[3,15]", "status": 5, "initiatives_id": 83, "user_id": 20, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "04", "action_plans_assign_user": [{ "action_plan_id": 127, "co_owner_id": 3, "user_name": "sotam", "schedules": [{ "schedule_id": 88, "month_date": "2019-08-05", "review_month_date": "2021-02-05", "comment": "testfor", "recovery_plan": "testing project-businessplus", "implement_data": "2021-02-12", "co_owner_id": 3, "status": "3", "status_name": "Green", "responsibility_id": 17, "responsibility_name": "lata", "co_owner_name": null }, { "schedule_id": 89, "month_date": "2019-08-05", "review_month_date": "2021-02-05", "comment": "test-two", "recovery_plan": "testing", "implement_data": "2021-02-13", "co_owner_id": 3, "status": "2", "status_name": "Blue (Hold)", "responsibility_id": 20, "responsibility_name": null, "co_owner_name": null }] }, { "action_plan_id": 127, "co_owner_id": 15, "user_name": "pradeep mukati", "schedules": [] }] }] }] }] }]
        // this.processData(this.strategicAllData);
        // console.log("hjjjj", this.processData);

      },
      error => {
        this.alertService.error(error);
      });
  }


  kpiCommentOpen(action, kpiId, year): void {
    let kpiATDATA;
    // console.log("datatatta", action, kpiId, year);

    let login_access_token = this.currentUser.login_access_token;
    let kpi_id = kpiId;
    let company_id = this.currentUser.data.company_id;
    // let year = new Date().getFullYear();
    this.userService.getkpiTargetActual(login_access_token, company_id, kpi_id, year).pipe(first()).subscribe(
      (data: any) => {
        kpiATDATA = data.data;
        const dialogRef = this.dialog.open(targetActualDialod, {
          data: kpiATDATA
        });
        dialogRef.afterClosed().subscribe(result => {
        });
      },
      error => {
        this.alertService.error(error);
      });
  }
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
      (data: any) => {
        // console.log('data.data', data.data);
        this.lesentGreen = data.data[2].accuracy_percentage;
        this.lesentYellow = data.data[3].accuracy_percentage;
        this.lesentRed = data.data[4].accuracy_percentage;
      },
      error => {
        this.alertService.error(error);
      });
  }
  actionPlansComment() {

    let login_access_token = this.currentUser.login_access_token;
    let action_plan_id = this.id;
    this.userService.getActionPlansComment(login_access_token, action_plan_id).pipe(first()).subscribe(
      (data: any) => {
        this.actionCommentData = data.data;
        this.strategic_objectives_sr_no = this.actionCommentData.strategic_objectives_sr_no

        this.strategic_objectives_description = this.actionCommentData.strategic_objectives_description
        this.initiatives_sr_no = this.actionCommentData.initiatives_sr_no
        this.initiatives_definition = this.actionCommentData.initiatives_definition
        this.action_plans_sr_no = this.actionCommentData.action_plans_sr_no
        this.action_plans_definition = this.actionCommentData.definition;
        // action plan table data
        const ELEMENT_ACTION_DATA: PeriodicElementAction[] = [data.data];
        this.dataSourceAction = new MatTableDataSource<PeriodicElementAction>(ELEMENT_ACTION_DATA);
        // console.log('this.dataSourceAction',this.dataSourceAction);
        
        // action plan comment table data
        // this.actionCommentData.action_plan_comment.map((ActionPlan: any, index: number) => {
        //   ActionPlan.sr_no = index + 1;
        // });
        const ELEMENT_DATA: PeriodicElementComment[] = this.actionCommentData.action_plan_comment;
        this.dataSourceComment = new MatTableDataSource<PeriodicElementComment>(ELEMENT_DATA);
        // comment table data
        // action plan table data
        let selectYear = this.currentYearFull;
        let endMonthActionPlan = moment(this.actionCommentData.end_date, 'YYYY-MM-DD').format('MMM').toLowerCase();

        let endMonthChack2 = moment().month(endMonthActionPlan).format("MM");
        let startMonthActionPlan = Number(moment(this.actionCommentData.start_date, 'YYY-MM-DD').format('MM'));

        this.startYearActionPlan = Number(moment(this.actionCommentData.start_date, 'YYYY-MM-DD').format('YYYY').toLowerCase());
        this.endYearActionPlan = Number(moment(this.actionCommentData.end_date, 'YYYY-MM-DD').format('YYYY').toLowerCase());
        if (this.companyFinancialYear == "april-march") {
          for (var a = this.startYearActionPlan - 1; a <= this.endYearActionPlan; a++) {
            if (endMonthChack2 <= '03') {
              if (a === this.endYearActionPlan) {
                continue;
              }
            }
            if (startMonthActionPlan > 3) {
              if (a === this.startYearActionPlan - 1) {
                continue;
              }
            }

            this.actionPlanYears.push({ "year_key": a, "year_value": `${a}-${(a + 1).toString().substr(2, 2)}` });
            // actionnnnn.push({ "year_key": a, "year_value": `${a - 1}-${(a).toString().substr(2, 2)}` });

          }
        }

        if (this.companyFinancialYear == "jan-dec") {
          for (a = this.startYearActionPlan; a <= this.endYearActionPlan; a++) {
            this.actionPlanYears.push({ "year_key": a, "year_value": a });
          }
        }

        this.actionPlanSaprate(this.actionCommentData, selectYear);
        // action plan table data
        // kpi data
        this.kpiSaprate(this.actionCommentData);
        // kpi data
      },
      error => {
        this.alertService.error(error);
      });
  }
  actionPlanSaprate(actionPlans: any, selectYear) {
    this.selectYear = selectYear;
    const todayDate = new Date().getDate();
    const currentMonth = moment().format('MM');
    const currentDate = moment().format('DD')

    const currentnum = Number(currentMonth);
    const currentnumprevious = currentnum - 1;

    let actionPlan = actionPlans;
    // console.log('serno', actionPlan);

    let SOBJDATA: PeriodicElement[] = [];
    const Owners: any = {

      "definition": actionPlan.definition,
      "target": actionPlan.target,
      "sr_no": actionPlan.action_plans_sr_no,
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
    };
    const startMonth = moment(actionPlan.start_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
    const endMonth = moment(actionPlan.end_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
    let startMonthChack = moment().month(startMonth).format("MM");
    let endMonthChack = moment().month(endMonth).format("MM");
    let endmonthtest = Number(moment(actionPlan.end_date, 'YYYY-MM-DD').format('MM'));

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
          // console.log("monthChack", monthChack);
          let endmonthtest = Number(moment(actionPlan.end_date, 'YYYY-MM-DD').format('MM'));
          // console.log("endmonthtest", endmonthtest);

          if (endmonthtest < 12) {
            var jantttt = endmonthtest + 1;
          // console.log("jantttt if", jantttt);

          }
          else if (endmonthtest == 12) {
            var jantttt = endmonthtest;
          // console.log("jantttt else ", jantttt);

          }
          // console.log("jantttt", jantttt);

          if (monthChack == startMonthChack && this.startYearActionPlan == selectYear) {
            Owners[month] = { "a": "0", "b": false };
          }
          else if (monthChacktest2 == jantttt && this.endYearActionPlan == selectYear) {
            Owners[month] = { "a": "3", "b": false };
          }

          if (this.startYearActionPlan == selectYear && this.endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest2 < jantttt && selectYear == this.currentYearFull) {
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
          }
          else if (this.startYearActionPlan == selectYear && this.endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest2 < jantttt && selectYear > this.currentYearFull) {
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

          }

          else if (this.startYearActionPlan == selectYear && this.endYearActionPlan != selectYear && monthChack > startMonthChack) {
            if (this.startYearActionPlan < this.currentYearFull) {
              //Owners[month] = { "a": "1", "b": false };
              Owners[month] = { "a": "1", "b": true };
            }
            else if (this.startYearActionPlan == this.currentYearFull) {
              if (monthChacktest2 < this.currentMonth) {
                Owners[month] = { "a": "1", "b": true };
              }
              if (monthChacktest2 >= this.currentMonth) {
                Owners[month] = { "a": "1", "b": false };
              }

            }


          }
          else if (this.endYearActionPlan == selectYear && this.startYearActionPlan != selectYear) {
            if (this.endYearActionPlan < this.currentYearFull) {
              Owners[month] = { "a": "1", "b": true };
            }
            if (this.endYearActionPlan > this.currentYearFull && monthChacktest2 < jantttt) {
              Owners[month] = { "a": "1", "b": false };
            }
            if (this.endYearActionPlan == this.currentYearFull && monthChacktest2 < jantttt) {
              if (monthChacktest2 >= this.currentMonth) {
                Owners[month] = { "a": "1", "b": false };
              }
              else if (monthChacktest2 < this.currentMonth) {
                Owners[month] = { "a": "1", "b": true };
              }
            }
          }


          else if (this.startYearActionPlan == selectYear && this.endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest2 < jantttt) {
            if (this.startYearActionPlan < this.currentYearFull) {
              //Owners[month] = { "a": "1", "b": false };
              Owners[month] = { "a": "1", "b": true };
            }
            // else {
            //   Owners[month] = { "a": "1", "b": false };
            // }

          }


          else {
            if (selectYear == this.currentYearFull && currentMonth > monthChack && selectYear != this.startYearActionPlan && selectYear != this.endYearActionPlan) {

              Owners[month] = { "a": "1", "b": true };
            }
            else {
              if (selectYear == this.currentYearFull && selectYear != this.startYearActionPlan && selectYear != this.endYearActionPlan) {
                if (monthChack < currentMonth && actualReviewDate < todayDate) {

                  Owners[month] = { "a": "1", "b": false };
                }
                else {

                  Owners[month] = { "a": "1", "b": false };
                }

              }

            }

            if (selectYear == this.currentYearFull && selectYear != this.startYearActionPlan && selectYear == this.endYearActionPlan) {
              if (monthChack < currentMonth) {

                Owners[month] = { "a": "1", "b": false };
              }
              else {

                Owners[month] = { "a": "1", "b": true };
              }

            }


            if (selectYear < this.currentYearFull && selectYear !== this.startYearActionPlan && selectYear !== this.endYearActionPlan
              && selectYear > this.startYearActionPlan) {
              Owners[month] = { "a": "1", "b": true };
            }
            if (selectYear > this.currentYearFull && selectYear !== this.endYearActionPlan && selectYear !== this.startYearActionPlan) {
              Owners[month] = { "a": "1", "b": false };
            }

          }

        });

      }

      if (this.companyFinancialYear == 'april-march') {
        this.MONTHS.map((month) => {
          let monthChack = moment().month(month).format("MM");
          let monthChacktest = Number(monthChack);
          // console.log('monthChacktest', monthChacktest);
          // console.log('startYearActionPlan1', startYearActionPlan);
          // console.log('selectYear', selectYear);
          // console.log('startMonthChack', startMonthChack);

          if (selectYear <= this.startYearActionPlan) {
            if (monthChack <= '03') {
              let gj = (this.startYearActionPlan - 1);
              if (monthChack == startMonthChack && gj == selectYear) {

                //console.log('startYearActionPlan2', startYearActionPlan);
                Owners[month] = { "a": "0", "b": false };

              }
            }
            if (monthChack > '03') {
              if (monthChack == startMonthChack && this.startYearActionPlan == selectYear) {
                Owners[month] = { "a": "0", "b": false };

              }
            }
          }
          if (selectYear <= this.endYearActionPlan) {
            if (monthChack <= '03') {
              var ey = this.endYearActionPlan - 1;
              this.ttttt = endmonthtest + 1;
              // console.log("yearplus", this.ttttt);

              if (monthChacktest == this.ttttt && ey == selectYear) {

                Owners[month] = { "a": "3", "b": false };
              }
            }
            if (monthChack > '03') {
              //  this.ttttt = endmonthtest + 1;
              if (monthChacktest == this.ttttt && this.endYearActionPlan == selectYear) {

                Owners[month] = { "a": "3", "b": false };
              }


            }

          }
          if (selectYear == this.endYearActionPlan && selectYear == this.startYearActionPlan) {
            if (monthChack <= '03') {
              var ey = this.endYearActionPlan - 1;

              //console.log("yearplus", tttts);

              if (monthChacktest == this.ttttt && ey == selectYear) {

                Owners[month] = { "a": "3", "b": false };
              }
            }
            if (monthChack > '03') {
              if (monthChacktest == this.ttttt && this.endYearActionPlan == selectYear) {

                Owners[month] = { "a": "3", "b": false };
              }
            }
          }
          if (this.startYearActionPlan == selectYear && this.endYearActionPlan == selectYear && monthChack > startMonthChack && monthChacktest < this.ttttt) {
            if (monthChack >= '04') {
              if (selectYear < this.currentYearFull) {

                // Owners[month] = { "a": "1", "b": false };
                Owners[month] = { "a": "1", "b": true };
              }
              if (selectYear > this.currentYearFull) {
                Owners[month] = { "a": "1", "b": false }
              }
              if (selectYear == this.currentYearFull) {
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
          if (selectYear <= this.startYearActionPlan) {
            if (monthChack <= '03') {
              let sy = this.startYearActionPlan - 1;
              if (sy == selectYear && this.endYearActionPlan != selectYear && monthChack > startMonthChack) {

                if (this.startYearActionPlan < this.currentYearFull) {

                  //Owners[month] = { "a": "1", "b": false };
                  Owners[month] = { "a": "1", "b": true };
                }
                else if (this.startYearActionPlan == this.currentYearFull && monthChack < currentMonth) {

                  Owners[month] = { "a": "1", "b": true };
                }
                else {
                  Owners[month] = { "a": "1", "b": false };
                }

              }
            }
            else if (monthChack > '03') {
              if (this.startYearActionPlan == selectYear && this.endYearActionPlan != selectYear && monthChack > startMonthChack) {

                if (this.startYearActionPlan < this.currentYearFull) {

                  //Owners[month] = { "a": "1", "b": false };
                  Owners[month] = { "a": "1", "b": true };
                }
                else if (this.startYearActionPlan == this.currentYearFull) {
                  if (monthChack >= currentMonth) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                  else if (endMonthChack < currentMonth) {
                    Owners[month] = { "a": "1", "b": true };

                  }
                }

              }
            }
          }
          else if (monthChack <= '03') {
            var endytess = this.endYearActionPlan - 1;
            if (endytess == selectYear && this.startYearActionPlan != selectYear && monthChacktest < this.ttttt) {

              if (this.endYearActionPlan < this.currentYearFull) {

                Owners[month] = { "a": "1", "b": true };
              }
              if (this.endYearActionPlan >= this.currentYearFull) {

                Owners[month] = { "a": "1", "b": false };
              }
            }
          }
          else if (monthChack > '03') {
            if (this.endYearActionPlan == selectYear && this.startYearActionPlan != selectYear && monthChacktest < this.ttttt) {

              if (this.endYearActionPlan < this.currentYearFull) {

                Owners[month] = { "a": "1", "b": true };
              }
              else if (this.endYearActionPlan >= this.currentYearFull) {
                if (monthChack < currentMonth) {

                  Owners[month] = { "a": "1", "b": true };
                }
                else if (monthChack >= currentMonth) {

                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
          }


          if (selectYear >= this.startYearActionPlan && selectYear <= this.endYearActionPlan) {
            if (monthChack <= '03' && monthChacktest != this.ttttt) {
              let selyear2 = selectYear - 1;
              let selcurrent = selectYear + 1;
              let selminus = selcurrent - 1;
              if (selectYear < selcurrent && selcurrent < this.currentYearFull
                && selcurrent >= this.startYearActionPlan) {

                Owners[month] = { "a": "1", "b": true };
              }
              else if (selectYear < selcurrent && selcurrent > this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent < this.endYearActionPlan) {
                //console.log("test15");
                Owners[month] = { "a": "1", "b": false };
              }
              else if (selectYear == selminus && selcurrent == this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent <= this.endYearActionPlan) {

                if (monthChack < currentMonth) {

                  Owners[month] = { "a": "1", "b": true };
                }
                // else {
                //   Owners[month] = { "a": "1", "b": false };
                // }

                if (monthChack >= currentMonth) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }

              else if (selectYear == selminus && selcurrent > this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent <= this.endYearActionPlan) {

                if (monthChack < currentMonth && monthChacktest < this.ttttt) {
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
          if (selectYear >= this.startYearActionPlan && selectYear != this.endYearActionPlan && selectYear < this.endYearActionPlan) {
            if (monthChack <= '03') {
              let selyear2 = selectYear - 1;
              let selcurrent = selectYear + 1;
              let selminus = selcurrent - 1;
              if (selectYear < selcurrent && selcurrent < this.currentYearFull
                && selcurrent >= this.startYearActionPlan) {

                Owners[month] = { "a": "1", "b": true };
              }
              else if (selectYear < selcurrent && selcurrent > this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent < this.endYearActionPlan) {
                //console.log("test15");
                Owners[month] = { "a": "1", "b": false };
              }
              else if (selectYear == selminus && selcurrent == this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent <= this.endYearActionPlan) {

                if (monthChack < currentMonth) {

                  Owners[month] = { "a": "1", "b": true };
                }
                // else {
                //   Owners[month] = { "a": "1", "b": false };
                // }

                if (monthChack >= currentMonth) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }

              else if (selectYear == selminus && selcurrent > this.currentYearFull
                && selcurrent >= this.startYearActionPlan && selcurrent <= this.endYearActionPlan) {

                if (monthChack < currentMonth && monthChacktest < this.ttttt) {
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
          if (selectYear !== this.startYearActionPlan && selectYear !== this.endYearActionPlan) {
            if (monthChack > '03') {

              if (selectYear >= this.currentYearFull && selectYear > this.startYearActionPlan) {
                if (monthChack >= currentMonth) {
                  Owners[month] = { "a": "1", "b": false };
                }
                else if (monthChack < currentMonth) {
                  Owners[month] = { "a": "1", "b": true };
                }
              }
            }
          }


        });

      }
      // console.log('Owners11', Owners);
    }
    else if (actionPlan.control_point == 'Quarterly') {

      let addMonth = 3;
      const quaterlyMonths = [];
      let currentDate = actionPlan.start_date;
      //let halfYearlyMonth = moment(actionPlan.start_date).add(6, 'months').calendar();

      for (var i = 4; i > 0; i--) {
        this.nextDate = moment(currentDate).add(addMonth, 'months').calendar();
        // console.log("nextdate", this.nextDate);

        currentDate = this.nextDate;
        // console.log("nextDate222", currentDate);
        this.nextd = moment(this.nextDate).format("MM");
        // console.log("nexts", this.nextd);

        var QtlMonth = moment(this.nextDate, 'MM/DD/YYYY').format('MMM').toLowerCase();
        quaterlyMonths.push(QtlMonth);
        // console.log("qtl", QtlMonth);

      }
      if (this.companyFinancialYear == 'jan-dec') {
        this.MONTHS.map((month) => {
          let monthChack = moment().month(month).format("MM");
          let endmonthtest = Number(moment(actionPlan.end_date, 'YYYY-MM-DD').format('MM'));
          if (endmonthtest == 12) {
            var oneplus = endmonthtest - 11;
            // console.log("oneplus", oneplus);
          }
          else if (endmonthtest != 12) {
            var oneplus = endmonthtest + 1;
          }
          if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan != selectYear)) {
            //Owners[startMonth] = "0";
            Owners[startMonth] = { "a": "0", "b": false };
            if (startMonthChack <= monthChack) {
              if (quaterlyMonths.indexOf(month) !== -1 && month !== startMonth) {

                if (selectYear < this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": true };
                  //console.log("firsat");
                }
                if (selectYear == this.currentYearFull) {
                  if (monthChack < currentMonth && quaterlyMonths.indexOf(month) !== -1) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else {
                    Owners[month] = { "a": "1", "b": false };
                  }
                  //console.log("firsat");
                }

              }
            }
          }
          else if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
            if (endMonthChack >= monthChack) {
              if (month == endMonth) {
                Owners[month] = { "a": "3", "b": false };
              }
              else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                // if(selectYear > this.currentYearFull){
                //   Owners[month] = { "a": "1", "b": false };
                // }
                if (selectYear < this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": true };
                }
                if (selectYear == this.currentYearFull) {
                  if (monthChack < currentMonth && monthChack < endMonth) {

                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (monthChack >= currentMonth && monthChack < endMonth) {

                    Owners[month] = { "a": "1", "b": false };
                  }

                }
              }


              if (selectYear > this.currentYearFull && quaterlyMonths.indexOf(month) !== -1 && monthChack < endMonthChack) {

                Owners[month] = { "a": "1", "b": false };

              }
            }
          }
          else if (selectYear < this.currentYearFull && this.endYearActionPlan !== selectYear) {
            if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              Owners[month] = { "a": "1", "b": true };
            }

          }
          else if (selectYear > this.currentYearFull && this.endYearActionPlan !== selectYear) {
            if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
              Owners[month] = { "a": "1", "b": false };
            }

          }
          // 1 Year 
          else if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
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
              if (selectYear == this.currentYearFull && currentMonth > monthChack) {

                Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
              }
              else {
                if (selectYear == this.currentYearFull) {
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
          if (selectYear <= this.startYearActionPlan) {

            if (startMonthChack >= '04') {
              if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan != selectYear)) {
                //Owners[startMonth] = "0";

                Owners[startMonth] = { "a": "0", "b": false };

              }
            }
            if (monthChack <= '03') {
              let stYear = this.startYearActionPlan - 1;
              if ((stYear == selectYear) && (this.endYearActionPlan != selectYear)) {
                //Owners[startMonth] = "0";
                Owners[startMonth] = { "a": "0", "b": false };
              }
            }

          }
          if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan != selectYear)) {
            if (startMonthChack <= monthChack) {
              if (quaterlyMonths.indexOf(month) !== -1 && month !== startMonth) {
                if (selectYear < this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": true };
                  //console.log("firsat");
                }

                else if (selectYear > this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": false };
                  //console.log("firsat");
                }
                else if (selectYear == this.currentYearFull) {
                  if (monthChack >= currentMonth) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                  else if (monthChack < currentMonth) {
                    Owners[month] = { "a": "1", "b": true };

                  }
                  //console.log("firsat");
                }
              }
            }
          }

          else if (selectYear <= this.endYearActionPlan || selectYear == this.startYearActionPlan) {

            if (endMonthChack <= '03') {
              var erryy = this.endYearActionPlan - 1;

              if ((erryy == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }


              }
            }

            // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
            //   if (selectYear > this.currentYearFull) {
            //     Owners[month] = { "a": "1", "b": false };
            //   }
            //}
            if (endMonthChack >= '04') {

              if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }

                }
                if (monthChack > '03' && monthChack < endMonthChack) {
                  if (quaterlyMonths.indexOf(month) !== -1 && month !== startMonth) {

                    Owners[month] = { "a": "1", "b": false };
                    //console.log("firsat");

                  }
                }
              }
            }


          }
          if (selectYear <= this.endYearActionPlan || selectYear == this.startYearActionPlan) {

            if (endMonthChack >= '04') {

              if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan == selectYear)) {

                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }


              }
            }
            if (endMonthChack <= '03') {
              let rftu = this.endYearActionPlan - 1;
              if ((rftu == selectYear) && (this.startYearActionPlan == selectYear)) {

                if (month == endMonth) {
                  Owners[month] = { "a": "3", "b": false };
                }


              }
            }
          }

          if (selectYear > this.currentYearFull && this.endYearActionPlan !== selectYear && selectYear >= this.startYearActionPlan && selectYear !== erryy) {

            var te = selectYear + 1;
            if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {

              Owners[month] = { "a": "1", "b": false };
            }
          }
          if (this.endYearActionPlan !== selectYear && selectYear >= this.startYearActionPlan && selectYear == erryy) {

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
          if (selectYear <= this.currentYearFull && this.endYearActionPlan !== selectYear && selectYear >= this.startYearActionPlan) {
            let prr = this.endYearActionPlan - 1;
            if (selectYear !== prr) {
              if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                if (month == 'jan') {
                  var erty = selectYear + 1;
                  let ertyyy = erty - 1;

                  if (erty < this.currentYearFull && ertyyy == selectYear && selectYear >= this.startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  if (selectYear == this.currentYearFull && erty !== this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                  if (erty == this.currentYearFull && ertyyy == selectYear && selectYear >= this.startYearActionPlan) {
                    let mnthyy = monthChack + 1;
                    if (currentMonth > monthChack && mnthyy == currentMonth) {
                      Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                    }
                    if (currentMonth > monthChack) {
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
          if (selectYear >= this.currentYearFull && this.endYearActionPlan == selectYear && selectYear >= this.startYearActionPlan) {
            if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {

              if (month == 'jan') {
                let rty = this.endYearActionPlan - 1;
                if (selectYear <= this.currentYearFull && rty == selectYear && selectYear >= this.startYearActionPlan) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
              if (selectYear <= this.currentYearFull && this.endYearActionPlan == selectYear && selectYear > this.startYearActionPlan) {
                if (month !== 'jan' && monthChack < endMonthChack) {
                  Owners[month] = { "a": "1", "b": false };

                }
              }

            }
          }
          // 1 Year 
          if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
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
                  Owners[month] = { "a": "1", "b": true };
                }
                if (currentMonth <= monthChack) {
                  // console.log("zzzzzz");
                  Owners[month] = { "a": "1", "b": false };
                }
                // else {
                //   //console.log("yyyyy");
                //   Owners[month] = { "a": "1", "b": false };
                // }
              }
              else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
                if (currentMonth > monthChack) {
                  //console.log("jjjjjj");
                  Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                }
                // else {
                //   //console.log("lllllll");
                //   Owners[month] = { "a": "1", "b": false };
                // }
              }
            }
          }

        });
      }
    }

    else if (actionPlan.control_point == 'Half Yearly') {
      let halfYearlyMonth = moment(actionPlan.start_date).add(6, 'months').calendar();
      let HalfMonth = moment(halfYearlyMonth, 'MM/DD/YYYY').format('MMM').toLowerCase();
      // console.log("half yearlyy month", HalfMonth);
      //let HalfMonthNumber = moment().month(HalfMonth).format("MM");;

      // let HalfMonthNumber = Number(moment(HalfMonth, 'YYY-MM-DD').format('MM'));
      // console.log("half yearlyy month", HalfMonthNumber);
      if (this.companyFinancialYear == 'jan-dec') {
        this.MONTHS.map((month) => {
          let monthChack = moment().month(month).format("MM");
          if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan != selectYear)) {
            //Owners[startMonth] = "0";
            Owners[startMonth] = { "a": "0", "b": false };
            if (startMonthChack <= monthChack) {
              if (month == HalfMonth) {

                // console.log("firstttttt");
                if (selectYear < this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": true };

                }
                else if (selectYear >= this.currentYearFull) {
                  // console.log("secondddddddd");
                  Owners[month] = { "a": "1", "b": false };
                }

              }
            }
          }
          else if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
            if (endMonthChack >= monthChack) {
              if (month == endMonth) {
                Owners[month] = { "a": "3", "b": false };
              }
              else if (month == startMonth || month == HalfMonth) {
                if (selectYear < this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": true };
                }
                else if (selectYear == this.currentYearFull) {
                  if (monthChack < currentMonth) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (monthChack >= currentMonth) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }
                else if (selectYear > this.currentYearFull) {

                  Owners[month] = { "a": "1", "b": false };



                }

              }
              else {
                Owners[month] = "";
              }
            }
          }
          else if (selectYear < this.currentYearFull && this.startYearActionPlan !== selectYear) {
            if (month == startMonth || month == HalfMonth) {
              Owners[month] = { "a": "1", "b": true };
            }

          }
          else if (selectYear > this.currentYearFull && this.endYearActionPlan !== selectYear) {
            if (month == startMonth || month == HalfMonth) {
              Owners[month] = { "a": "1", "b": false };
            }

          }
          // 1 year 
          else if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
            if (startMonthChack <= monthChack && endMonthChack >= monthChack) {
              if (month == startMonth) {
                Owners[month] = { "a": "0", "b": false };
              }
              else if (month == endMonth) {
                Owners[month] = { "a": "3", "b": false };
              }
              else if (month == HalfMonth) {
                if (currentMonth > monthChack) {
                  Owners[month] = { "a": "1", "b": true };
                  // todayDate > actualReviewDate 
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
            if (selectYear == this.currentYearFull) {
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
          if (selectYear !== this.endYearActionPlan) {
            if (startMonthChack <= '03') {
              let rt = this.startYearActionPlan - 1;
              if ((rt == selectYear) && (this.endYearActionPlan != selectYear)) {
                //Owners[startMonth] = "0";
                Owners[startMonth] = { "a": "0", "b": false };
              }
              if (startMonthChack <= monthChack) {


                if (month == HalfMonth || month == startMonth) {

                  // console.log("firstttttt");


                  let ryi = selectYear + 1;
                  if (monthChack > '03') {
                    if (selectYear == this.currentYearFull && selectYear >= this.startYearActionPlan) {
                      if (monthChack >= currentMonth) {
                        Owners[month] = { "a": "1", "b": false };
                      }
                      else if (monthChack < currentMonth) {
                        Owners[month] = { "a": "1", "b": true };
                      }
                    }
                    if (selectYear < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    if (selectYear > this.currentYearFull && selectYear >= this.startYearActionPlan) {
                      Owners[month] = { "a": "1", "b": false };
                    }

                  }

                  // if (ryi < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                  //   Owners[month] = { "a": "1", "b": true };

                  // }

                  if (ryi < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (ryi == this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    // console.log("secondddddddd");
                    if (currentMonth > monthChack) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                    if (currentMonth < monthChack) {
                      Owners[month] = { "a": "1", "b": false };
                    }
                  }
                }
              }
            }
            if (startMonthChack >= '04') {
              if ((selectYear == this.startYearActionPlan) && (this.endYearActionPlan != selectYear)) {
                Owners[startMonth] = { "a": "0", "b": false };
              }
            }

            if (monthChack >= '04' && selectYear != this.startYearActionPlan) {
              if (month == HalfMonth || month == startMonth) {

                // console.log("firstttttt");
                if (selectYear < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                  Owners[month] = { "a": "1", "b": true };

                }
                else if (selectYear > this.currentYearFull) {
                  // console.log("secondddddddd");
                  Owners[month] = { "a": "1", "b": false };
                }
                else if (selectYear == this.currentYearFull) {
                  // console.log("secondddddddd");{}
                  if (monthChack < currentMonth) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (monthChack >= currentMonth) {
                    Owners[month] = { "a": "1", "b": false };

                  }
                }
              }
            }
          }

          if (selectYear <= this.endYearActionPlan || selectYear == this.startYearActionPlan) {

            if (endMonthChack <= '03') {
              var erryy = this.endYearActionPlan - 1;

              if ((erryy == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }
              }
              if ((erryy == selectYear) && (this.startYearActionPlan == selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }
              }
            }

            // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
            //   if (selectYear > this.currentYearFull) {
            //     Owners[month] = { "a": "1", "b": false };
            //   }
            //}
            if (endMonthChack >= '04') {

              if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }
              }
            }
          }
          if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
            if (endMonthChack >= monthChack) {
              // if (month == endMonth) {
              //   Owners[month] = { "a": "3", "b": false };
              // }
              if (month == startMonth || month == HalfMonth) {
                if (monthChack >= '04' && endMonthChack > monthChack) {

                  if (selectYear < this.currentYearFull) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  // for previous month review just before endmonth
                  else if (selectYear >= this.currentYearFull) {
                    Owners[month] = { "a": "1", "b": false };
                  }
                }

              }
              // else {
              //   Owners[month] = "";
              // }
            }
          }
          else if (selectYear < this.currentYearFull && this.startYearActionPlan !== selectYear && selectYear >= this.startYearActionPlan) {
            if (month == startMonth || month == HalfMonth) {
              Owners[month] = { "a": "1", "b": true };
            }
          }
          else if (selectYear > this.currentYearFull && this.endYearActionPlan !== selectYear) {
            let selyaer = selectYear + 1;
            if (selyaer !== this.endYearActionPlan) {
              if (month == startMonth || month == HalfMonth) {
                Owners[month] = { "a": "1", "b": false };
              }
            }
          }
          // 1 year 
          else if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
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
            if (selectYear >= this.startYearActionPlan && selectYear < this.endYearActionPlan) {
              let rtt = this.endYearActionPlan - 1;
              let plus = selectYear + 1;
              if (plus !== this.endYearActionPlan && endMonthChack >= '04') {
                if (selectYear !== rtt) {
                  if (selectYear == this.currentYearFull) {
                    if (month == startMonth || month == HalfMonth) {
                      if (monthChack < currentMonth && actualReviewDate < todayDate) {
                        if (startMonthChack <= '03' && selectYear != this.startYearActionPlan) {
                          Owners[month] = { "a": "1", "b": true };
                        }
                      }

                      // else {
                      //   Owners[month] = { "a": "1", "b": false };
                      // }
                    }
                  }

                  // if (month == startMonth || month == HalfMonth) {
                  //   if (currentMonth > monthChack) {
                  //     console.log("kkkkkk");

                  //     Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                  //   }
                  // else {
                  //   console.log("dfefeef");

                  //   Owners[month] = { "a": "1", "b": false };
                  // }
                  // }
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
          if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan != selectYear)) {
            //Owners[startMonth] = "0";
            Owners[startMonth] = { "a": "0", "b": false };
            if (startMonthChack <= monthChack) {
              if (month == YlyMonth) {
                if (this.startYearActionPlan < this.currentYearFull) {
                  if (currentMonth > monthChack) {

                    Owners[month] = { "a": "1", "b": true };
                  }
                }
                // else {
                //   Owners[month] = { "a": "1", "b": todayDate > actualReviewDate };
                // }
              }
            }
          }
          else if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
            // if (startMonthChack <= monthChack) {
            if (month == endMonth) {
              Owners[month] = { "a": "3", "b": false };
            }
            else if (month == startMonth && month != endMonth && monthChack < endMonthChack) {
              // monthChack < endMonth &&
              Owners[month] = { "a": "1", "b": false };
            }
            /* else if (month == startMonth) {
              Owners[month] = { "a": "1", "b": false };
            } */
            // else {
            //   Owners[month] = "";
            // }
            // }
          }
          else if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
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

          if (month == startMonth && selectYear != this.startYearActionPlan) {
            if (selectYear == this.currentYearFull) {
              if (currentMonth > monthChack && actualReviewDate < todayDate) {
                Owners[month] = { "a": "1", "b": true };
              }
              else if (currentMonth > monthChack && actualReviewDate > todayDate) {
                Owners[month] = { "a": "1", "b": false };
              }
              else if (currentMonth < monthChack) {
                Owners[month] = { "a": "1", "b": false };
              }
              else if (currentMonth == monthChack) {
                Owners[month] = { "a": "1", "b": false };
              }
            }
            else if (selectYear < this.currentYearFull && this.startYearActionPlan !== selectYear) {
              Owners[month] = { "a": "1", "b": true };
            }
            else if (selectYear > this.currentYearFull && this.startYearActionPlan !== selectYear && selectYear !== this.endYearActionPlan) {
              Owners[month] = { "a": "1", "b": false };
            }
          }
        });
      }

      if (this.companyFinancialYear == 'april-march') {
        this.MONTHS.map((month) => {
          let monthChack = moment().month(month).format("MM");
          if (selectYear !== this.endYearActionPlan) {
            if (startMonthChack <= '03') {
              let rt = this.startYearActionPlan - 1;
              if ((rt == selectYear) && (this.endYearActionPlan != selectYear)) {
                //Owners[startMonth] = "0";
                Owners[startMonth] = { "a": "0", "b": false };
              }
              if (startMonthChack <= monthChack) {

                if (month == startMonth) {
                  let ryi = selectYear + 1;
                  if (ryi > this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": false };
                  }

                  if (ryi < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    Owners[month] = { "a": "1", "b": true };
                  }
                  else if (ryi == this.currentYearFull && selectYear >= this.startYearActionPlan) {
                    if (currentMonth <= monthChack) {
                      Owners[month] = { "a": "1", "b": false };
                    }
                    if (currentMonth > monthChack) {
                      Owners[month] = { "a": "1", "b": true };
                    }
                  }
                }
              }
            }
            if (startMonthChack >= '04') {
              if ((selectYear == this.startYearActionPlan) && (this.endYearActionPlan != selectYear)) {
                Owners[startMonth] = { "a": "0", "b": false };
              }
            }

            if (monthChack >= '04') {
              if (month == startMonth) {
                if (selectYear < this.currentYearFull && selectYear >= this.startYearActionPlan) {
                  Owners[month] = { "a": "1", "b": true };

                }
                else if (selectYear >= this.currentYearFull) {
                  Owners[month] = { "a": "1", "b": false };
                }
              }
            }
          }

          // hhhh


          if (selectYear <= this.endYearActionPlan || selectYear == this.startYearActionPlan) {

            if (endMonthChack <= '03') {
              var erryy = this.endYearActionPlan - 1;

              if ((erryy == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }
              }
              if ((erryy == selectYear) && (this.startYearActionPlan == selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }
                }
              }
            }

            // else if (month == startMonth || quaterlyMonths.indexOf(month) !== -1) {
            //   if (selectYear > this.currentYearFull) {
            //     Owners[month] = { "a": "1", "b": false };
            //   }
            //}
            if (endMonthChack >= '04') {

              if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }

                }
              }
            }


            if (endMonthChack >= '04') {

              if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan == selectYear)) {
                if (endMonthChack >= monthChack) {
                  if (month == endMonth) {
                    Owners[month] = { "a": "3", "b": false };
                  }

                }
              }
            }

          }
          // hhh

          else if ((this.endYearActionPlan == selectYear) && (this.startYearActionPlan != selectYear)) {
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
          else if ((this.startYearActionPlan == selectYear) && (this.endYearActionPlan == selectYear)) {
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
              if (selectYear == this.currentYearFull) {
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
              else if (selectYear < this.currentYearFull && this.startYearActionPlan !== selectYear && selectYear > this.startYearActionPlan) {
                Owners[month] = { "a": "1", "b": true };
              }
              else if (selectYear > this.startYearActionPlan && selectYear < this.endYearActionPlan && endMonthChack > '04') {
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
          schedules.map((schedule: any) => {
            // scheduleMonth format Month  ( jan feb mar )
            //  monthChack  format Month  (1 to 12)
            // reviewMonthDay  format day
            // reviewMonth   format Month  (1 to 12)
            const scheduleMonth = moment(schedule.month_date, 'YYYY-MM-DD').format('MMM').toLowerCase();
            // console.log("scheduleMonth", scheduleMonth);

            const monthChack = parseInt(moment(schedule.month_date, 'YYYY-MM-DD').format('MM'));

            // console.log("fdfdf", monthChack);

            let monthhhh = Number(moment(schedule.month_date, 'YYYY-MM-DD').format('MM'));
            // console.log("fdfdf", monthhhh);

            const monthChackYear = parseInt(moment(schedule.month_date, 'YYYY-MM-DD').format('YYYY'));
            // console.log("monthChackYear", monthChackYear);
            // const reviewMonth = parseInt(moment(schedule.review_month_date, 'YYYY-MM-DD').format('MM'));
            // console.log("reviewMonth", reviewMonth);
            const reviewMonthYear = parseInt(moment(schedule.review_month_date, 'YYYY-MM-DD').format('YYYY'));

            // const reviewMonthDay = moment(schedule.review_month_date, 'YYYY-MM-DD').format('DD');

            const reviewMonth = parseInt(moment(schedule.review_month_date, 'YYYY-MM-DD').format('MM'));
            // console.log("Reviemonth", reviewMonth);

            const reviewMonthDay = moment(schedule.review_month_date, 'YYYY-MM-DD').format('DD');
            //_owners[scheduleMonth] = "2";
            let rtt = monthhhh + 1;
            if ((reviewMonthYear > monthChackYear) && (monthChack !== currentnumprevious)) {
              _owners[scheduleMonth] = { "a": "2", "b": true };
            }
            if ((reviewMonthYear > monthChackYear)) {
              _owners[scheduleMonth] = { "a": "2", "b": true };
            }

            else if (reviewMonthYear == monthChackYear) {

              if ((selectYear <= this.endYearActionPlan && reviewMonth == monthhhh)) {
                _owners[scheduleMonth] = { "a": "2", "b": false };

              }
              if ((reviewMonth != monthhhh)) {
                _owners[scheduleMonth] = { "a": "2", "b": true };

              }
            }
            _owners['comment'] = schedule.comment;
          })
        }
        SOBJDATA.push(_owners);
      });
      // console.log("SOBJDATA",SOBJDATA);
    }
    // SOBJDATA.map((co_owner_id: any, index: number) => {
    //   co_owner_id.sr_no = index + 1;
    // });
    const ELEMENT_DATA_ACTION: PeriodicElement[] = SOBJDATA;
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_ACTION);
  }
  actionDataByYear(selectYear) {
    this.selectYear = selectYear;
    let actionPlanId = this.id; // action plan id
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjActionByYear(login_access_token, actionPlanId, this.selectYear, this.companyFinancialYear).pipe(first()).subscribe(
      (data: any) => {
        this.actionPlanSaprate(data.data[0], this.selectYear);
      },
      error => {
        this.alertService.error(error);
      });
  }
  kpiSaprate(kpialldata: any): any {
    const kpi_data = [...kpialldata.action_plan_kpi_data];

    const currentYear = new Date().getFullYear();
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    // console.log('kpi_data',kpi_data);
    kpi_data.map(kpi => {

      // joins two API data
      kpi['dept_id'] = kpialldata.dept_id;
      kpi['so_id'] = kpialldata.so_id;
      kpi['initiatives_id'] = kpialldata.initiatives_id;
      kpi['action_plan_id'] = kpialldata.action_plan_id;
// console.log('aaaa', this.strategicAllData.length);

     // if (this.strategicAllData.length > 0) {
        this.strategicAllData.forEach((dept_row, i) => {
          if (dept_row.id == kpi.dept_id) {
            dept_row.strategic_objectives.forEach(str_row => {
              if (str_row.strategic_objectives_id == kpi.so_id) {
                str_row.initiatives.forEach(init_row => {
                  if (init_row.initiatives_id == kpi.initiatives_id) {
                    init_row.action_plans.forEach(action_row => {
                      if (action_row.action_plans_id == kpi.action_plan_id) {
                        action_row.kpis.forEach(kpi_row => {
                          if (kpi_row.id == kpi.kpi_id) {
                            kpi['kpistatus'] = kpi_row.kpistatus;
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
    //  }

      let elementID = 'curve_chart_' + kpi.kpi_id;
      const kpiData = [];
      const kpiChartData = {};
      //kpi table start
      const kpiTargetRatio = [];
      let KPIDATA: PeriodicElementKPI[] = [];
      const targets: any = {
        "ideal_trend": kpi.ideal_trend,
        "definition": kpi.kpi_name,
        "year_for": "Target",
        "one_year": 0,
        "two_year": 0,
        "three_year": 0,
        "four_year": 0,
        "apr": '',
        "may": '',
        "jun": '',
        "jul": '',
        "aug": '',
        "sep": '',
        "oct": '',
        "nov": '',
        "dec": '',
        "jan": '',
        "feb": '',
        "mar": '',
        "ytd": '',
        "kpi_id": kpi.kpi_id,
      };
      const actuals: any = {
        "year_for": "Actual",
        "one_year": 0,
        "two_year": 0,
        "three_year": 0,
        "four_year": 0,
        "apr": '',
        "may": '',
        "jun": '',
        "jul": '',
        "aug": '',
        "sep": '',
        "oct": '',
        "nov": '',
        "dec": '',
        "jan": '',
        "feb": '',
        "mar": '',
        "ytd": '',
        "kpi_id": kpi.kpi_id,
      };
      //kpi table end
      kpi.kpi_targets.map(target => {
        if (parseInt(target.target_year) === currentYear) {
          for (let key in target) {
            if (months.indexOf(key) !== -1) {
              kpiChartData[key] = [target[key] !== null ? parseFloat(target[key]) : 0.0, target[key] !== null ? parseFloat(target[key]) : 0.0];
              //kpi table start
              if (target[key] != null) {
                let monthVlaue = target[key].split(".");
                if (monthVlaue[1] > '00') {
                  targets[key] = monthVlaue[0] + '.' + monthVlaue[1];
                }
                else {
                  targets[key] = monthVlaue[0];
                }
              }
              kpiTargetRatio[key] = target[key];
              //kpi table end
            }
          }
          //kpi table start
          targets['ytd'] = Math.round(target.ytd);
          targets['has_kpi_target'] = kpi.has_kpi_target;
          // targets['user_id'] = kpi.user_id;
          targets['target_id'] = target.target_id;
          targets['ideal_trend'] = kpi.ideal_trend;
          targets['target_year'] = target.target_year;

          //kpi table end
        }
        else {
          kpiChartData[target.target_year] = [target['avg'] !== null ? parseFloat(target['avg']) : 0.0, target['avg'] !== null ? parseFloat(target['avg']) : 0.0];
          //kpi table start
          if (target.target_year == currentYear - 1) {
            targets["four_year"] = target.avg;
          }
          if (target.target_year == currentYear - 2) {
            targets["three_year"] = target.avg;
          }
          if (target.target_year == currentYear - 3) {
            targets["two_year"] = target.avg;
          }
          if (target.target_year == currentYear - 4) {
            targets["one_year"] = target.avg;
          }
          //kpi table end
        }
      });
      kpi.kpi_actuals.map(actual => {
        if (parseInt(actual.actual_year) === currentYear) {
          let late_review_Data = [];
          actuals['has_kpi_actual'] = kpi.has_kpi_actual;

          const monthRatio = {};
          for (let key in actual) {
            if (months.indexOf(key) !== -1) {
              // kpiChartData[key].push(actual[key] !== null ? parseFloat(actual[key]) : 0.0, actual[key] !== null ? parseFloat(actual[key]) : 0.0);
              kpiChartData[key].push(actual[key] !== null ? parseFloat(actual[key]) : null, actual[key] !== null ? parseFloat(actual[key]) : null);
              //kpi table start
              if (actual[key] != null) {
                let monthVlaue = actual[key].split(".");
                if (monthVlaue[1] > '00') {
                  actuals[key] = monthVlaue[0] + '.' + monthVlaue[1];
                }
                else {
                  actuals[key] = monthVlaue[0];
                }
              }
              if (actuals[key] == 0.0 || actuals[key] == null || kpiTargetRatio[key] == 0.0 || kpiTargetRatio[key] == null) {
                monthRatio[key] = 0.0;
              }
              else {
                monthRatio[key] = actuals[key] / kpiTargetRatio[key];
              }
              if (kpi.ideal_trend == "positive") {
                // (1.0>=) green #4caf50,  (1.0< or  0.9>=)  yellow #FFD933, (>0,<0.9) red #f40000, (0) grey #f3f3f3
                months.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.0 ? '#4caf50' : (monthRatio[month] < 1.0 && monthRatio[month] >= 0.9) ? '#FFD933' : (monthRatio[month] < 0.9 && monthRatio[month] != null) ? '#f40000' : '';
                });
                actuals['ytd_color'] = kpi.kpistatus >= 1.0 ? '#4caf50' : (kpi.kpistatus < 1.0 && kpi.kpistatus >= 0.9) ? '#FFD933' : (kpi.kpistatus < 0.9 && kpi.kpistatus != null && kpi.kpistatus > 0) ? '#f40000' : '#f3f3f3';
              }
              else {
                // (1.1>=) red,  (1.1< or  1.0>)  yellow , (>0, <=1.0) green, (0) grey 
                months.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.1 ? '#f40000' : (monthRatio[month] < 1.1 && monthRatio[month] > 1.0) ? '#FFD933' : (monthRatio[month] <= 1.0 && monthRatio[month] != null) ? '#4caf50' : '';
                });
                actuals['ytd_color'] = kpi.kpistatus >= 1.1 ? '#f40000' : (kpi.kpistatus < 1.1 && kpi.kpistatus > 1.0) ? '#FFD933' : (kpi.kpistatus <= 1.0 && kpi.kpistatus != null && kpi.kpistatus > 0) ? '#4caf50' : '#f3f3f3';
              }
              //kpi table end
            }
          }
          //kpi table start
          actuals['ytd'] = Math.round(actual.ytd);
          // console.log('actual', actual);
          if (actual.late_review) {
            //if (kpiActual.late_review.length > 0) {
            for (let key in actual.late_review) {
              late_review_Data.push(actual.late_review[key])
            }
            actuals['late_review'] = late_review_Data;
            let testreviewstatus = actuals['late_review'];
            testreviewstatus.forEach(element => {
              this.testreviewstatus2 = element.status;
              this.testreviewkpi_id = element.kpi_id;
              // this.testreviewmonth = element.months;
            });
          }
          actuals['reviewstatus'] = this.testreviewstatus2;
          actuals['reviewkpiid'] = this.testreviewkpi_id;
          //kpi table end
        }
        else {
          kpiChartData[actual.actual_year].push(actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0, actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0);
          //kpi table start
          if (actual.actual_year == currentYear - 1) {
            actuals["four_year"] = actual.avg;
          }
          if (actual.actual_year == currentYear - 2) {
            actuals["three_year"] = actual.avg;
          }
          if (actual.actual_year == currentYear - 3) {
            actuals["two_year"] = actual.avg;
          }
          if (actual.actual_year == currentYear - 4) {
            actuals["one_year"] = actual.avg;
          }
          //kpi table end
        }
      });
      for (let key in kpiChartData) {
        kpiChartData[key].unshift(key);
        kpiData.push(kpiChartData[key]);
      }
      this.elementID = elementID;
      kpi['elementID'] = elementID;
      kpi['IdealTrend'] = kpi.ideal_trend;
      kpi['elementCompare'] = this.comparekpi;
      KPIDATA.push(targets);
      KPIDATA.push(actuals);
      kpi['chartData'] = kpiData;
      // console.log('kpiData',kpiData);

      kpi['dataSourceKPI'] = new MatTableDataSource<PeriodicElementKPI>(KPIDATA);
    });
    this.kpisData = [...kpi_data];
  }
  addActualOpen(action, kpiId, year) {
   
    let kpiATDATA;
    let kpi_id = kpiId;
    this.userService.getkpiTargetActual(this.login_access_token, this.company_id, kpi_id, year).pipe(first()).subscribe(
      (data: any) => {
        kpiATDATA = data.data;

        const dialogRef = this.dialog.open(addActualDialod, {
          data: { kpiATDATA, action }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result == "YesSubmit") {
            // this.viewKpi();
            this.viewStrategicObjectives();
            this.actionPlansComment();
            // this.actionPlansComment()
          }
        })
      },
      error => {
        this.alertService.error(error);
      });
  }

  alanCommentPDF() {
    this.loaderService.show();
    var data = document.getElementById('action-plan-comment');
    html2canvas(data).then(canvas => {
      var imgWidth = 210;
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
      pdf.save('actionAlanComment.pdf');
      this.loaderService.hide();
    });
  }
}


@Component({
  selector: 'change-review',
  templateUrl: 'change_review.component.html',
  styleUrls: ['./action-comment.component.scss'],
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
  temp_straObjStatus: any;
  responsibleUser: any;
  commentStatus: any;
  requiredDta: any;
  allExpandState: any;
  month_date: any;
  reviewMonthDate: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  dataActionOwner = [];
  dropdownSettings = {};
  currentUrl: any;
  constructor(
    public dialogRef: MatDialogRef<ChangeReview>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private router: Router,
    // @Inject(MAT_DIALOG_DATA) public data: User,
  ) {
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

    this.allExpandState = false;
    this.reviewDataGet = this.data;
    let action_plan_id = this.reviewDataGet.element.action_plan_id;
    let co_owner_id = this.reviewDataGet.element.co_owner_id;
    var dateObj = new Date();
    var month = this.reviewDataGet.monthDate + 1;
    // var day = dateObj.getUTCDate();
    var day = '11';

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
    // console.log("monthDate", this.month_date);

    let now = new Date();
    this.reviewMonthDate = moment(now, 'MM-DD-YYYY').format('DD-MM-YYYY');
    // console.log("reviewMonthDate", this.reviewMonthDate);

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
      filled_status: ['filled']

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

      this.dropdownSettings = {
        singleSelection: true,
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
  onItemSelect(item: any) {
    console.log(item);
}
onSelectAll(items: any) {
    console.log(items);
}
onItemDeSelect(item: any) {
    console.log(item);
}
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
      data => {
        this.userrole = data;
        this.straObjStatus = this.userrole.data;


        let grey1 = { status_id: 1, status_name: "Gray (Started)", accuracy_percentage: 0 };
        let onhold1 = { status_id: 2, status_name: 'On Hold', accuracy_percentage: 0 };
        let unhold1 = { status_id: 6, status_name: 'Un Hold(Reopen)', accuracy_percentage: 0 };

        let red_straObjStatus = [];
        //push for red
        red_straObjStatus.push(grey1);
        red_straObjStatus.push(onhold1);
        red_straObjStatus.push(unhold1);

        for (let index = 0; index <= 89; index++) {
          let red1 = { status_id: 5, status_name: String(index + '% Complete'), accuracy_percentage: 90 };
          red_straObjStatus.push(red1);
        }

        // console.log('this.temp_straObjStatus1', red_straObjStatus);
        // push for yellow
        for (let index = 90; index <= 99; index++) {
          // let i:string = index;
          let yellow1 = { status_id: 4, status_name: String(index + '% Complete'), accuracy_percentage: 90 };
          red_straObjStatus.push(yellow1);
        }

        // console.log('this.temp_straObjStatus2', red_straObjStatus);

        // push for green
        let green1 = { status_id: 3, status_name: '100% Complete', accuracy_percentage: 100 };
        red_straObjStatus.push(green1);
        // console.log('this.temp_straObjStatus3', red_straObjStatus);
        this.temp_straObjStatus = red_straObjStatus;


        // console.log('this.temp_straObjStatus4', this.temp_straObjStatus);
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

  // submit review
  changeReviewSubmit() {
    this.submitted = true;
    if (this.changeReviewForm.invalid) {
      return;
    }
    this.changeReviewForm.value.responsibility = this.changeReviewForm.value.responsibility[0]['user_id'];
    //  console.log('formmm',this.changeReviewForm.value);
    //  return;
    let latest_implement_data = this.datepipe.transform(this.implement_data, 'dd/MM/yyyy');
    this.changeReviewForm.value.implement_data = latest_implement_data;
    this.userService.changeReview(this.changeReviewForm.value).pipe(first()).subscribe(
      (data: any) => {
        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.dialogRef.close('YesSubmit');
          // this.router.navigate([this.currentUrl]);
          // this.actionDataByYear('2020');
          // api-action-plan-schedule-data
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

export interface PeriodicElementAction {
  action_plans_sr_no: string;
  dept_name: string;
  definition: string;
  action_plan_kpi_data: any;
  action_plans_assign_user: Array<any>;
  target: string;
  start_date: string;
  end_date: string;
  percentage: number;
  status_name: string;
}
export interface PeriodicElement {
  sr_no: number;
  definition: string;
  target: string;
  co_owner_name: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  status_name: string;
}
export interface PeriodicElementComment {
  sr_no: number;
  recovery_plan: string;
  comment: string;
  review_date: string;
}
export interface PeriodicElementKPI {
  definition: string;
  year_for: string;
  one_year: string;
  two_year: string;
  three_year: string;
  four_year: string;
  jan: string;
  feb: string;
  mar: string;
  apr: string;
  may: string;
  jun: string;
  jul: string;
  aug: string;
  sep: string;
  oct: string;
  nov: string;
  dec: string;
  ytd: string;
  action: string;
  kpi_id: any;
  has_kpi_target: any;
  has_kpi_actual: any;
  target_year: any;
  ideal_trend: any;
  reviewstatus: any;

}
