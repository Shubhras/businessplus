import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
// import * as d3v4 from 'd3v4';
// declare let d3: any;
declare let d3pie: any;
// import { legendColor } from 'd3-svg-legend';
// import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
// import * as moment from 'moment';
// import { ComboChartConfig } from './ComboChartConfig';
import { LineChartConfig } from './LineChartConfig';
import { targetActualDialod } from '../../common-dialog/kpi-actual/target-actual.component';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'company-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PerformancesComponent implements OnInit {
  currentUser: any;
  unit_id: any;
  //dept_id: any;
  //kpiid: any;
  comparekpi: any;
  /*   currentYear: any;
    currentYearFull: any; */
  user_id: number;
  alloted_dept: any;
  viewVision: any;
  viewMission: any;
  viewValues: any;
  viewCEO_msg: any;
  highlights: any;
  priorityAllData: any;
  kpiGraphData: any;
  //renderKPIData: Array<any>;
  kpisData: any;
  //dept_name: string;
  public chartType: string = 'line';
  hasBackdrop: any;
  mode: any;
  elementID: string;
  IdealTrend: string;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  userSelectedYearFull: any;
  userSelectedYearHalf: any;
  currentYearPlusOne: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  monthsFinancial = [];
  company_id: any;
  config1: LineChartConfig;
  displayedColumns: string[] = ['sr_no', 'kpi_name', 'year_for', 'four_year', 'three_year', 'two_year', 'one_year', 'ytd_target_actual', 'current_year_month', 'last_year_month', 'diff_last_year_month', 'cagr'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('pieChartPerformKPI') pieChartPerformKPI: ElementRef;
  /**
   * Constructor
   *
   */
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private dataYearService: DataYearService
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    /* let nowCurrentYear = new Date();
    this.currentYear = moment(nowCurrentYear, 'YYYY-MM-DD').format('YY');
    this.currentYearFull = moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY'); */
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.alloted_dept = this.currentUser.dept_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    if (this.companyFinancialYear == 'april-march') {
      this.monthsFinancial = ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"];
    } else {
      this.monthsFinancial = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    }
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    // this.performanceKpiPieChart();
    this.hasBackdrop = false;
    this.mode = 'Over';
    this.config1 = new LineChartConfig('', 0);
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.viewKpiGraphData();
      this.viewVisionData();
      this.priorityGet();
    });
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
  kpiCommentOpen(kpiId): void {
    let kpiATDATA;
    let login_access_token = this.currentUser.login_access_token;
    let kpi_id = kpiId;
    let company_id = this.currentUser.data.company_id;
    let year = new Date().getFullYear();
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
  viewVisionData() {
    let login_access_token = this.currentUser.login_access_token;
    let company_id = this.currentUser.data.company_id;
    this.userService.VisionDataView(login_access_token, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.viewVision = data.data.vision;
        this.viewMission = data.data.mission;
        this.viewValues = data.data.values;
        this.viewCEO_msg = data.data.message_of_ceo;
        this.highlights = data.data.highlights;
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
        this.priorityAllData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewKpiGraphData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let dept_id = this.alloted_dept;
    this.userService.performanceKpiDashboard(login_access_token, unit_id,dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.kpiGraphData = data.data;

        this.processData(this.kpiGraphData);
        //this.testchartKPI(this.kpiGraphData);
      },
      error => {
        this.alertService.error(error);
      });
  }
  processData(kpialldata: any): any {
    const kpi_data = [...kpialldata];
    //const currentYear = new Date().getFullYear();
    const months = ["jan", "feb", "mar", "apr", "may", "june", "july", "aug", "sept", "oct", "nov", "dec"];
    // const kpiActualsCompareData = {};
    let KPIDATA: PeriodicElement[] = [];
    kpi_data.map((kpi: any, index: number) => {
      kpi.sr_no = index + 1;
      let elementID = 'curve_chart_' + kpi.kpi_id;
      const kpiData = [];
      const kpiChartData = {};
      const targets: any = {
        "sr_no": kpi.sr_no,
        "kpi_name": kpi.kpi_name,
        "year_for": "Target",
        "one_year": 0,
        "two_year": 0,
        "three_year": 0,
        "four_year": 0,
        "current_year_month": 0,
        "last_year_month": 0,
        "diff_last_year_month": '',
        "ytd_target_actual": '',
      };
      const actuals: any = {
        "kpi_name": '',
        "year_for": "Actual",
        "one_year": 0,
        "two_year": 0,
        "three_year": 0,
        "four_year": 0,
        "current_year_month": 0,
        "last_year_month": 0,
        "diff_last_year_month": '',
        "ytd_target_actual": '',
      };
      kpi.kpi_targets.map(target => {
        if (parseInt(target.target_year) === this.userSelectedYearFull) {
          // for (let key in target) {
          for (let key of this.monthsFinancial) {
            if (months.indexOf(key) !== -1) {
              kpiChartData[key] = [target[key] !== null ? parseFloat(target[key]) : 0.0, target[key] !== null ? parseFloat(target[key]) : 0.0];
            }
          }
          // targets data for table
          targets["current_year_month"] = target.current_month_target;
          targets["ytd_target_actual"] = target.ytd;

        }
        else {
          kpiChartData[target.target_year] = [target['avg'] !== null ? parseFloat(target['avg']) : 0.0, target['avg'] !== null ? parseFloat(target['avg']) : 0.0];
          // targets data for table
          if (target.target_year == this.userSelectedYearFull - 1) {
            targets["last_year_month"] = target.current_month_target;
            targets["four_year"] = target.avg;
          }
          if (target.target_year == this.userSelectedYearFull - 2) {
            targets["three_year"] = target.avg;
          }
          if (target.target_year == this.userSelectedYearFull - 3) {
            targets["two_year"] = target.avg;
          }
          if (target.target_year == this.userSelectedYearFull - 4) {
            targets["one_year"] = target.avg;
          }
        }
        // start targets data for table
        if (targets["last_year_month"] == 0) {
          targets["diff_last_year_month"] = ((targets["current_year_month"] - targets["last_year_month"]));
        }
        else {
          let diffTargetValue = ((targets["current_year_month"] - targets["last_year_month"]) * 100) / targets["last_year_month"];
          targets["diff_last_year_month"] = (diffTargetValue).toFixed(2);
          let targetVlaueDiff = targets["diff_last_year_month"].split(".");
          if (targetVlaueDiff[1] > '00') {
            targets["diff_last_year_month"] = targetVlaueDiff[0] + '.' + targetVlaueDiff[1];
          }
          else {
            targets["diff_last_year_month"] = targetVlaueDiff[0];
          }
        }
        // end targets data for table
      });
      kpi.kpi_actuals.map(actual => {
        if (parseInt(actual.actual_year) === this.userSelectedYearFull) {
          //for (let key in actual) {
          for (let key of this.monthsFinancial) {
            if (months.indexOf(key) !== -1) {
              kpiChartData[key].push(actual[key] !== null ? parseFloat(actual[key]) : 0.0, actual[key] !== null ? parseFloat(actual[key]) : 0.0);
            }
          }
          // actuals data for table

          // start YTD color
          if (kpi.ideal_trend == "positive") {
            // (1.0>=) green #4caf50,  (1.0< or  0.9>=)  yellow #FFD933, (0<0.9) red #f40000, #f3f3f3 grey
            actuals['ytd_color'] = kpi.kpistatus >= 1.0 ? '#4caf50' : (kpi.kpistatus < 1.0 && kpi.kpistatus >= 0.9) ? '#FFD933' : (kpi.kpistatus < 0.9 && kpi.kpistatus != null && kpi.kpistatus > 0) ? '#f40000' : '#f3f3f3';
          }
          else {
            // (1.1>=) red,  (1.1< or  1.0>)  yellow , (0<=1.0) green
            actuals['ytd_color'] = kpi.kpistatus >= 1.1 ? '#f40000' : (kpi.kpistatus < 1.1 && kpi.kpistatus > 1.0) ? '#FFD933' : (kpi.kpistatus <= 1.0 && kpi.kpistatus != null && kpi.kpistatus > 0) ? '#4caf50' : '#f3f3f3';
          }
          // end YTD  color

          actuals["current_year_month"] = actual.current_month_actual;
          if(actual.jan ==null && actual.feb ==null && actual.mar ==null && actual.apr ==null && actual.may ==null && actual.jun ==null&& actual.jul ==null&& actual.aug ==null&& actual.sep ==null&& actual.oct ==null&& actual.nov ==null&& actual.dec ==null ) {
            actual.ytd = null;
          }
          actuals["ytd_target_actual"] = actual.ytd;

          // let actualsVlaue = actuals["ytd_target_actual"].split(".");
          // if (actualsVlaue[1] > '00') {
          //   actuals["ytd_target_actual"] = actualsVlaue[0] + '.' + actualsVlaue[1];
          // }
          // else {
          //   actuals["ytd_target_actual"] = actualsVlaue[0];
          // }          
        }
        else {
          kpiChartData[actual.actual_year].push(actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0, actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0);
          // actuals data for table
          if (actual.actual_year == this.userSelectedYearFull - 1) {
            actuals["last_year_month"] = actual.current_month_actual;
            actuals["four_year"] = actual.avg;
          }
          if (actual.actual_year == this.userSelectedYearFull - 2) {
            actuals["three_year"] = actual.avg;
          }
          if (actual.actual_year == this.userSelectedYearFull - 3) {
            actuals["two_year"] = actual.avg;
          }
          if (actual.actual_year == this.userSelectedYearFull - 4) {
            actuals["one_year"] = actual.avg;
          }
        }
        // actuals data for table
        if (actuals["last_year_month"] == 0) {
          actuals["diff_last_year_month"] = ((actuals["current_year_month"] - actuals["last_year_month"]));
        }
        else {
          let diffValue = ((actuals["current_year_month"] - actuals["last_year_month"]) * 100) / actuals["last_year_month"];
          actuals["diff_last_year_month"] = (diffValue).toFixed(2);
          let actualVlaueDiff = actuals["diff_last_year_month"].split(".");
          if (actualVlaueDiff[1] > '00') {
            actuals["diff_last_year_month"] = actualVlaueDiff[0] + '.' + actualVlaueDiff[1];
          }
          else {
            actuals["diff_last_year_month"] = actualVlaueDiff[0];
          }
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
      kpi['chartData'] = kpiData;
      // data for table
      KPIDATA.push(targets);
      KPIDATA.push(actuals);
      // data for table
      this.dataSource = new MatTableDataSource<PeriodicElement>(KPIDATA);
    });

    this.kpisData = [...kpi_data];
  }

  getColor(year_for: any, color: any) {
    if (year_for == 'Actual') {
      if (color == '#f40000' || color == '#4caf50') {
        return {
          'background-color': color,
          'color': '#fff',
          'font-weight': '700',
          'align-items': 'center',
          'min-width': '41px',
          'max-width': '40px',
          'height': '15px',
          'padding': '0 2px',
          'font-size': '11px',
          'border-radius': '20px',
          'transition': 'opacity 0.2s ease-in-out 0.1s',
          'display': 'flex',
          'text-align': 'center',
          'justify-content': 'center',
          'margin': '10px auto',
        };
      }
      else {
        return {
          'background-color': color,
          'font-weight': '700',
          'align-items': 'center',
          'min-width': '41px',
          'max-width': '40px',
          'height': '15px',
          'padding': '0 2px',
          'font-size': '11px',
          'border-radius': '20px',
          'transition': 'opacity 0.2s ease-in-out 0.1s',
          'display': 'flex',
          'text-align': 'center',
          'justify-content': 'center',
          'margin': '10px auto',
        };
      }
    }
    else {
      return { 'background-color': '' };
    }
  }
  // performanceKpiPieChart() {
  //   let login_access_token = this.currentUser.login_access_token;
  //   let unit_id = this.unit_id;
  //   this.userService.perforKpiStatusdView(login_access_token, unit_id).pipe(first()).subscribe(
  //     (data: any) => {
  //       this.processPerformData(data.data);
  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }
  // processPerformData(PerformKPIDATA: any): any {
  //   // kpi total for pie chart
  //   const PerformKpiTotal = PerformKPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
  //   const PerformGreenTotal = PerformKPIDATA.reduce((sum, item) => sum + item.green, 0);
  //   const PerformRedTotal = PerformKPIDATA.reduce((sum, item) => sum + item.red, 0);
  //   const PerformYellowTotal = PerformKPIDATA.reduce((sum, item) => sum + item.yellow, 0);
  //   const PerformGrayTotal = PerformKPIDATA.reduce((sum, item) => sum + item.gray, 0);
  //   this.preparePerformForChart(PerformKpiTotal, PerformGreenTotal, PerformRedTotal, PerformYellowTotal, PerformGrayTotal);
  // }
  // preparePerformForChart(PerformKpiTotal, PerformGreenTotal, PerformRedTotal, PerformYellowTotal, PerformGrayTotal) {
  //   const totalPerformKPI = PerformKpiTotal;
  //   const graphDataPerformKPI = [
  //     {
  //       "label": (PerformRedTotal * 100 / PerformKpiTotal).toFixed(1) + '%',
  //       "value": PerformRedTotal,
  //       "color": "#f44336"
  //     }, {
  //       "label": (PerformGreenTotal * 100 / PerformKpiTotal).toFixed(1) + '%',
  //       "value": PerformGreenTotal,
  //       "color": "#4caf50"
  //     }, {
  //       "label": (PerformYellowTotal * 100 / PerformKpiTotal).toFixed(1) + '%',
  //       "value": PerformYellowTotal,
  //       "color": "#FFD933"
  //     },
  //     {
  //       "label": (PerformGrayTotal * 100 / PerformKpiTotal).toFixed(1) + '%',
  //       "value": PerformGrayTotal,
  //       "color": "#a9b7b6"
  //     }
  //   ];
  //   this.fucnPieChart("pieChartPerformKPI", graphDataPerformKPI, totalPerformKPI);
  // }
  // fucnPieChart(element: string, data: Array<any>, totalText: any) {
  //   this[element].nativeElement.innerHTML = '';
  //   let pie = new d3pie(element, {
  //     "header": {
  //       "title": {
  //         "text": totalText,
  //         "fontSize": 24,
  //         //"font": "courier",
  //         "fontWeight": 600,
  //       },
  //       "location": "pie-center",
  //       "titleSubtitlePadding": 10
  //     },
  //     "footer": {
  //       "color": "#999999",
  //       "fontSize": 10,
  //       "font": "open sans",
  //       "location": "bottom-left"
  //     },
  //     "size": {
  //       "canvasHeight": 220,
  //       "canvasWidth": 265,
  //       "pieInnerRadius": "50%",
  //       "pieOuterRadius": "83%"
  //     },
  //     "data": {
  //       "sortOrder": "value-desc",
  //       "content": data
  //     },
  //     "labels": {
  //       "outer": {
  //         "pieDistance": 5
  //       },
  //       "inner": {
  //         "format": "value",
  //         "hideWhenLessThanPercentage": 2
  //       },
  //       "mainLabel": {
  //         "fontSize": 12
  //       },
  //       "percentage": {
  //         "color": "#ffffff",
  //         "decimalPlaces": 1
  //       },
  //       "value": {
  //         "color": "#333333",
  //         "fontSize": 12
  //       },
  //       "lines": {
  //         "enabled": true
  //       },
  //       "truncation": {
  //         "enabled": true
  //       }
  //     },
  //     "tooltips": {
  //       "enabled": true,
  //       "type": "placeholder",
  //       // "string": "{label}: {value},{percentage}%"
  //       "string": "{percentage}%"
  //     },
  //     "effects": {
  //       "pullOutSegmentOnClick": {
  //         "effect": "linear",
  //         "speed": 400,
  //         "size": 8
  //       }
  //     }/*,
  //       "misc": {
  //         "gradient": {
  //           "enabled": true,
  //           "percentage": 100
  //         }
  //       }*/
  //   });
  // }

  // testchartKPI(kpialldata: any): any {
  //   /* console.log('target',kpialldata[4].kpi_actuals);
  //   console.log('actual',kpialldata[4].kpi_actuals); */
  //   const seriesTASK = [{
  //     name: 'Target',
  //     data: [5, 3, 8, 4, 6, 3, 1, 4, 1, 6, 3, 1, 4, 1, 9, 5],
  //     color: 'blue'
  //   }, {
  //     name: 'Actual',
  //     data: [4, 1, 6, 3, 5, 4, 1, 5, 3, 6, 1, 1, 5, 3, 8, 4],
  //     color: '#4caf50'
  //   }];
  //   const categories = ['2015', '2016', '2017', '2018', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  //   this.prepareDataForBarChart("containerPROJECT", seriesTASK, categories);
  // }
  // prepareDataForBarChart(element: string, data: any, categories: any) {
  //   Highcharts.chart(element, {
  //     chart: {
  //       type: 'column',
  //       style: {
  //         fontFamily: 'Muli, Helvetica Neue, Arial, sans-serif'
  //       }
  //     },
  //     title: {
  //       text: ''
  //     },
  //     /*  subtitle: {
  //        text: 'KPI name'
  //      }, */
  //     legend: {
  //       align: 'right',
  //       verticalAlign: 'middle',
  //       layout: 'vertical'
  //     },
  //     xAxis: {
  //       categories: categories,
  //       labels: {
  //         x: 0,
  //         style: {
  //           fontSize: '12px',
  //         }
  //       }
  //     },
  //     yAxis: {
  //       allowDecimals: false,
  //       title: {
  //         text: ''
  //       }
  //     },
  //     plotOptions: {
  //       column: {
  //         pointPadding: 0.2,
  //         borderWidth: 0
  //       },
  //       series: {
  //         borderWidth: 0,
  //         dataLabels: {
  //           enabled: true,
  //           format: '{point.y:f}',
  //           style: {
  //             fontSize: '11px',
  //             fontWeight: '200',
  //           }
  //         }
  //       }
  //     },
  //     series: data,
  //     responsive: {
  //       rules: [{
  //         condition: {
  //           maxWidth: 530
  //         },
  //         chartOptions: {
  //           legend: {
  //             align: 'right',
  //             verticalAlign: 'top',
  //             layout: 'horizontal',
  //             enabled: true
  //           },
  //           yAxis: {
  //             labels: {
  //               align: 'left',
  //               x: 0,
  //               y: 0
  //             },
  //             title: {
  //               text: null
  //             }
  //           },
  //           subtitle: {
  //             text: null
  //           },
  //           credits: {
  //             enabled: false
  //           }
  //         }
  //       }]
  //     }
  //   });
  // }
}
export interface PeriodicElement {
  sr_no: number;
  kpi_name: string;
  year_for: string;
  one_year: string;
  two_year: string;
  three_year: string;
  four_year: string;
  ytd_target_actual: string;
  current_year_month: string;
  diff_last_year_month: string;
  last_current_year: string;
  //tst:string;
  cagr: string;
}