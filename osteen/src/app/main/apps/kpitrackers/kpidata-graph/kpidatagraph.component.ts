import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as _ from 'lodash';
//import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import { ComboChartConfig } from './ComboChartConfig';
import { LineChartConfig } from './LineChartConfig';
import { targetActualDialod } from '../../common-dialog/kpi-actual/target-actual.component';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'kpidatagraph',
  templateUrl: './kpidatagraph.component.html',
  styleUrls: ['./kpidatagraph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class KpidatagraphComponent implements OnInit {
  dept_id: any;
  kpiid: any;
  comparekpi: any;
  sub: any;
  currentUser: any;
  unit_id: any;
  animal: string;
  name: string;
  user_id: number;
  kpiGraphData: any;
  // renderKPIData: Array<any>;
  compareKpiStore: Array<any> = [];
  kpisData: any;
  dept_name: string;
  public chartType: string = 'line';
  hasBackdrop: any;
  mode: any;
  elementID: string;
  IdealTrend: string;
  config1: LineChartConfig;
  // selectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  monthsFinancial = [];
  monthstemp = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  userSelectedYear: any;
  userSelectedYearFull: any;
  currentYearSubscription: Subscription;
  /**
   * Constructor
   *
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: RouterModule,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService,
    @Inject(DOCUMENT) document
  ) {
  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    if (this.companyFinancialYear == 'april-march') {
      this.monthsFinancial = ["apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "jan", "feb", "mar"];
    } else {
      this.monthsFinancial = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    }
    this.sub = this.route.params.subscribe(params => {
      if (params['kpiid']) {
        this.kpiid = [params['id'], params['kpiid']];
        this.comparekpi = params['comparekpi'];
      }
      else {
        this.dept_id = +params['id']; // (+) converts string 'id' to a number
      }
    });
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.viewKpiGraphData();
    });
    this.hasBackdrop = false;
    this.mode = 'Over';
    this.config1 = new LineChartConfig('', 0);
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
  viewKpiGraphData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    if (this.dept_id != undefined) {
      let role_id = this.currentUser.role_id;
      let dept_id = this.dept_id;
      this.userService.kpiGraphDataView(login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
        (data: any) => {
          this.kpiGraphData = data.data[0];
          // console.log('this.kpiGraphData', this.kpiGraphData);

          this.dept_name = this.kpiGraphData.dept_name;
          // this.selectedYear = new Date().getFullYear();
          this.processData(this.kpiGraphData);
        },
        error => {
          this.alertService.error(error);
        });
      return;
    }
    else {
      let kpi_id = this.kpiid;
      let role_id = this.currentUser.role_id;
      this.userService.kpiGraphDataViewByKpi(login_access_token, unit_id, role_id, kpi_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
        (data: any) => {
          this.kpiGraphData = data.data;
          // console.log(' else this.kpiGraphData', this.kpiGraphData);

          this.dept_name = '';
          //this.selectedYear = new Date().getFullYear();
          this.processData(this.kpiGraphData);
        },
        error => {
          this.alertService.error(error);
        });
    }
  }
  /*   targetActualByYear(selectedYear) {
      this.selectedYear = selectedYear;
      this.processData(this.kpiGraphData);
    } */
  processData(kpialldata: any): any {
    const kpi_data = [...kpialldata.add_kpis_data];
    const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const kpiActualsCompareData = {};
    kpi_data.map(kpi => {
      let elementID = 'curve_chart_' + kpi.kpi_id;
      const kpiData = [];
      if (this.comparekpi != 1) {
        const kpiChartData = {};
        kpi.kpi_targets.map(target => {
          // console.log('target', target);
          // console.log('this.monthsFinancial', this.monthsFinancial);

          if (parseInt(target.target_year) === this.userSelectedYearFull) {
            //for (let key in target) {
            for (let key of this.monthsFinancial) {
              // console.log('key11', key);

              if (months.indexOf(key) !== -1) {
                // kpiChartData[key] = [target[key] !== null ? parseFloat(target[key]) : 0.0, target[key] !== null ? parseFloat(target[key]) : 0.0];
              
                kpiChartData[key] = [target[key] !== null ? parseFloat(target[key]) : null, target[key] !== null ? parseFloat(target[key]) : null];
              }
              // console.log('kpiChartData122222', kpiChartData[key][1]);

            }
          }
          else {
            if (this.companyFinancialYear == 'april-march') {
              let yearPlusOne = Number(target.target_year.toString().substr(2, 2)) + 1;
              let YEAR = target.target_year + '-' + yearPlusOne;
              kpiChartData[YEAR] = [target['avg'] !== null ? parseFloat(target['avg']) : 0.0, target['avg'] !== null ? parseFloat(target['avg']) : 0.0];
            } else {
              kpiChartData[target.target_year] = [target['avg'] !== null ? parseFloat(target['avg']) : 0.0, target['avg'] !== null ? parseFloat(target['avg']) : 0.0];
            }
          }
        });
        kpi.kpi_actuals.map(actual => {
          // console.log('actual11', actual);
          // console.log('monthsFinancial11', this.monthsFinancial[0]);

          // if (this.monthsFinancial[0] == actual) {

          //   console.log('actual122', actual);
          // }
          if (parseInt(actual.actual_year) === this.userSelectedYearFull) {
            //for (let key in actual) {
            for (let key of this.monthsFinancial) {
              if (months.indexOf(key) !== -1) {
                // console.log('actualkey', key);
                // kpiChartData[key].push(actual[key] !== null ? parseFloat(actual[key]) : 0.0, actual[key] !== 0.0 ? parseFloat(actual[key]) : 0.0);
                kpiChartData[key].push(actual[key] !== null ? parseFloat(actual[key]) : null, actual[key] !== null ? parseFloat(actual[key]) : null);

              }
            }
          }
          else {
            if (this.companyFinancialYear == 'april-march') {
              let yearPlusOne = Number(actual.actual_year.toString().substr(2, 2)) + 1;
              let YEAR = actual.actual_year + '-' + yearPlusOne;
              kpiChartData[YEAR].push(actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0, actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0);
            } else {
              kpiChartData[actual.actual_year].push(actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0, actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0);
            }
          }
        });
        // console.log('kpiChartData11', kpiChartData);

        for (let key in kpiChartData) {
          kpiChartData[key].unshift(key);
          kpiData.push(kpiChartData[key]);
        }
      }
      else {
        kpi.kpi_actuals.map(actual => {
          if (parseInt(actual.actual_year) === this.userSelectedYearFull) {
            //for (let key in actual) {
            for (let key of this.monthsFinancial) {
              if (months.indexOf(key) !== -1) {
                if (typeof kpiActualsCompareData[key] === 'undefined') {
                  kpiActualsCompareData[key] = [];
                }
                kpiActualsCompareData[key].push(actual[key] !== null ? parseFloat(actual[key]) : 0.0, actual[key] !== null ? parseFloat(actual[key]) : 0.0);
              }
            }
          }
          else {
            let YEAR;
            if (this.companyFinancialYear == 'april-march') {
              let yearPlusOne = Number(actual.actual_year.toString().substr(2, 2)) + 1;
              YEAR = actual.actual_year + '-' + yearPlusOne;
            } else {
              YEAR = actual.actual_year;
            }
            if (typeof kpiActualsCompareData[YEAR] === 'undefined') {
              kpiActualsCompareData[YEAR] = [];
            }
            kpiActualsCompareData[YEAR].push(actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0, actual['avg'] !== null ? parseFloat(actual['avg']) : 0.0);
          }
        });
        this.compareKpiStore.push(kpi.kpi_name);
      }
      this.elementID = elementID;
      kpi['elementID'] = elementID;
      kpi['IdealTrend'] = kpi.ideal_trend;
      kpi['elementCompare'] = this.comparekpi;
      kpi['compareKpiStore'] = '';
      // console.log('kpiData1', kpiData);
      // kpiData.forEach(element => {
      //   if (this.monthsFinancial.includes(element[0])) {
      //     if (element[1] != 0 && element[2] != 0 && element[3] != 0 && element[4] != 0)
      //       console.log('elment', element);
      //   }

      // });

      kpi['chartData'] = kpiData;
    });
    if (this.comparekpi != 1) {
      // console.log('hello',kpi_data);
      
      this.kpisData = [...kpi_data];
    }
    else {
      const kpiData = [];
      this.kpisData = [];
      // console.log('kpiActualsCompareData', kpiActualsCompareData);
      for (let key in kpiActualsCompareData) {
        kpiActualsCompareData[key].unshift(key);
        kpiData.push(kpiActualsCompareData[key]);
      }


      const temp = {
        'elementCompare': this.comparekpi,
        'compareKpiStore': this.compareKpiStore,
        'elementID': this.elementID,
        'chartData': [...kpiData]
      }
      this.kpisData.push(temp);
    }
    // this.kpisData.forEach(kpirow => {
    //   kpirow.chartData.forEach(targetactual => {
    //     if(this.monthsFinancial.includes(targetactual[0])){
    //       console.log('targetactual',targetactual);
    //         if(targetactual[3] == null && targetactual[4] == null){
    //           targetactual[1] =null;
    //           targetactual[2] = null;
    //         }
    //     }
    //   });
    // });
    // console.log('targetactual',this.kpisData);

  }
  KpiGraphPDF() {
    this.loaderService.show();
    var data = document.getElementById('kpidata-graph');
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
      pdf.save('kpidata-graph.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}