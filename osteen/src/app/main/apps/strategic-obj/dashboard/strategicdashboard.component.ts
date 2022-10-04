import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
//import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import * as d3v4 from 'd3v4';
//declare let d3: any;
declare let d3pie: any;
//import { legendColor } from 'd3-svg-legend';
//import { Chart } from 'angular-highcharts';
//declare let Highcharts: any;
import * as Highcharts from 'highcharts';
//import { LineChartComponent } from '../company-performances/Charts/linechart.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { STATUSES } from '../../_constants';
@Component({
  selector: 'strategic-dashboard',
  templateUrl: './strategicdashboard.component.html',
  styleUrls: ['./strategicdashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StrategicDashboardComponent implements OnInit {
  currentUser: any;
  strDataDashboard: any;
  renderStrData: Array<any>;
  depDataBarChart: Array<any>;
  totalstrDataDashboard: any;
  dataInitCounter: Array<any>;
  chartsInit: Array<any>;
  dataStrCounter: Array<any>;
  chartsStr: Array<any>;
  objectivesPercent: any;
  Highcharts: any;
  messageError: any;
  typeOfGraph: any;
  // panelOpenState: boolean = false;
  //allExpandState = false;
  //userDepartment:any;
  dataDepartment: any;
  unit_name: any;
  unit_id: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  displayedColumns: string[] = ['name_StrInitia', 'total', 'green', 'yellow', 'red', 'gray', 'blue'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('pieChartObj') pieChartObj: ElementRef;
  @ViewChild('pieChartIni') pieChartIni: ElementRef;
  @ViewChild('pieChartAction') pieChartAction: ElementRef;
  currentYearSubscription: Subscription;
  userSelectedYear: number;
  // public chartType: string = 'doughnut';
  /**
   * Constructor
   *
   *
   */
  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
  }
  dept_nameFilter = new FormControl();
  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_name = localStorage.getItem('currentUnitName');
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.resetOptions();
      this.viewStrategicDashboard(this.typeOfGraph);
    });
    this.getDepartment();
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
  }
  /* applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } */
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        //this.userDepartment = data;
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewStrategicDashboard(typeOfGraph: any) {
    let graphType = (typeOfGraph) ? (typeOfGraph) : 'bar';
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = localStorage.getItem('currentUnitId');
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strategicDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.strDataDashboard = data;
        this.processData(this.strDataDashboard.data);
        this.fucnBarChart(this.strDataDashboard.data_acording_to_dept, graphType);
      },
      error => {
        this.alertService.error(error);
      });
  }
  filterRenderedData(deptId: any) {
    let department;
    if (deptId) {
      department = this.strDataDashboard.data_acording_to_dept.filter((department) => {
        return department.dept_id === Number(deptId);
      });
      if (department[0] == null) {
        this.messageError = 'No data for this department';
        this.alertService.error(this.messageError, true);
        return true;
      }
      else {
        this.processData(department[0]);
      }
    }
    else {
      department = [this.strDataDashboard.data];
      this.processData(department[0]);
    }
  }
  processData(stralldata: any): any {
    this.renderStrData = stralldata;
    this.prepareDataForChart(this.renderStrData);
    this.totalstrDataDashboard = this.renderStrData;
    const TOTALSTRDATA: PeriodicElement[] = [];
    /* const stausIconeColor = {
      name_StrInitia: ' ',
      total: '',
      green: 'icone',
      yellow: 'icone',
      red: 'icone',
      blue: 'icone',
      gray: 'icone'
    }; */
    const objectivesTotal = {
      name_StrInitia: 'Strategic Objectives',
      total: this.totalstrDataDashboard.strategic_objectives.total,
      green: this.totalstrDataDashboard.strategic_objectives.green,
      yellow: this.totalstrDataDashboard.strategic_objectives.yellow,
      red: this.totalstrDataDashboard.strategic_objectives.red,
      blue: this.totalstrDataDashboard.strategic_objectives.blue,
      gray: this.totalstrDataDashboard.strategic_objectives.gray
    };
    const initiativesTotal = {
      name_StrInitia: 'Initiatives',
      total: this.totalstrDataDashboard.initiatives.total,
      green: this.totalstrDataDashboard.initiatives.green,
      yellow: this.totalstrDataDashboard.initiatives.yellow,
      red: this.totalstrDataDashboard.initiatives.red,
      blue: this.totalstrDataDashboard.initiatives.blue,
      gray: this.totalstrDataDashboard.initiatives.gray
    }
    const actionPlanTotal = {
      name_StrInitia: 'Action Plan',
      total: this.totalstrDataDashboard.action_plans.total,
      green: this.totalstrDataDashboard.action_plans.green,
      yellow: this.totalstrDataDashboard.action_plans.yellow,
      red: this.totalstrDataDashboard.action_plans.red,
      blue: this.totalstrDataDashboard.action_plans.blue,
      gray: this.totalstrDataDashboard.action_plans.gray
    }
    // TOTALSTRDATA.push(stausIconeColor);
    TOTALSTRDATA.push(objectivesTotal);
    TOTALSTRDATA.push(initiativesTotal);
    TOTALSTRDATA.push(actionPlanTotal);
    this.dataSource = new MatTableDataSource<PeriodicElement>(TOTALSTRDATA);
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
        "pieOuterRadius": "83%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": data
      },
      callbacks: {
        onClickSegment: function (e) {
          const colorName = e.data.colorName;
          const deptName = '';
          this.chartClickableForStrIniAction(redirectPage, colorName, deptName);
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
  fucnBarChart(barChartdata: any, graphType: any): any {
    const greenDataStr = {
      name: 'Green',
      data: [],
      color: '#4caf50'
    };
    const yellowDataStr = {
      name: 'Yellow',
      data: [],
      color: '#FFD933'
    };
    const redDataStr = {
      name: 'Red',
      data: [],
      color: '#f44336'
    };
    const grayDataStr = {
      name: 'Gray (Started)',
      data: [],
      color: '#a9b7b6'
    };
    const blueDataStr = {
      name: 'Blue (Hold)',
      data: [],
      color: '#7dabf5'
    };
    const greenDataInt = {
      name: 'Green',
      data: [],
      color: '#4caf50'
    };
    const yellowDataInt = {
      name: 'Yellow',
      data: [],
      color: '#FFD933'
    };
    const redDataInt = {
      name: 'Red',
      data: [],
      color: '#f44336'
    };
    const grayDataInt = {
      name: 'Gray (Started)',
      data: [],
      color: '#a9b7b6'
    };
    const blueDataInt = {
      name: 'Blue (Hold)',
      data: [],
      color: '#7dabf5'
    };
    const depts: Array<string> = [];
    this.depDataBarChart = [...barChartdata];
    this.depDataBarChart.map((data) => {
      depts.push(data.dept_name);
      greenDataStr.data.push(data.strategic_objectives.green);
      yellowDataStr.data.push(data.strategic_objectives.yellow);
      redDataStr.data.push(data.strategic_objectives.red);
      grayDataStr.data.push(data.strategic_objectives.gray);
      blueDataStr.data.push(data.strategic_objectives.blue);
      greenDataInt.data.push(data.initiatives.green);
      yellowDataInt.data.push(data.initiatives.yellow);
      redDataInt.data.push(data.initiatives.red);
      grayDataInt.data.push(data.initiatives.gray);
      blueDataInt.data.push(data.initiatives.blue);
    });
    const seriesStr = [blueDataStr,grayDataStr,redDataStr,yellowDataStr,greenDataStr];
    const seriesInt = [blueDataInt,grayDataInt,redDataInt,yellowDataInt,greenDataInt];
    const titleStr = { text: 'Strategic Objectives' };
    const titleInt = { text: 'Initiatives' };
    this.prepareDataForBarChart("containerStr", seriesStr, depts, titleStr, graphType);
    this.prepareDataForBarChart("containerInt", seriesInt, depts, titleInt, graphType);
  }
  prepareDataForBarChart(element: string, data: any, categories: any, titleText: any, graphType) {
    let redirectPage = element;
    Highcharts.chart(element, {
      chart: {
        type: graphType,
        // plotBorderWidth: 1,
        style: {
          fontFamily: 'Muli, Helvetica Neue, Arial, sans-serif'
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: '#ffffff',
            style: {
              fontSize: '12px'
            }
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (e) {
                const colorName = e.point.series.name;
                const deptName = e.point.category;
                this.chartClickableForStrIniAction(redirectPage, colorName, deptName);
              }.bind(this)
            }
          },
          dataLabels: {
            enabled: true,
            inside: true
          },
          showInLegend: false,
          stacking: 'normal'
        }
      },
      title: titleText,
      xAxis: {
        categories: categories,
        labels: {
          //rotation:0,
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        /*layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: 0,
        y: 5,
        floating: true,
       borderWidth: 1,
        borderRadius: 2,
        backgroundColor: '#FFFFFF',
        shadow: true,
        width:100,
        itemMarginTop: 5,
        itemMarginBottom: 5*/
      },
      series: data
    });
  }
  chartClickableForStrIniAction(redirectPage, colorName, deptName) {
    let statusId;
    for (const key of Object.entries(STATUSES)) {
      if (key[1] == colorName) {
        statusId = key[0];
      }
    }
    if (redirectPage == "pieChartObj" || redirectPage == "containerStr") {
      if (deptName) {
        this.router.navigate(['/apps/strategic-obj/strategic-status-dept/' + statusId + '/' + deptName]);
      } else {
        this.router.navigate(['/apps/strategic-obj/strategic/' + statusId]);
      }
    }
    else if (redirectPage == "pieChartIni" || redirectPage == "containerInt") {
      if (deptName) {
        this.router.navigate(['/apps/strategic-obj/initiative-data-status-dept/' + statusId + '/' + deptName]);
      } else {
        this.router.navigate(['/apps/strategic-obj/initiative-data/' + statusId]);
      }
    }
    else if (redirectPage == "pieChartAction") {
      this.router.navigate(['/apps/strategic-obj/action-plan/' + statusId]);
    }
    else {
      this.router.navigate(['/apps/strategic-obj/dashboard']);
    }
  }
  /*   chartClickable(redirectPage) {
      if (redirectPage == "pieChartObj") {
        this.router.navigate(['/apps/strategic-obj/strategic']);
      }
      else if (redirectPage == "pieChartIni") {
        this.router.navigate(['/apps/strategic-obj/initiative-data']);
      }
      else if (redirectPage == "pieChartAction") {
        this.router.navigate(['/apps/strategic-obj/action-plan']);
      }
      else {
        this.router.navigate(['/apps/strategic-obj/dashboard']);
      }
    } */
  strObjeDashboardPDF() {
    this.loaderService.show();
    var data = document.getElementById('strategic-dashboard');
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
      pdf.save('strObjDashboard.pdf');
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  name_StrInitia: string;
  total: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
}
const ELEMENT_DATA: PeriodicElement[] = [];

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
