import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import * as _ from 'underscore';
import { fuseAnimations } from '@fuse/animations';
import { map } from 'lodash';
declare let d3pie: any;

@Component({
  selector: 'app-leadkpiperformance',
  templateUrl: './leadkpiperformance.component.html',
  animations: fuseAnimations,
  styleUrls: ['./leadkpiperformance.component.scss']
})

export class LeadkpiperformanceComponent implements OnInit {
  currentUser: any;
  login_access_token: string;
  company_id: number;
  unit_id: any;
  // userDepartment: any;
  // dataDepartment: any;
  kpiAllData: any;
  userSelectedYear: any;
  userSelectedYearFull: any;
  userSelectedYearHalf: any;
  currentYearPlusOne: any;
  userModulePermission: any;
  deptAccorPermission: any;
  kpiDataPermission: any;
  kpiTargetsPermission: any;
  kpiActualsPermission: any;
  unit_name: any;
  borderKpiId: any;
  bordered: boolean;
  currentdate: any;
  companyFinancialYear: any;
  companyFinancialreminderDate: any;
  allDetailsCompany: any;
  currentYearSubscription: Subscription;
  displayedColumns = ['kpi_name', 'unit_of_measurement', 'ideal_trend', 'year_for', 'one_year', 'two_year', 'three_year', 'four_year'];
  dataSource: any;
  renderKPIData: Array<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  // Private
  private _unsubscribeAll: Subject<any>;
  testreviewmonth: any;

  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private dataYearService: DataYearService,
  ) { this._unsubscribeAll = new Subject(); }

  //selectedYearFilter = new FormControl();
  filteredValues = {
    kpi_name: '', unit_of_measurement: '', ideal_trend: '', dept_name: '', year_for: '', one_year: '', two_year: '', three_year: '', four_year: ''
  };

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.unit_name = localStorage.getItem('currentUnitName');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.companyFinancialreminderDate = this.allDetailsCompany.general_data[0].reminder_date;

    //set header by financial year and month
    this.displayedColumns.push('ytd_target_actual');
    this.displayedColumns.push('year_end');
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.viewKpi();
    });
    // this.getDepartment();
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.deptAccorPermission = this.currentUser.dept_id;
    for (let i = 0; i < this.userModulePermission.length; i++) {
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

  // getDepartment() {
  //   let unit_id = this.unit_id;
  //   let dept_id = this.currentUser.dept_id;
  // let role_id = this.currentUser.role_id;
  //   this.userService.getDepartmentUnit(this.login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
  //     data => {
  //       this.userDepartment = data;
  //       this.dataDepartment = this.userDepartment.data;
  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }

  viewKpi() {
    if (this.companyFinancialreminderDate < this.currentdate) {
      this.bordered = true;
    }
    else {
      this.bordered = false;
    }

    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;

    this.userService.leadKpiDataView(this.login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.kpiAllData = data.data;
        this.processData(this.kpiAllData);
      },
      error => {
        this.alertService.error(error);
      });
  }

  processData(departments: any): any {
    this.renderKPIData = [...departments];

    this.renderKPIData.map((fun: any) => {
      const kpisData = [...fun.add_kpis_data];
     
      let KPIDATA: PeriodicElement[] = [];
      kpisData.map((kpiData: any) => {
        let kpiTargets = [];
        let kpiActuals = [];
        const targets: any = {
          "kpi_name": kpiData.kpi_name,
          "unit_of_measurement": kpiData.unit_of_measurement,
          "ideal_trend": kpiData.ideal_trend,
          "year_for": "Target",
          "one_year": 0,
          "two_year": 0,
          "three_year": 0,
          "four_year": 0,
          "kpi_id": kpiData.kpi_id,
          "ytd_target_actual": '',
        };
        const actuals: any = {
          "year_for": "Actual",
          "one_year": 0,
          "two_year": 0,
          "three_year": 0,
          "four_year": 0,
          "kpi_id": kpiData.kpi_id,
          "ytd_target_actual": '',
        };
        if (kpiData.hasOwnProperty('kpi_targets') && kpiData.hasOwnProperty('kpi_name')) {
          kpiTargets = [...kpiData.kpi_targets];
          kpiTargets.map((kpiTarget) => {
            if (kpiTarget.target_year == this.userSelectedYearFull) {
              targets['kpi_name'] = kpiData.kpi_name;
              targets['unit_of_measurement'] = kpiData.unit_of_measurement;
              targets['ideal_trend'] = kpiData.ideal_trend;
              targets['has_kpi_target'] = kpiTarget.has_kpi_target;
              targets['year_end'] = kpiTarget.year_end;
              // if (kpiTarget.ytd == 0.0) {
              //   targets['ytd_target_actual'] = '0';
              // }
              // else {
              //   targets['ytd_target_actual'] = Math.round(kpiTarget.ytd);
              // }
                targets['ytd_target_actual'] = kpiTarget.ytd;

              targets['kpi_id'] = kpiData.kpi_id;
              targets['user_id'] = kpiData.user_id;
              targets['target_id'] = kpiTarget.target_id;
              targets['target_year'] = kpiTarget.target_year;
              targets['kpistatus'] = kpiData.kpistatus;
              // targets['target_condition'] = kpiTarget.target_condition;
              targets['has_kpi_target'] = kpiTarget.has_kpi_target;
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
          });
        }
        if (kpiData.hasOwnProperty('kpi_actuals') && kpiData.hasOwnProperty('kpi_name')) {
          kpiActuals = [...kpiData.kpi_actuals];
          kpiActuals.map((kpiActual) => {

            if (kpiActual.actual_year == this.userSelectedYearFull) {
              // store late review month
              if (kpiData.ideal_trend == "positive") {
                // (1.0>=) green #4caf50,  (1.0< or  0.9>=)  yellow #FFD933, (0<0.9) red #f40000, #f3f3f3 grey
                actuals['ytd_color'] = kpiData.kpistatus >= 1.0 ? '#4caf50' : (kpiData.kpistatus < 1.0 && kpiData.kpistatus >= 0.9) ? '#FFD933' : (kpiData.kpistatus < 0.9 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#f40000' : '#f3f3f3';
              }
              else {
                // (1.1>=) red,  (1.1< or  1.0>)  yellow , (0<=1.0) green
                actuals['ytd_color'] = kpiData.kpistatus >= 1.1 ? '#f40000' : (kpiData.kpistatus < 1.1 && kpiData.kpistatus > 1.0) ? '#FFD933' : (kpiData.kpistatus <= 1.0 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#4caf50' : '#f3f3f3';
              }

              if(kpiActual.jan ==null && kpiActual.feb ==null && kpiActual.mar ==null && kpiActual.apr ==null && kpiActual.may ==null && kpiActual.jun ==null&& kpiActual.jul ==null&& kpiActual.aug ==null&& kpiActual.sep ==null&& kpiActual.oct ==null&& kpiActual.nov ==null&& kpiActual.dec ==null ) {
                kpiActual.ytd = null;
              }
              // if (kpiActual.ytd == 0.0) {
              //   actuals['ytd_target_actual'] = '0';
              // }
              // else {
              //   actuals['ytd_target_actual'] = Math.round(kpiActual.ytd);
              // }
                actuals['ytd_target_actual'] = kpiActual.ytd;

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
          });
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

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.currentYearSubscription.unsubscribe();
  }
}
export interface PeriodicElement {
  //sr_no: number;
  kpi_name: string;
  unit_of_measurement: string;
  ideal_trend: string;
  year_for: string;
  one_year: string;
  two_year: string;
  three_year: string;
  four_year: string;
  kpi_id: any;
  has_kpi_actual: string;
  has_kpi_target: string;
  ytd_target_actual: string;
  year_end: any;
}

