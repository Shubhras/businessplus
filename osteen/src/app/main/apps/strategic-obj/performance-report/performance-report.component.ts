import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'performance-report',
  templateUrl: './performance-report.component.html',
  styleUrls: ['./performance-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PerformReportComponent implements OnInit {
  currentUser: any;
  unit_id: any;
  alloted_dept: any;
  userSelectedYear: any;
  userSelectedYearFull: any;
  userSelectedYearHalf: any;
  currentYearPlusOne: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  currentYearSubscription: Subscription;
  displayedColumns: string[] = ['sr_no','kpi_name', 'year_for', 'four_year', 'three_year', 'two_year', 'ytd_target_actual', 'current_year_month', 'last_year_month', 'diff_last_year_month', 'cagr'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
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
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.alloted_dept = this.currentUser.dept_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.viewKpiGraphData();
    });
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewKpiGraphData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let dept_id = this.alloted_dept;
    this.userService.performanceKpiDashboard(login_access_token, unit_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.processData(data.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  processData(kpialldata: any): any {
    const kpi_data = [...kpialldata];
    //const currentYear = new Date().getFullYear();
    let KPIDATA: PeriodicElement[] = [];
    kpi_data.map((kpi:any, index: number) => {
      kpi.sr_no = index + 1;
      const targets: any = {
        "sr_no": kpi.sr_no,
        "kpi_name": kpi.kpi_name,
        "year_for": "Target",
        //"one_year": 0,
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
        // "one_year": 0,
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
          targets["current_year_month"] = target.current_month_target;
          targets["ytd_target_actual"] = target.ytd;
          let targetsVlaue = targets["ytd_target_actual"].split(".");
          if (targetsVlaue[1] > '00') {
            targets["ytd_target_actual"] = targetsVlaue[0] + '.' + targetsVlaue[1];
          }
          else {
            targets["ytd_target_actual"] = targetsVlaue[0];
          }
        }
        else {
          if (target.target_year == this.userSelectedYearFull - 1) {
            targets["four_year"] = target.avg;
            targets["last_year_month"] = target.current_month_target;
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
      });
      kpi.kpi_actuals.map(actual => {
        if (parseInt(actual.actual_year) === this.userSelectedYearFull) {
          actuals["current_year_month"] = actual.current_month_actual;
          actuals["ytd_target_actual"] = actual.ytd;
          let actualsVlaue = actuals["ytd_target_actual"].split(".");
          if (actualsVlaue[1] > '00') {
            actuals["ytd_target_actual"] = actualsVlaue[0] + '.' + actualsVlaue[1];
          }
          else {
            actuals["ytd_target_actual"] = actualsVlaue[0];
          }
        }
        else {
          if (actual.actual_year == this.userSelectedYearFull - 1) {
            actuals["four_year"] = actual.avg;
            actuals["last_year_month"] = actual.current_month_actual;
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
      KPIDATA.push(targets);
      KPIDATA.push(actuals);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(KPIDATA);
    this.dataSource.paginator = this.paginator;
  }
}
export interface PeriodicElement {
  sr_no:number;
  kpi_name: string;
  year_for: string;
  // one_year:  string;
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