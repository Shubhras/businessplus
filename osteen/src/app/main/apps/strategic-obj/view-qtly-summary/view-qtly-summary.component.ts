import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { User } from '../../_models';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import * as d3v4 from 'd3v4';
declare let d3: any;
declare let d3pie: any;
import { legendColor } from 'd3-svg-legend';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'view-qtly-summary',
  templateUrl: './view-qtly-summary.component.html',
  styleUrls: ['./view-qtly-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ViewQtlySummaryComponent implements OnInit {
  currentUser: any;
  unit_id: any;
  sub: any;
  id: any;
  deptId: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  displayedColumnsQuarterly: string[] = ['heading', 'heading_name', 'heading_first', 'heading_name_first'];
  dataSourceQuarterly: any;
  displayedColumns: string[] = ['name_StrInitia', 'total', 'red', 'green', 'yellow', 'blue', 'gray'];
  dataSource: any;
  displayedColumnsAction: string[] = ['sr_no', 'initiatives_definition', 'action_plan_definition', 'assign_action_plan_user', 'dept_name', 'kpi_data',
    'target', 'start_date', 'end_date', 'percentage', 'status_name', 'comment'];
  dataSourceAction: any;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  quartelyviewdata: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('pieChartObj') pieChartObj: ElementRef;
  @ViewChild('pieChartIni') pieChartIni: ElementRef;
  @ViewChild('pieChartAction') pieChartAction: ElementRef;
  @ViewChild('pieChartKPI') pieChartKPI: ElementRef;
  @ViewChild('pieChartLeadKPI') pieChartLeadKPI: ElementRef;
  currentYear: number;
  userSelectedYear: any;
  currentYearSubscription: Subscription;
  /**
   * Constructor
   *
   *
   */
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private bottomSheet: MatBottomSheet,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
    // public datepipe: DatePipe
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.deptId = +params['deptId'];
    });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewStrategicDashboard();
      this.viewKpiDashboardData();
      this.viewLeadKpiDashboardData();
    });
    this.currentYear = new Date().getFullYear();
    this.viewActionPlan(this.currentYear);
    this.singleQtlySummaryView();
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  singleQtlySummaryView() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_name = localStorage.getItem('currentUnitName');
    let id = this.id;
    this.userService.viewSingleQtlySummary(login_access_token, id).pipe(first()).subscribe(
      (data: any) => {
        this.quartelyviewdata = data.data;
        const ELEMENT_DATA: PeriodicElementQuarterly[] = [
          { heading: 'Unit', heading_name: unit_name, heading_first: 'Financial Year', heading_name_first: data.data.year },
          { heading: 'Department', heading_name: data.data.dept_name, heading_first: 'Period', heading_name_first: data.data.quarterly }
        ];
        this.dataSourceQuarterly = new MatTableDataSource<PeriodicElementQuarterly>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.kpiDashboardDataView(login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        // filter data according department
        let LEADKPIDATA;
        LEADKPIDATA = data.data.filter((KPI) => {
          return KPI.dept_id === Number(this.deptId);
        });
        // kpi total for pie chart
        const KpiTotal = LEADKPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
        const greenTotal = LEADKPIDATA.reduce((sum, item) => sum + item.green, 0);
        const redTotal = LEADKPIDATA.reduce((sum, item) => sum + item.red, 0);
        const yellowTotal = LEADKPIDATA.reduce((sum, item) => sum + item.yellow, 0);
        const grayTotal = LEADKPIDATA.reduce((sum, item) => sum + item.gray, 0);
        this.prepareDataAllKPIChart(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal);
      },
      error => {
        this.alertService.error(error);
      });
  }
  prepareDataAllKPIChart(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal) {
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
  viewLeadKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        // filter data according department
        let KPIDATA;
        KPIDATA = data.data.filter((KPIDATA) => {
          return KPIDATA.dept_id === Number(this.deptId);
        });
        // kpi total for pie chart
        const leadKpiTotal = KPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
        const leadGreenTotal = KPIDATA.reduce((sum, item) => sum + item.green, 0);
        const leadRedTotal = KPIDATA.reduce((sum, item) => sum + item.red, 0);
        const leadYellowTotal = KPIDATA.reduce((sum, item) => sum + item.yellow, 0);
        const leadGrayTotal = KPIDATA.reduce((sum, item) => sum + item.gray, 0);
        this.prepareLeadForChart(leadKpiTotal, leadGreenTotal, leadRedTotal, leadYellowTotal, leadGrayTotal);
      },
      error => {
        this.alertService.error(error);
      });
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
  fucnPieChart(element: string, data: Array<any>, totalText: any) {
    this[element].nativeElement.innerHTML = '';
    let pie = new d3pie(element, {
      "header": {
        "title": {
          "text": totalText,
          "fontSize": 24,
          //"font": "courier",
          "fontWeight": 600,
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
        "pieOuterRadius": "83%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": data
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
  viewStrategicDashboard() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strategicDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        // filter data according department
        let department;
        department = data.data_acording_to_dept.filter((department) => {
          return department.dept_id === Number(this.deptId);
        });
        this.processData(department[0]);
      },
      error => {
        this.alertService.error(error);
      });
  }
  processData(stralldata: any): any {
    const TOTALSTRDATA: PeriodicElement[] = [];
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
    this.dataSource = new MatTableDataSource<PeriodicElement>(TOTALSTRDATA);
    const graphDataStr = [
      {
        "label": (stralldata.strategic_objectives.green * 100 / stralldata.strategic_objectives.total).toFixed(1) + '%',
        "value": stralldata.strategic_objectives.green,
        "color": "#4caf50"
      }, {
        "label": (stralldata.strategic_objectives.yellow * 100 / stralldata.strategic_objectives.total).toFixed(1) + '%',
        "value": stralldata.strategic_objectives.yellow,
        "color": "#FFD933"
      }, {
        "label": (stralldata.strategic_objectives.red * 100 / stralldata.strategic_objectives.total).toFixed(1) + '%',
        "value": stralldata.strategic_objectives.red,
        "color": "#f44336"
      },
      {
        "label": (stralldata.strategic_objectives.blue * 100 / stralldata.strategic_objectives.total).toFixed(1) + '%',
        "value": stralldata.strategic_objectives.blue,
        "color": "#7dabf5"
      },
      {
        "label": (stralldata.strategic_objectives.gray * 100 / stralldata.strategic_objectives.total).toFixed(1) + '%',
        "value": stralldata.strategic_objectives.gray,
        "color": "#a9b7b6"
      },
    ];
    const graphDataIni = [
      {
        "label": (stralldata.initiatives.green * 100 / stralldata.initiatives.total).toFixed(1) + '%',
        "value": stralldata.initiatives.green,
        "color": "#4caf50"
      }, {
        "label": (stralldata.initiatives.yellow * 100 / stralldata.initiatives.total).toFixed(1) + '%',
        "value": stralldata.initiatives.yellow,
        "color": "#FFD933"
      }, {
        "label": (stralldata.initiatives.red * 100 / stralldata.initiatives.total).toFixed(1) + '%',
        "value": stralldata.initiatives.red,
        "color": "#f44336"
      },
      {
        "label": (stralldata.initiatives.blue * 100 / stralldata.initiatives.total).toFixed(1) + '%',
        "value": stralldata.initiatives.blue,
        "color": "#7dabf5"
      },
      {
        "label": (stralldata.initiatives.gray * 100 / stralldata.initiatives.total).toFixed(1) + '%',
        "value": stralldata.initiatives.gray,
        "color": "#a9b7b6"
      },
    ];
    const graphDataAction = [
      {
        "label": (stralldata.action_plans.green * 100 / stralldata.action_plans.total).toFixed(1) + '%',
        "value": stralldata.action_plans.green,
        "color": "#4caf50"
      }, {
        "label": (stralldata.action_plans.yellow * 100 / stralldata.action_plans.total).toFixed(1) + '%',
        "value": stralldata.action_plans.yellow,
        "color": "#FFD933"
      }, {
        "label": (stralldata.action_plans.red * 100 / stralldata.action_plans.total).toFixed(1) + '%',
        "value": stralldata.action_plans.red,
        "color": "#f44336"
      },
      {
        "label": (stralldata.action_plans.blue * 100 / stralldata.action_plans.total).toFixed(1) + '%',
        "value": stralldata.action_plans.blue,
        "color": "#7dabf5"
      },
      {
        "label": (stralldata.action_plans.gray * 100 / stralldata.action_plans.total).toFixed(1) + '%',
        "value": stralldata.action_plans.gray,
        "color": "#a9b7b6"
      },
    ];
    this.fucnPieChart("pieChartObj", graphDataStr, stralldata.strategic_objectives.total);
    this.fucnPieChart("pieChartIni", graphDataIni, stralldata.initiatives.total);
    this.fucnPieChart("pieChartAction", graphDataAction, stralldata.action_plans.total);
  }
  viewActionPlan(selectedYear: any) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let financialYear = this.companyFinancialYear;
    this.userService.actionPlanView(login_access_token, unit_id, role_id, dept_id, selectedYear,financialYear).pipe(first()).subscribe(
      (data: any) => {
        // filter data according department
        let deptAccordData;
        deptAccordData = data.data.filter((deptData) => {
          return deptData.dept_id === Number(this.deptId);
        });
        const ELEMENT_DATA: PeriodicElement[] = deptAccordData;
        this.dataSourceAction = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewQtlySummaryPDF() {
    this.loaderService.show();
    var data = document.getElementById('view-qtly-summary');
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
      pdf.save('view-qtly-summary.pdf');
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElementQuarterly {
  heading: string;
  heading_name: string;
  heading_first: string;
  heading_name_first: string
}
export interface PeriodicElement {
  name_StrInitia: string;
  total: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
}
export interface PeriodicElementActions {
  sr_no: number;
  dept_name: string;
  initiatives_definition: string;
  action_plan_definition: string;
  kpi_data: any;
  assign_action_plan_user: Array<any>;
  target: string;
  start_date: string;
  end_date: string;
  percentage: number;
  status_name: string;
  comment: string;
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