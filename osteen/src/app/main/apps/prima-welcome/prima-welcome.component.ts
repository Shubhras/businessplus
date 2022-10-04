import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { AlertService, UserService } from '../_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subscription, pipe } from 'rxjs';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare let d3pie: any;
import * as moment from 'moment';
import { KpiDefinition } from '../common-dialog/kpi-definition/kpi-definition.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { STATUSES } from '../_constants';
@Component({
  selector: 'prima-welcome',
  templateUrl: './prima-welcome.component.html',
  styleUrls: ['./prima-welcome.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrimaWelcomeComponent implements OnInit {
  currentUser: any;
  designation_name: any;
  user_name: any;
  truth: any;
  userModulePermission: any;
  //order: string = 'hierarchy';
  dataDepartment: any;
  unit_id: any;
  userListAllData: any;
  unit_name: any;
  designation: any;
  totalTaskData: any = {};
  todayDate: any;
  currentyMonth: any;
  login_access_token: any;
  userSelectedYear: any;
  currentYearFull: any;
  userSelectedYearFull: any;
  userSelectedYearHalf: any;
  currentYearPlusOne: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  company_id: any;
  //selectedYearVal:any;
  displayedColumnsSIA: string[] = ['name_StrInitia', 'total', 'green', 'yellow', 'red', 'gray', 'blue'];
  dataSourceSIA: any;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  displayedColumnsKPI: string[] = ['sr_no', 'dept_name', 'total_kpi', 'green', 'yellow', 'red', 'gray'];
  dataSourceKPI: any;
  displayedColumnsKpiLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceKpiLesent = new MatTableDataSource<PeriodicElementKpiLesent>(ELEMENT_DATA_KPI_LESENT);

  displayedColumnsTASK: string[] = ['sr_no', 'task_name', 'priority_name', 'status_name'];
  dataSourceAssinSelf: any;
  department_alot: any;
  user_alotID: any;
  dataSourceAssinOther: any;
  dataSourceCrateTask: any;
  displayedColumnsReAction: string[] = ['sr_no', 'reminder_tittle', 'category', 'status', 'reminder_date'];
  dataSourceReAction: any;
  displayedColumnsReKPI: string[] = ['sr_no', 'kpi_name', 'month'];
  dataSourceReKPI: any;
  displayedColumnsReKPIComing: string[] = ['sr_no', 'kpi_name', 'month'];
  dataSourceReKPIComing: any;
  KpiYearMonth = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  displayedColumnsLeadKPI = ['kpi_name', 'kpi_definition', 'unit_of_measurement', 'ideal_trend', 'section_name', 'year_for', 'one_year', 'two_year', 'three_year',
    'four_year'];
  dataSource: any;
  renderKPIData: Array<any>;
  currentYearSubscription: Subscription;
  @ViewChild('pieChartObj') pieChartObj: ElementRef;
  @ViewChild('pieChartIni') pieChartIni: ElementRef;
  @ViewChild('pieChartAction') pieChartAction: ElementRef;
  @ViewChild('pieChartKPI') pieChartKPI: ElementRef;
  // @ViewChild('pieChartTASK') pieChartTASK: ElementRef;
  @ViewChild('pieChartLeadKPI') pieChartLeadKPI: ElementRef;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
    // Configure the layout
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: false
        },
        toolbar: {
          hidden: false
        },
        footer: {
          hidden: false
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
  /**
   * On init
   */
  ngOnInit(): void {
    let nowCurrentYear = new Date();
    this.todayDate = new Date().getDate();
    this.currentyMonth = moment(nowCurrentYear, 'YYYY-MM-DD').format('MMM');
    this.currentYearFull = moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY');
    this.designation_name = JSON.parse(localStorage.getItem('LoginUserDetails'));
    this.designation = this.designation_name.designation;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.department_alot = this.currentUser.dept_id;
    this.user_alotID = this.currentUser.data.id;
    console.log("useriddddddd", this.user_alotID);

    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    console.log('this.company_id', this.company_id);
    //set header by financial year and month
    if (this.companyFinancialYear == "april-march") {
      this.displayedColumnsLeadKPI.push('apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'ytd_target_actual');
    }
    else {
      this.displayedColumnsLeadKPI.push('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd_target_actual');
    }
    this.user_name = this.currentUser.data.name;
    this.unit_id = localStorage.getItem('currentUnitId');
    console.log("zxzxzxx", this.unit_id);
    this.unit_name = localStorage.getItem('currentUnitName');
    console.log("zxzxzxx", this.unit_name);

    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.viewStrategicDashboard();
      this.viewKpiDashboardData();
      this.viewLeadKpiDashboardData();
      this.getLeadKpiData();
      this.totalTaskDataGet();
      this.ViewTasks();

    });
    this.viewReKPI();
    this.viewReActionPlan();
    this.getDepartment();
    //this.userLisetGet();
    //this.selectedYearVal = this.currentYearFull;
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  kpiDefinitionOpen(element): void {
    const dialogRef = this.dialog.open(KpiDefinition, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
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
  viewReActionPlan() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let company = this.company_id;
    let dept_alot = [this.department_alot];
    let user_id = this.user_alotID;
    this.userService.reminderActionPlan(login_access_token, unit_id, company, dept_alot, user_id).pipe(first()).
      subscribe((data: any) => {
        data.data.map((reminder: any, index: number) => {
          reminder.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = data.data;
        this.dataSourceReAction = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.truth = data.data.color
        console.log("truth", this.truth);

      },
        error => {
          this.alertService.error(error);
        })
  }
  viewReKPI() {
    let login_access_token = this.currentUser.login_access_token;
    let company_id = this.company_id;
    let reminder_date = this.allDetailsCompany.general_data[0].reminder_date;
    let reminder_frequency = this.allDetailsCompany.general_data[0].reminder_frequency;
    let financial_year = this.companyFinancialYear;
    let unit_id = this.unit_id;
    let dept_id = this.department_alot;
    this.userService.reminderKPI(login_access_token, company_id, reminder_date, reminder_frequency, financial_year,dept_id, unit_id).pipe(first()).
      subscribe((data: any) => {
        let reviewDataAll = data.data;
        let kpiReviewData = [];
        let kpiReviewDataComing = [];
        for (let i = 0; i < reviewDataAll.length; i++) {
          if (reviewDataAll[i].actual_array.length > 0) {
            const review = reviewDataAll[i].actual_array[0];
            kpiReviewData.push({ "sr_no": i + 1, "kpi_name": review.kpi_name, "month": review.month });
          }
          const commingReviewKpi = reviewDataAll[i].upcomig_review;
          if (!Array.isArray(commingReviewKpi)) {
            kpiReviewDataComing.push({ "kpi_name": commingReviewKpi.kpi_name, "month": commingReviewKpi.month });
          }
        }
        const ELEMENT_DATA: PeriodicElementReKPI[] = kpiReviewData;
        this.dataSourceReKPI = new MatTableDataSource<PeriodicElementReKPI>(ELEMENT_DATA);
        const ELEMENT_DATA_COMIND: PeriodicElementReKPIComing[] = kpiReviewDataComing;
        this.dataSourceReKPIComing = new MatTableDataSource<PeriodicElementReKPIComing>(ELEMENT_DATA_COMIND);
      },
        error => {
          this.alertService.error(error);
        })
  }
  viewStrategicDashboard() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strategicDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.prepareDataForChart(data.data);
        let stralldata = data.data;
        const TOTALSTRDATA: PeriodicElementSIA[] = [];
        const objectivesTotal = {
          name_StrInitia: 'Strategic Objectives',
          total: stralldata.strategic_objectives.total,
          green: stralldata.strategic_objectives.green,
          yellow: stralldata.strategic_objectives.yellow,
          red: stralldata.strategic_objectives.red,
          blue: stralldata.strategic_objectives.blue,
          gray: stralldata.strategic_objectives.gray
        };
        const initiativesTotal = {
          name_StrInitia: 'Initiatives',
          total: stralldata.initiatives.total,
          green: stralldata.initiatives.green,
          yellow: stralldata.initiatives.yellow,
          red: stralldata.initiatives.red,
          blue: stralldata.initiatives.blue,
          gray: stralldata.initiatives.gray
        }
        const actionPlanTotal = {
          name_StrInitia: 'Action Plan',
          total: stralldata.action_plans.total,
          green: stralldata.action_plans.green,
          yellow: stralldata.action_plans.yellow,
          red: stralldata.action_plans.red,
          blue: stralldata.action_plans.blue,
          gray: stralldata.action_plans.gray
        }
        TOTALSTRDATA.push(objectivesTotal);
        TOTALSTRDATA.push(initiativesTotal);
        TOTALSTRDATA.push(actionPlanTotal);
        this.dataSourceSIA = new MatTableDataSource<PeriodicElementSIA>(TOTALSTRDATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  prepareDataForChart(data: any) {
    const totalStr = data.strategic_objectives.total;
    const totalInt = data.initiatives.total;
    const totalAction = data.action_plans.total;
    const graphDataStr = [
      {
        "label": (data.strategic_objectives.green * 100 / totalStr).toFixed(1) + '%',
        "value": data.strategic_objectives.green,
        "color": "#4caf50",
        "colorName": "Green"
      }, {
        "label": (data.strategic_objectives.yellow * 100 / totalStr).toFixed(1) + '%',
        "value": data.strategic_objectives.yellow,
        "color": "#FFD933",
        "colorName": "Yellow"
      }, {
        "label": (data.strategic_objectives.red * 100 / totalStr).toFixed(1) + '%',
        "value": data.strategic_objectives.red,
        "color": "#f44336",
        "colorName": "Red"
      },
      {
        "label": (data.strategic_objectives.blue * 100 / totalStr).toFixed(1) + '%',
        "value": data.strategic_objectives.blue,
        "color": "#7dabf5",
        "colorName": "Blue (Hold)"
      },
      {
        "label": (data.strategic_objectives.gray * 100 / totalStr).toFixed(1) + '%',
        "value": data.strategic_objectives.gray,
        "color": "#a9b7b6",
        "colorName": "Gray (Started)"
      },
    ];
    const graphDataIni = [
      {
        "label": (data.initiatives.green * 100 / totalInt).toFixed(1) + '%',
        "value": data.initiatives.green,
        "color": "#4caf50",
        "colorName": "Green"
      }, {
        "label": (data.initiatives.yellow * 100 / totalInt).toFixed(1) + '%',
        "value": data.initiatives.yellow,
        "color": "#FFD933",
        "colorName": "Yellow"
      }, {
        "label": (data.initiatives.red * 100 / totalInt).toFixed(1) + '%',
        "value": data.initiatives.red,
        "color": "#f44336",
        "colorName": "Red"
      },
      {
        "label": (data.initiatives.blue * 100 / totalInt).toFixed(1) + '%',
        "value": data.initiatives.blue,
        "color": "#7dabf5",
        "colorName": "Blue (Hold)"
      },
      {
        "label": (data.initiatives.gray * 100 / totalInt).toFixed(1) + '%',
        "value": data.initiatives.gray,
        "color": "#a9b7b6",
        "colorName": "Gray (Started)"
      },
    ];
    const graphDataAction = [
      {
        "label": (data.action_plans.green * 100 / totalAction).toFixed(1) + '%',
        "value": data.action_plans.green,
        "color": "#4caf50",
        "colorName": "Green"
      }, {
        "label": (data.action_plans.yellow * 100 / totalAction).toFixed(1) + '%',
        "value": data.action_plans.yellow,
        "color": "#FFD933",
        "colorName": "Yellow"
      }, {
        "label": (data.action_plans.red * 100 / totalAction).toFixed(1) + '%',
        "value": data.action_plans.red,
        "color": "#f44336",
        "colorName": "Red"
      },
      {
        "label": (data.action_plans.blue * 100 / totalAction).toFixed(1) + '%',
        "value": data.action_plans.blue,
        "color": "#7dabf5",
        "colorName": "Blue (Hold)"
      },
      {
        "label": (data.action_plans.gray * 100 / totalAction).toFixed(1) + '%',
        "value": data.action_plans.gray,
        "color": "#a9b7b6",
        "colorName": "Gray (Started)"
      },
    ];
    /*const totalStr =data.strategic_objectives.total;
    const totalInt = data.initiatives.total;
    const totalAction = data.action_plans.total;*/
    this.fucnPieChart("pieChartObj", graphDataStr, totalStr);
    this.fucnPieChart("pieChartIni", graphDataIni, totalInt);
    this.fucnPieChart("pieChartAction", graphDataAction, totalAction);
  }
  viewKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.kpiDashboardDataView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe((data: any) => {
      this.processData(data.data);
      // kpi total for table
      data.data.map((kpi: any, index: number) => {
        kpi.sr_no = index + 1;
      });
      let KPIDATA = data.data;
      const KpiTotal = KPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
      const greenTotal = KPIDATA.reduce((sum, item) => sum + item.green, 0);
      const redTotal = KPIDATA.reduce((sum, item) => sum + item.red, 0);
      const yellowTotal = KPIDATA.reduce((sum, item) => sum + item.yellow, 0);
      const grayTotal = KPIDATA.reduce((sum, item) => sum + item.gray, 0);
      const KPI_DATA_TOTAL = {
        // sr_no: 0,
        dept_name: 'Total',
        total_kpi: KpiTotal,
        green: greenTotal,
        yellow: yellowTotal,
        red: redTotal,
        gray: grayTotal
      };
      const ELEMENT_DATA: PeriodicElementKPI[] = data.data;
      ELEMENT_DATA.push(KPI_DATA_TOTAL);
      // const ELEMENT_DATA: PeriodicElementKPI[] = [KPI_DATA_TOTAL];
      // ELEMENT_DATA.push(KPI_DATA_TOTAL);
      this.dataSourceKPI = new MatTableDataSource<PeriodicElementKPI>(ELEMENT_DATA);
    },
      error => {
        this.alertService.error(error);
      });
  }

  // userLisetGet() {
  //   let role_id = this.currentUser.role_id;
  //   let company_id = this.currentUser.data.company_id;
  //   this.userService.getAllUserList(this.login_access_token, role_id, company_id).pipe(first()).subscribe(
  //     (data: any) => {
  //       this.userListAllData = data.data;
  //       this.designation = this.userListAllData.designation;
  //       console.log("Designation", this.designation);

  //       console.log("hiiii", this.userListAllData);
  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }
  processData(KPIDATA: any): any {
    // kpi total for pie chart
    const KpiTotal = KPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
    const greenTotal = KPIDATA.reduce((sum, item) => sum + item.green, 0);
    const redTotal = KPIDATA.reduce((sum, item) => sum + item.red, 0);
    const yellowTotal = KPIDATA.reduce((sum, item) => sum + item.yellow, 0);
    const grayTotal = KPIDATA.reduce((sum, item) => sum + item.gray, 0);
    this.prepareDataForKPI(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal);
  }
  prepareDataForKPI(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal) {
    const totalKPI = KpiTotal;
    const graphDataKPI = [
      {
        "label": (redTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": redTotal,
        "color": "#f44336"
      }, {

        "label": (greenTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": greenTotal,
        "color": "#4caf50"
      }, {
        "label": (yellowTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": yellowTotal,
        "color": "#FFD933"
      },
      {
        "label": (grayTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": grayTotal,
        "color": "#a9b7b6"
      }
    ];
    this.fucnPieChart("pieChartKPI", graphDataKPI, totalKPI);
  }
  /*   kpiDataByYear() {
      //console.log(this.selectedYearVal);
    } */
  viewLeadKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.processLeadData(data.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  processLeadData(LeadKPIDATA: any): any {
    // kpi total for pie chart
    const leadKpiTotal = LeadKPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
    const leadGreenTotal = LeadKPIDATA.reduce((sum, item) => sum + item.green, 0);
    const leadRedTotal = LeadKPIDATA.reduce((sum, item) => sum + item.red, 0);
    const leadYellowTotal = LeadKPIDATA.reduce((sum, item) => sum + item.yellow, 0);
    const leadGrayTotal = LeadKPIDATA.reduce((sum, item) => sum + item.gray, 0);
    this.prepareLeadForChart(leadKpiTotal, leadGreenTotal, leadRedTotal, leadYellowTotal, leadGrayTotal);
  }
  prepareLeadForChart(leadKpiTotal, leadGreenTotal, leadRedTotal, leadYellowTotal, leadGrayTotal) {
    const totalLeadKPI = leadKpiTotal;
    const graphDataLeadKPI = [
      {
        "label": (leadRedTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadRedTotal,
        "color": "#f44336"
      }, {

        "label": (leadGreenTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadGreenTotal,
        "color": "#4caf50"
      }, {
        "label": (leadYellowTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadYellowTotal,
        "color": "#FFD933"
      },
      {
        "label": (leadGrayTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadGrayTotal,
        "color": "#a9b7b6"
      }
    ];
    this.fucnPieChart("pieChartLeadKPI", graphDataLeadKPI, totalLeadKPI);
  }
  totalTaskDataGet() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.tasksDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.totalTaskData = data.data.task_data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  ViewTasks() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let user_id = this.currentUser.data.id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.TasksView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        const tasks = data.data;
        // filter Assigned task create self (task Open and Delayed)
        const assignedSelf = tasks
        // filter Assigned task create other (task Open and Delayed)
        const assignedOther = tasks.filter((task) => {
          const assignOther: Array<number> = JSON.parse(task.assign_to);
          return ((task.status_name === "Open" || task.status_name === "Delayed") && assignOther.indexOf(user_id) !== -1 && user_id != task.create_to_user_id);
        });
        // filter created task (task Open and Delayed)
        const createdTasks = tasks.filter((task) => {
          return (task.status_name === "Open" || task.status_name === "Delayed") && task.user_id === user_id;
        });
        const ASSINGNED_SELF: PeriodicElement[] = assignedSelf;
        this.dataSourceAssinSelf = new MatTableDataSource<PeriodicElement>(ASSINGNED_SELF);
        const ASSINGNED_OTHER: PeriodicElement[] = assignedOther;
        this.dataSourceAssinOther = new MatTableDataSource<PeriodicElement>(ASSINGNED_OTHER);
        const ELEMENT_CREATE: PeriodicElement[] = createdTasks;
        this.dataSourceCrateTask = new MatTableDataSource<PeriodicElement>(ELEMENT_CREATE);
      },
      error => {
        this.alertService.error(error);
      });
  }
  statusGetColor(element) {
    switch (element) {
      case 'Closed':
        return '#4caf50';
      case 'Open':
        return '#FFD933';
      case 'Delayed':
        return '#f44336';
      case 'Closed with Delay':
        return '#a9b7b6';
      case 'On Hold':
        return '#7dabf5';
    }
  }
  fucnPieChart(element: string, data: Array<any>, totalText: any) {
    this[element].nativeElement.innerHTML = '';
    let redirectPage = element;
    let pie = new d3pie(element, {
      "header": {
        "title": {
          "text": totalText,
          "fontSize": 24,
          //"font": "courier",
          "fontWeight": 600
        },
        "location": "pie-center",
        "titleSubtitlePadding": 10
      },
      "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
      },
      "size": {
        "canvasHeight": 220,
        "canvasWidth": 265,
        "pieInnerRadius": "50%",
        "pieOuterRadius": "80%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": data
      },
      callbacks: {
        onClickSegment: function (e) {
          let colorName;
          if (e.data.colorName) { colorName = e.data.colorName; }
          else { colorName = ''; }
          this.clickableForAllPieChart(redirectPage, colorName);
        }.bind(this)
      },
      "labels": {
        "outer": {
          "pieDistance": 5
        },
        "inner": {
          "format": "value",
          "hideWhenLessThanPercentage": 2
        },
        "mainLabel": {
          "fontSize": 12
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 1
        },
        "value": {
          "color": "#333333",
          "fontSize": 12
        },
        "lines": {
          "enabled": true
        },
        "truncation": {
          "enabled": true
        }
      },
      "tooltips": {
        "enabled": true,
        "type": "placeholder",
        // "string": "{label}: {value},{percentage}%"
        "string": "{percentage}%"
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 400,
          "size": 8
        }
      }/*,
          "misc": {
            "gradient": {
              "enabled": true,
              "percentage": 100
            }
          }*/
    });
  }
  clickableForAllPieChart(redirectPage, colorName) {
    let statusId;
    for (const key of Object.entries(STATUSES)) {
      if (key[1] == colorName) {
        statusId = key[0];
      }
    }
    if (redirectPage == "pieChartKPI") {
      this.router.navigate(['/apps/kpitrackers/keyperformance']);
    } else if (redirectPage == "pieChartLeadKPI") {
      this.router.navigate(['/apps/strategic-obj/leadkpi']);
    }
    else if (redirectPage == "pieChartObj") {
      this.router.navigate(['/apps/strategic-obj/strategic/' + statusId]);
    }
    else if (redirectPage == "pieChartIni") {
      this.router.navigate(['/apps/strategic-obj/initiative-data/' + statusId]);
    }
    else if (redirectPage == "pieChartAction") {
      this.router.navigate(['/apps/strategic-obj/action-plan/' + statusId]);
    }
    else {
      this.router.navigate(['/apps/prima-welcome']);
    }
  }
  getColorActual(eleYear, eleMonth, eleLabel) {
    if (eleYear === 'Actual' && eleMonth !== null) {
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
  getLeadKpiData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByheader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDataView(login_access_token, unit_id, role_id, dept_id, selectedYearByheader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        //this.viewLeadKpiData = data.data;
        this.processDataLeadKpi(data.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  processDataLeadKpi(departments: any): any {
    this.renderKPIData = [...departments];
    this.renderKPIData.map((fun: any) => {
      const kpisData = [...fun.add_kpis_data];
      let KPIDATA: PeriodicElement[] = [];
      kpisData.map((kpiData: any) => {
        const kpiTargetRatio = [];
        let kpiTargets = [];
        let kpiActuals = [];
        const targets: any = {
          "kpi_name": kpiData.kpi_name,
          "unit_of_measurement": kpiData.unit_of_measurement,
          "ideal_trend": kpiData.ideal_trend,
          "kpi_definition": kpiData.kpi_definition,
          "section_name": kpiData.section_name,
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
          "kpi_id": kpiData.kpi_id,
          "has_kpi_target": kpiData.has_kpi_target,
          "ytd_target_actual": '',
        };
        const actuals: any = {
          "year_for": "Actual",
          "one_year": 0,
          "two_year": 0,
          "three_year": 0,
          /* "section_name": kpiData.section_name, */
          "section_name": '',
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
          "kpi_id": kpiData.kpi_id,
          "has_kpi_actual": kpiData.has_kpi_actual,
          "has_kpi_target": kpiData.has_kpi_target,
          "ytd_target_actual": '',
        };
        if (kpiData.hasOwnProperty('kpi_targets') && kpiData.hasOwnProperty('kpi_name')) {
          kpiTargets = [...kpiData.kpi_targets];
          kpiTargets.map((kpiTarget) => {
            if (kpiTarget.target_year == this.userSelectedYearFull) {
              targets['kpi_name'] = kpiData.kpi_name;
              targets['unit_of_measurement'] = kpiData.unit_of_measurement;
              targets['ideal_trend'] = kpiData.ideal_trend;
              targets['kpi_definition'] = kpiData.kpi_definition;
              targets['section_name'] = kpiData.section_name;
              // let ytdTargetTotal = 0.00;
              this.KpiYearMonth.map((month) => {
                if (kpiTarget[month] != null) {
                  let monthVlaue = kpiTarget[month].split(".");
                  if (monthVlaue[1] > '00') {
                    targets[month] = monthVlaue[0] + '.' + monthVlaue[1];
                  }
                  else {
                    targets[month] = monthVlaue[0];
                  }
                }
                else {
                  targets[month] = null;
                }
                // ytdTargetTotal = ytdTargetTotal + Number((kpiTarget[month] != null) ? kpiTarget[month]:0.00);
                kpiTargetRatio[month] = kpiTarget[month];
              });
              /* if(ytdTargetTotal == 0.00){
                targets['ytd_target_actual'] = '';
              }
              else{
                let TargetTotal = String(ytdTargetTotal).split(".");
                if(TargetTotal[1]>'00'){
                  targets['ytd_target_actual']= TargetTotal[0]+'.'+TargetTotal[1];
                }
                else{
                  targets['ytd_target_actual']= TargetTotal[0];
                }
              }  */
              if (kpiTarget.ytd == 0.0) {
                targets['ytd_target_actual'] = '';
              }
              else {
                targets['ytd_target_actual'] = kpiTarget.ytd;
              }
            }
            if (kpiTarget.target_year == this.userSelectedYearFull - 1) {
              targets["four_year"] = kpiTarget.avg;
            }
            if (kpiTarget.target_year == this.userSelectedYearFull - 2) {
              targets["three_year"] = kpiTarget.avg;
            }
            if (kpiTarget.target_year == this.userSelectedYearFull - 3) {
              targets["two_year"] = kpiTarget.avg;
            }
            if (kpiTarget.target_year == this.userSelectedYearFull - 4) {
              targets["one_year"] = kpiTarget.avg;
            }
          })
        }
        if (kpiData.hasOwnProperty('kpi_actuals') && kpiData.hasOwnProperty('kpi_name')) {
          kpiActuals = [...kpiData.kpi_actuals];
          kpiActuals.map((kpiActual) => {
            if (kpiActual.actual_year == this.userSelectedYearFull) {
              // store late review month
              let late_review_Data = [];
              if (kpiActual.late_review) {
                for (let key in kpiActual.late_review) {
                  late_review_Data.push(kpiActual.late_review[key].month)
                }
              }
              actuals['late_review'] = late_review_Data;
              //let ytdActualTotal = 0.00;
              const monthRatio = {};
              this.KpiYearMonth.map((month) => {
                if (kpiActual[month] != null) {
                  let monthVlaue = kpiActual[month].split(".");
                  if (monthVlaue[1] > '00') {
                    actuals[month] = monthVlaue[0] + '.' + monthVlaue[1];
                  }
                  else {
                    actuals[month] = monthVlaue[0];
                  }
                }
                else {
                  actuals[month] = null;
                }
                //ytdActualTotal = ytdActualTotal + Number((kpiActual[month] != null) ? kpiActual[month]:0.00);
                if (kpiActual[month] == 0.00 || kpiActual[month] == null || kpiTargetRatio[month] == 0.00 || kpiTargetRatio[month] == null) {
                  monthRatio[month] = 0.00;
                }
                else {
                  monthRatio[month] = kpiActual[month] / kpiTargetRatio[month];
                }
              });
              /* if(ytdActualTotal == 0.00){
                actuals['ytd_target_actual'] = '';
              }
              else{
                let ActualTotal = String(ytdActualTotal).split(".");
                if(ActualTotal[1]>'00'){
                  actuals['ytd_target_actual']= ActualTotal[0]+'.'+ActualTotal[1];
                }
                else{
                  actuals['ytd_target_actual']= ActualTotal[0];
                }
              }  */
              if (kpiData.ideal_trend == "positive") {
                // (0.9>=) green,  (0.7<= or  0.9>)  yellow , (0<0.7) red
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 0.9 ? '#4caf50' : (monthRatio[month] < 0.9 && monthRatio[month] >= 0.7) ? '#FFD933' : (monthRatio[month] < 0.7 && monthRatio[month] != null) ? '#f40000' : '';
                });
              }
              else {
                // (1.1>=) red,  (1.0<= or  1.1>)  yellow , (0<1.0) green
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.1 ? '#f40000' : (monthRatio[month] < 1.1 && monthRatio[month] >= 1.0) ? '#FFD933' : (monthRatio[month] < 1.0 && monthRatio[month] != null) ? '#4caf50' : '';
                });
              }
              if (kpiActual.ytd == 0.0) {
                actuals['ytd_target_actual'] = '';
              }
              else {
                actuals['ytd_target_actual'] = kpiActual.ytd;
              }
            }
            if (kpiActual.actual_year == this.userSelectedYearFull - 1) {
              actuals["four_year"] = kpiActual.avg;
            }
            if (kpiActual.actual_year == this.userSelectedYearFull - 2) {
              actuals["three_year"] = kpiActual.avg;
            }
            if (kpiActual.actual_year == this.userSelectedYearFull - 3) {
              actuals["two_year"] = kpiActual.avg;
            }
            if (kpiActual.actual_year == this.userSelectedYearFull - 4) {
              actuals["one_year"] = kpiActual.avg;
            }
          })
        }
        KPIDATA.push(targets);
        KPIDATA.push(actuals);
      });
      /*KPIDATA.map((kpi_id: any, index: number) => {
        kpi_id.sr_no = index + 1;
      });*/
      fun['datasource'] = new MatTableDataSource<PeriodicElement>(KPIDATA);
    });
  }
  mainDashboardPDF() {
    this.loaderService.show();
    var data = document.getElementById('prima-welcome');
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
      pdf.save('maindashboard.pdf');
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElementSIA {
  name_StrInitia: string;
  total: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
}
export interface PeriodicElementLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_LESENT: PeriodicElementLesent[] = [
  { lesent_name: 'Red', lesent_description: 'Delayed / No recovery action plan' },
  { lesent_name: 'Yellow', lesent_description: 'Some delay / Action plan in place' },
  { lesent_name: 'Green', lesent_description: 'Activity completed on time' },
  { lesent_name: 'Gray', lesent_description: 'Activity ongoing / On track' },
  { lesent_name: 'Blue', lesent_description: 'Activity on hold' }
];
export interface PeriodicElementKPI {
  sr_no?: number;
  // position: number;
  dept_name: string;
  total_kpi: number;
  green: number;
  yellow: number;
  red: number;
  gray: number;
}
export interface PeriodicElementKpiLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_KPI_LESENT: PeriodicElementKpiLesent[] = [
  { lesent_name: 'Green', lesent_description: 'Activity completed on time' },
  { lesent_name: 'Yellow', lesent_description: 'Some delay / Action plan in place' },
  { lesent_name: 'Red', lesent_description: 'Delayed / No recovery action plan' },
  { lesent_name: 'Gray', lesent_description: 'Activity ongoing / On track' },
];
export interface PeriodicElementTASK {
  sr_no: number;
  task_name: string;
  // task_owaner_name: string;
  priority_name: string;
  status_name: string;
  //start_date: string;
}
export interface PeriodicElement {
  sr_no: number;
  reminder_tittle: string;
  category: string;
  status: string;
  reminder_date: string;
}
export interface PeriodicElementReKPI {
  sr_no: number;
  kpi_name: string;
  month: string;
}
export interface PeriodicElementReKPIComing {
  sr_no: number;
  kpi_name: string;
  month: string;
}