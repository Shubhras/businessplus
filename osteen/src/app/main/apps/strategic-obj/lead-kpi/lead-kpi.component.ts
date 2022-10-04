import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
//import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import * as d3v4 from 'd3v4';
declare let d3: any;
declare let d3pie: any;
//import { legendColor } from 'd3-svg-legend';
//import { Chart } from 'angular-highcharts';
//import * as Highcharts from 'highcharts';
//import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { FormControl } from '@angular/forms';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'lead-kpi',
  templateUrl: './lead-kpi.component.html',
  styleUrls: ['./lead-kpi.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LeadKpiComponent implements OnInit {
  unit_name: any;
  currentUser: any;
  unit_id: any;
  dataDepartment: any;
  viewLeadKpiDashboard: any;
  viewLeadKpiData: any;
  messageError: any;
  renderKPIData: Array<any>;
  userSelectedYear: any;
  userSelectedYearFull: any;
  userSelectedYearHalf: any;
  currentYearPlusOne: any;
  selectedDept: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  currentYearSubscription: Subscription;
  KpiYearMonth = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  displayedColumns = ['kpi_name', 'kpi_definition', 'unit_of_measurement', 'ideal_trend', 'section_name', 'year_for', 'one_year', 'two_year', 'three_year',
    'four_year'];
  dataSource: any;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('pieChartLeadKPI') pieChartLeadKPI: ElementRef;
  late_actual_month: any;
  testreviewstatus2: any;
  testreviewkpi_id: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
  }
  dept_nameFilter = new FormControl();
  //selectedYearFilter = new FormControl();
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_name = localStorage.getItem('currentUnitName');
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    //set header by financial year and month
    if (this.companyFinancialYear == "april-march") {
      this.displayedColumns.push('apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'ytd_target_actual','year_end');
    }
    else {
      this.displayedColumns.push('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd_target_actual','year_end');
    }
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.viewLeadKpiDataChart();
      this.getLeadKpiData();
    });
    this.getDepartment();
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }

  getColor(year_for: any, color: any) {
    if (year_for == 'Actual') {
      if (color == '#f40000' || color == '#4caf50') {
        return {
          'background-color': color,
          'color': '#fff',
          'font-weight': '700',
          // 'font-size': '12px'
        };
      }
      else {
        return {
          'background-color': color,
          'font-weight': '700',
          //'font-size': '12px'
        };
      }
    }
    else {
      return { 'background-color': '' };
    }
  }

  resetOptions() {
    // this.getLeadKpiData();  //changes
    // this.viewLeadKpiDataChart(); //changes
    this.dept_nameFilter.reset('');
    //this.selectedYearFilter.reset('');
    this.selectedDept = "";
    this.getLeadKpiData();
    //this.filterRenderedDataByYear(this.currentYearFull);
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
  viewLeadKpiDataChart() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.viewLeadKpiDashboard = data;
        this.processLeadData(this.viewLeadKpiDashboard.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  getLeadKpiData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDataView(login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.viewLeadKpiData = data.data;
        this.viewLeadKpiData.forEach(add_kpis_row => {
          add_kpis_row.add_kpis_data.forEach(add_kpis_data_row => {
            // let actualytd = add_kpis_data_row.kpi_actuals[0].ytd;
            // let targettd = add_kpis_data_row.kpi_actuals[0].ytd;

            this.late_actual_month = add_kpis_data_row.kpi_actuals[0].late_review;
            // for (let index = 0; index < array.length; index++) {
            //   const element = array[index];
            //   forEach
            // }


          });
        });

        // this.selectedYear = new Date().getFullYear();



        this.processData(this.viewLeadKpiData);
      },
      error => {
        this.alertService.error(error);
      });
  }
  filterRenderedData(deptId: any) {
    this.selectedDept = deptId;
    const departments = this.viewLeadKpiData.filter((department) => {
      if (this.selectedDept) {
        return department.id === Number(this.selectedDept);
      }
      return true;
    });
    this.processData(departments);
    const leadKpiDept = this.viewLeadKpiDashboard.data.filter((leadKpiDept) => {
      if (this.selectedDept) {
        return leadKpiDept.dept_id === Number(this.selectedDept);
      }
      return true;
    });
    this.processLeadData(leadKpiDept);
  }
  /*   filterRenderedDataByYear(selectedYear: any) {
      this.selectedYear = selectedYear;
      this.filterRenderedData(this.selectedDept);
    } */
  processData(departments: any): any {
    this.renderKPIData = [...departments];
    //const currentYear = new Date().getFullYear();
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
              targets['year_end'] = kpiTarget.year_end;
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

              targets['ytd_target_actual'] = kpiTarget.ytd;
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
                // this.KpiYearMonth.forEach((month) => {
                //   actuals[month + '_label'] = monthRatio[month] >= 0.9 ? '#4caf50' : (monthRatio[month] < 0.9 && monthRatio[month] >= 0.7) ? '#FFD933' : (monthRatio[month] < 0.7 && monthRatio[month] != null) ? '#f40000' : '';
                // });



                // (1.0>=) green #4caf50,  (1.0< or  0.9>=)  yellow #FFD933, (0<0.9) red #f40000, #f3f3f3 grey
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.0 ? '#4caf50' : (monthRatio[month] < 1.0 && monthRatio[month] >= 0.9) ? '#FFD933' : (monthRatio[month] < 0.9 && monthRatio[month] != null) ? '#f40000' : '';
                });
                actuals['ytd_color'] = kpiData.kpistatus >= 1.0 ? '#4caf50' : (kpiData.kpistatus < 1.0 && kpiData.kpistatus >= 0.9) ? '#FFD933' : (kpiData.kpistatus < 0.9 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#f40000' : '#f3f3f3';


              }
              else {
                // (1.1>=) red,  (1.0<= or  1.1>)  yellow , (0<1.0) green
                // this.KpiYearMonth.forEach((month) => {
                //   actuals[month + '_label'] = monthRatio[month] >= 1.1 ? '#f40000' : (monthRatio[month] < 1.1 && monthRatio[month] >= 1.0) ? '#FFD933' : (monthRatio[month] < 1.0 && monthRatio[month] != null) ? '#4caf50' : '';
                // });


                // (1.1>=) red,  (1.1< or  1.0>)  yellow , (0<=1.0) green
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.1 ? '#f40000' : (monthRatio[month] < 1.1 && monthRatio[month] > 1.0) ? '#FFD933' : (monthRatio[month] <= 1.0 && monthRatio[month] != null) ? '#4caf50' : '';
                });
                actuals['ytd_color'] = kpiData.kpistatus >= 1.1 ? '#f40000' : (kpiData.kpistatus < 1.1 && kpiData.kpistatus > 1.0) ? '#FFD933' : (kpiData.kpistatus <= 1.0 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#4caf50' : '#f3f3f3';

              }

              if(kpiActual.jan ==null && kpiActual.feb ==null && kpiActual.mar ==null && kpiActual.apr ==null && kpiActual.may ==null && kpiActual.jun ==null&& kpiActual.jul ==null&& kpiActual.aug ==null&& kpiActual.sep ==null&& kpiActual.oct ==null&& kpiActual.nov ==null&& kpiActual.dec ==null ) {
                kpiActual.ytd = null;
              }
              
              actuals['ytd_target_actual'] = kpiActual.ytd;

              if (kpiActual.late_review) {
                for (let key in kpiActual.late_review) {
                  late_review_Data.push(kpiActual.late_review[key])

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
              // actuals['reviewmonth'] = this.testreviewmonth;
              console.log('sssssssssssssssssssssss', kpiData.kpistatus);
              actuals['kpistatus'] = kpiData.kpistatus;

              actuals['kpi_id'] = kpiData.kpi_id;
              actuals['user_id'] = kpiData.user_id;
              actuals['actual_id'] = kpiActual.actual_id;
              actuals['actual_year'] = kpiActual.actual_year;
              actuals['has_kpi_actual'] = kpiActual.has_kpi_actual;
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
      // console.log('table_dataaaaaa', fun['datasource']);
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
  kpiLeadPDF(id) {
    this.loaderService.show();
    let lead_kpi = id;
    var data = document.getElementById(lead_kpi);
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
      pdf.save('lead-kpi.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
  kpiLeadPDFAll() {
    this.loaderService.show();
    var data = document.getElementById('lead-kpi');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('lead-kpi.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  //sr_no: number;
  kpi_name: string;
  unit_of_measurement: string;
  ideal_trend: string;
  kpi_definition: string;
  section_name: string;
  year_for: string;
  one_year: string;
  two_year: string;
  three_year: string;
  four_year: string;
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
  kpi_id: any;
  has_kpi_actual: string;
  has_kpi_target: string;
  //action: string;
  ytd_target_actual: string;
  year_end: any;
  apr_label: string;
  may_label: string;
  jun_label: string;
  jul_label: string;
  aug_label: string;
  sep_label: string;
  oct_label: string;
  nov_label: string;
  dec_label: string;
  jan_label: string;
  feb_label: string;
  mar_label: string;
  reviewstatus: any;
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
];
