import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
//import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
//import { FuseUtils } from '@fuse/utils';
//import { takeUntil } from 'rxjs/internal/operators';
import { FormControl, FormBuilder} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { addActualDialod } from './addactual.component';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import * as _ from 'lodash';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { Router } from '@angular/router';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';
// import { forEach } from 'lodash';
// import { clearRedoStack } from 'gantt';
@Component({
  selector: 'addkpidata',
  templateUrl: './addkpidata.component.html',
  styleUrls: ['./addkpidata.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class AddkpidataComponent implements OnInit, OnDestroy {
  currentUser: any;
  login_access_token: string;
  company_id: number;
  unit_id: any;
  dataSections: any;
  userDepartment: any;
  dataDepartment: any;
  kpiAllData: any;
  compareKpiList: any;
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
  targetAndActualDisabled: any;
  companyFinancialYear: any;
  companyFinancialreminderDate: any;
  allDetailsCompany: any;
  currentYearSubscription: Subscription;
  testreviewstatus2: any;
  testreviewkpi_id: any;
  KpiYearMonth = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  /*  displayedColumns = ['kpi_name', 'kpi_definition', 'unit_of_measurement', 'ideal_trend', 'section_name', 'year_for', 'one_year', 'two_year', 'three_year', 'four_year', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd_target_actual', 'action']; */
  displayedColumns = ['kpi_name', 'kpi_definition', 'unit_of_measurement', 'ideal_trend', 'section_name', 'year_for', 'one_year', 'two_year', 'three_year', 'four_year'];
  dataSource: any;
  selectedDept: any = null;
  leadkpi = "false";
  renderKPIData: Array<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  // Private
  private _unsubscribeAll: Subject<any>;
  testreviewmonth: any;
  late_actual_month: any = [];

  /**
   * Constructor
   *
   *
   */
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  dept_nameFilter = new FormControl();
  section_nameFilter = new FormControl();
  lead_kpiFilter = new FormControl();
  //selectedYearFilter = new FormControl();
  filteredValues = {
    kpi_name: '', kpi_definition: '', unit_of_measurement: '', ideal_trend: '', section_name: '', dept_name: '', year_for: '', one_year: '', two_year: '', three_year: '',
    four_year: '', apr: '', may: '', jun: '', jul: '', aug: '',
    sep: '', oct: '', nov: '', dec: '', jan: '', feb: '', mar: '', action: '', topFilter: false
  };
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.unit_name = localStorage.getItem('currentUnitName');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.companyFinancialreminderDate = this.allDetailsCompany.general_data[0].reminder_date;

    //set header by financial year and month
    if (this.companyFinancialYear == "april-march") {
      this.displayedColumns.push('apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'ytd_target_actual','year_end', 'action');
    }
    else {
      this.displayedColumns.push('jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'ytd_target_actual','year_end', 'action');
    }
    this.section_nameFilter.valueChanges.subscribe((section_nameFilterValue) => {
      this.filteredValues['section_name'] = section_nameFilterValue;
      this.filteredValues['topFilter'] = false;
      if (this.selectedDept) {

        for (var i = 0; i < this.renderKPIData.length; i++) {
          if (this.renderKPIData[i].id == this.selectedDept) {
            this.renderKPIData[i]['datasource'].filterPredicate = this.customFilterPredicate();
            // console.log('jjjj', this.filteredValues);

            this.renderKPIData[i]['datasource'].filter = JSON.stringify(this.filteredValues);
          }
        }
      }
    });

    //let nowCurrentYear = new Date();
    //this.currentYear = moment(nowCurrentYear, 'YYYY-MM-DD').format('YY');
    //this.currentYearPlusOne = Number(this.currentYear) + 1;
    //this.currentYearFull = moment(nowCurrentYear, 'YYYY-MM-DD').format('YYYY');
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.userSelectedYearFull = this.userSelectedYear;
      this.userSelectedYearHalf = this.userSelectedYear.toString().substr(2, 2);
      this.currentYearPlusOne = Number(this.userSelectedYearHalf) + 1;
      this.ViewKpiData();
      this.viewKpi();
      this.targetAndActualButton();
    });
    this.getDepartment();
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
  targetAndActualButton() {
    //   let currentYear = new Date().getFullYear();
    //   let currentMonth = new Date().getMonth() + 1;
    //   let currentDate = new Date().getDate();
    //   if (this.companyFinancialYear == 'april-march') {
    //     let currentFullDate = new Date(this.userSelectedYear, currentMonth, currentDate); //Year, Month, Date
    //     let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
    //     let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
    //     if (currentFullDate >= dateOne && currentFullDate <= dateTwo) {
    //       this.targetAndActualDisabled = false;
    //     } else {
    //       this.targetAndActualDisabled = true;
    //     }
    //   } else {
    //     if (this.userSelectedYear == currentYear) {
    //       this.targetAndActualDisabled = false;
    //     } else {
    //       this.targetAndActualDisabled = true;
    //     }
    //   }
    // }
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
    if (eleYear === 'Actual' && eleMonth !== null) {
      if (eleLabel == '#f40000' || eleLabel == '#4caf50') {
        return {
          'background-color': eleLabel,
          'color': '#fff',
          'font-weight': '700',
          // 'font-size': '12px'
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
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.section_nameFilter.reset('');
    const dept = '';
    this.sectionGet(dept);
    this.lead_kpiGet("false");
    this.lead_kpiFilter.reset('');

    //this.selectedYearFilter.reset('');
    //this.filterRenderedDataByYear(this.currentYearFull);
  }
  lead_kpiGet(event: any) {
    this.leadkpi = event;
    console.log('event',event);
    this.dept_nameFilter.reset('');
    this.section_nameFilter.reset('');
    this.viewKpi();
  }
  compareKpiFun(event: any) {
    if (event.length == 2) {
      let id = event[0];
      let kpiid = event[1];
      let comparekpi = 1;
      this.router.navigate(['/apps/kpitrackers/kpigraph/' + id + '/' + kpiid + '/' + comparekpi]);
    }
  }
  /*applyFilter(filterValue: string) {
      let filter = {
        section_name: filterValue.trim().toLowerCase(),
        topFilter: true
      }
      if (this.selectedDept) {
        this.renderKPIData.forEach((fun) => {
          if (fun.id == this.selectedDept) {
             fun['datasource'].filter = JSON.stringify(filter);
          }
        })
      }
  }*/
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let statusFound = data.section_name.toString().trim().toLowerCase().indexOf(searchString.section_name.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return statusFound;
      }
      else {
        return statusFound;
      }
    }
    return myFilterPredicate;
  }
  kpiDefinitionOpen(element): void {
    const dialogRef = this.dialog.open(KpiDefinition, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getDepartment() {
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(this.login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      data => {
        this.userDepartment = data;
        this.dataDepartment = this.userDepartment.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  sectionGet(event: any) {
    let dept_id = event;
    this.selectedDept = dept_id;
    if (dept_id) {
      this.userService.getSection(this.login_access_token, dept_id, this.company_id).pipe(first()).subscribe(
        (data: any) => {
          this.dataSections = data.data.sections;
          this.filterRenderedData(dept_id);
        },
        error => {
          this.alertService.error(error);
        });
    }
    else {
      this.processData(this.kpiAllData);
    }
  }
  ViewKpiData() {
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYearByHeader = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.KpiDataView(this.login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.compareKpiList = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
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
    if (this.leadkpi == "false") {
      this.userService.kpiView(this.login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
        (data: any) => {
          this.kpiAllData = data.data;
          this.kpiAllData.forEach(add_kpis_row => {
            add_kpis_row.add_kpis_data.forEach(add_kpis_data_row => {
              // let actualytd = add_kpis_data_row.kpi_actuals[0].ytd;
              // let targettd = add_kpis_data_row.kpi_actuals[0].ytd;
              // late_actual_month = add_kpis_data_row.kpi_actuals[0].late_review;
              this.late_actual_month = add_kpis_data_row.kpi_actuals[0].late_review;
              // for (let index = 0; index < array.length; index++) {
              //   const element = array[index];
              //   forEach
              // }
            });
          });
          // this.selectedYear = new Date().getFullYear();
          this.processData(this.kpiAllData);
        },
        error => {
          this.alertService.error(error);
        });
    }
    else{
      this.userService.leadKpiDataView(this.login_access_token, unit_id, role_id, dept_id, selectedYearByHeader, financialYear).pipe(first()).subscribe(
        (data: any) => {
          this.kpiAllData = data.data;
          this.kpiAllData.forEach(add_kpis_row => {
            add_kpis_row.add_kpis_data.forEach(add_kpis_data_row => {
              this.late_actual_month = add_kpis_data_row.kpi_actuals[0].late_review;
            });
          });
          this.processData(this.kpiAllData);
        
        },
        error => {
          this.alertService.error(error);
        });
    }

  }
  filterRenderedData(deptId: number) {
    const departments = this.kpiAllData.filter((department) => {
      if (deptId) {
        return department.id === Number(deptId);
      }
      return true;
    });

    // this.kpidepartment = departments;
    this.processData(departments);
  }
  /* filterRenderedDataByYear(selectedYear: any) {
       this.selectedYear = selectedYear;
       if (this.selectedDept == "") {
         this.processData(this.kpiAllData);
       }
       else {
         this.filterRenderedData(this.selectedDept);
       }
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
          // "has_kpi_target": kpiData.has_kpi_target,
          "ytd_target_actual": '',
          "year-end": '',
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
          //"has_kpi_actual": kpiData.has_kpi_actual,
          //"has_kpi_target": kpiData.has_kpi_target,
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
              targets['has_kpi_target'] = kpiTarget.has_kpi_target;
              targets['year_end'] = kpiTarget.year_end;

              // console.log('kpiTarget',year_end);
              
              //let ytdTargetTotal = 0.00;
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
              let late_review_Data = [];
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
                if (kpiActual[month] == 0.0 || kpiActual[month] == null || kpiTargetRatio[month] == 0.0 || kpiTargetRatio[month] == null) {
                  monthRatio[month] = 0.0;
                }
                else {
                  monthRatio[month] = kpiActual[month] / kpiTargetRatio[month];
                }
              });

              if (kpiData.ideal_trend == "positive") {
                // (1.0>=) green #4caf50,  (1.0< or  0.9>=)  yellow #FFD933, (0<0.9) red #f40000, #f3f3f3 grey
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.0 ? '#4caf50' : (monthRatio[month] < 1.0 && monthRatio[month] >= 0.9) ? '#FFD933' : (monthRatio[month] < 0.9 && monthRatio[month] != null) ? '#f40000' : '';
                });
                actuals['ytd_color'] = kpiData.kpistatus >= 1.0 ? '#4caf50' : (kpiData.kpistatus < 1.0 && kpiData.kpistatus >= 0.9) ? '#FFD933' : (kpiData.kpistatus < 0.9 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#f40000' : '#f3f3f3';
              }
              else {
                // (1.1>=) red,  (1.1< or  1.0>)  yellow , (0<=1.0) green
                this.KpiYearMonth.forEach((month) => {
                  actuals[month + '_label'] = monthRatio[month] >= 1.1 ? '#f40000' : (monthRatio[month] < 1.1 && monthRatio[month] > 1.0) ? '#FFD933' : (monthRatio[month] <= 1.0 && monthRatio[month] != null) ? '#4caf50' : '';
                });
                actuals['ytd_color'] = kpiData.kpistatus >= 1.1 ? '#f40000' : (kpiData.kpistatus < 1.1 && kpiData.kpistatus > 1.0) ? '#FFD933' : (kpiData.kpistatus <= 1.0 && kpiData.kpistatus != null && kpiData.kpistatus > 0) ? '#4caf50' : '#f3f3f3';
              }

              // if (kpiActual.ytd == 0.0) {
              //   actuals['ytd_target_actual'] = '0';
              // }
              // else {
              //   actuals['ytd_target_actual'] = Math.round(kpiActual.ytd);
              // }
              if(kpiActual.jan ==null && kpiActual.feb ==null && kpiActual.mar ==null && kpiActual.apr ==null && kpiActual.may ==null && kpiActual.jun ==null&& kpiActual.jul ==null&& kpiActual.aug ==null&& kpiActual.sep ==null&& kpiActual.oct ==null&& kpiActual.nov ==null&& kpiActual.dec ==null ) {
                kpiActual.ytd = null;
              }
              actuals['ytd_target_actual'] = kpiActual.ytd;
              if (kpiActual.late_review) {
                //if (kpiActual.late_review.length > 0) {
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
  addActualOpen(action, kpiId, year) {

    let late_actual_month;
    let kpiATDATA;
    let kpi_id = kpiId;

    this.userService.getkpiTargetActual(this.login_access_token, this.company_id, kpi_id, year).pipe(first()).subscribe(
      (data: any) => {
        kpiATDATA = data.data;
        const dialogRef = this.dialog.open(addActualDialod, {
          data: { kpiATDATA, action }
        });
        this._fuseConfigService.config = {
          layout: {
            navbar: {
              hidden: true
            },
            sidepanel: {
              hidden: true
            }
          }
        };
        dialogRef.afterClosed().subscribe(result => {
          this._fuseConfigService.config = {
            layout: {
              navbar: {
                hidden: false
              },
            }
          };

          if (result == "YesSubmit") {
            this.viewKpi();
          }
        })
      },
      error => {
        this.alertService.error(error);
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
  kpitDataPDF() {
    this.loaderService.show();
    var data = document.getElementById('add-kpi-data');
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
      pdf.save('kpitData.pdf');
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  //sr_no: number;
  kpi_name: string;
  unit_of_measurement: string;
  ideal_trend: string;
  kpi_definition: string
  section_name: string
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
  ytd_target_actual: string;
  year_end: any;
  action: string;
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
  // reviewmonth: any;
}
