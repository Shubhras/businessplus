import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-add/addinitiative.component';
import { EditInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-data/editinitiative.component';
import { AddActionPlanDialog } from 'app/main/apps/strategic-obj/action-plan-add/addactionplan.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as moment from 'moment';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import { STATUSES } from '../../_constants';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { template } from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'initiativedata',
  templateUrl: './initiativedata.component.html',
  styleUrls: ['./initiativedata.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class InitiativeDataComponent implements OnInit {
  statusColorId: any;
  statusId: any;
  deptNameByParams: string;
  sub: any;
  showfilter: any;
  userDepartment: any;
  dataDepartment: any;
  getSelectData: any;
  getDataStatus: any;
  minDate = new Date();
  maxDate = new Date(2020, 0, 1);
  start_date: any;
  end_date: any;
  currentUser: any;
  userSelectedYear: any;
  unit_id;
  viewInitiativeAllData: any;
  actionStrategicData: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  initiatives_id: number;
  user_id: number;
  userModulePermission: any;
  deptAccorPermission: any;
  initiativesPermission: any;
  actionPlanPermission: any;
  userrole: any;
  straObjStatus: any;
  userDataComment: any;
  lesentGreen: any;
  lesentYellow: any;
  lesentRed: any;
  tempDate2: any;
  strDataDashboard: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  buttonDisabled: boolean;
  displayedColumnsColor: string[] = ['name_StrInitia', 'total', 'green', 'yellow', 'red', 'gray', 'blue'];
  dataSourceColor: any;
  displayedColumns: string[] = ['sr_no', 'definition', 'strategic_objectives_description', 'start_date', 'end_date', 'dept_name',
    'section_name', 'percentage', 'status_name', 'comment', 'action']
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
    private confirmationDialogService: ConfirmationDialogService,
    private bottomSheet: MatBottomSheet,
    public datepipe: DatePipe,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService
  ) {
    // this.addInitiativeOpen();
  }
  inputSearchFilter = new FormControl();
  dept_nameFilter = new FormControl();
  start_dateFilter = new FormControl();
  end_dateFilter = new FormControl();
  status_nameFilter = new FormControl();
  filteredValues = { sr_no: '', definition: '', strategic_objectives_description: '', start_date: '', end_date: '', dept_name: '', section_name: '', percentage: '', status_name: '', comment: '', action: '', topFilter: false };
  currentYearSubscription: Subscription;
  /**
  * On init
  */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.deptAccorPermission = this.currentUser.dept_id;
    this.showfilter = true;
    this.sub = this.route.params.subscribe(params => {
      if (params['statusColorId']) {
        this.statusId = params['statusColorId'];
      }
      if (params['deptName']) {
        this.deptNameByParams = params['deptName'];
      }
      // this.viewInitiative();
    });
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewInitiative();
      this.getDepartment();
      this.SelectModuleGet();
      this.strObjStatusGet();
      this.disableButton();
    });

    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Initiatives") {
        this.initiativesPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Action_plans") {
        this.actionPlanPermission = this.userModulePermission[i];
      }
    }
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.start_dateFilter.valueChanges.subscribe((start_dateFilterValue) => {
      if (start_dateFilterValue != undefined || start_dateFilterValue == '') {
        const d = start_dateFilterValue ? start_dateFilterValue : '';
        this.filteredValues['start_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.end_dateFilter.valueChanges.subscribe((end_dateFilterValue) => {
      if (end_dateFilterValue != undefined || end_dateFilterValue == '') {
        const d = end_dateFilterValue ? end_dateFilterValue : '';
        this.filteredValues['end_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: false,
          folded: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }

  disableButton() {
    //let selectedYear = this.userSelectedYear;

    let currentDate = new Date(); //2021, 2, 1
    // console.log(currentDate);

    let getCyear = this.userSelectedYear;


    let fromDate = new Date(getCyear, 3, 1);

    let toDate = new Date(getCyear + 1, 2, 31);



    // let selectYearDate = new Date(selectedYear + '/04/01');

    if (this.companyFinancialYear == 'april-march') {

      if (currentDate.getTime() >= fromDate.getTime() && currentDate.getTime() <= toDate.getTime()) {

        this.buttonDisabled = true;
      } else {

        this.buttonDisabled = false;
      }
    } else {
      if (this.userSelectedYear == currentDate.getFullYear()) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
    }
  }

  addInitiativeOpen(): void {
    const dialogRef = this.dialog.open(AddInitiativeDialog);
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        // toolbar: {
        //   hidden: false
        // },
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
          // toolbar: {
          //   hidden: true
          // },
        }
      };
      if (result == "YesSubmit") {
        this.viewInitiative();
      }
    });
  }
  editInitiativeOpen(element): void {
    console.log('edit init', element);
    
    const dialogRef = this.dialog.open(EditInitiativeDialog, {
      width: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewInitiative();
      }
    });
  }
  addActionPlanOpen(element): void {
    const dialogRef = this.dialog.open(AddActionPlanDialog, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        // this.viewActionPlan();
      }
    });
  }
  funShowFilter() {
    this.showfilter = !this.showfilter;
  }
  resetOptions() {
    this.inputSearchFilter.reset('');
    this.dept_nameFilter.reset('');
    this.start_dateFilter.reset('');
    this.end_dateFilter.reset('');
    this.status_nameFilter.reset('');
    let deptName = '';
    this.filterRenderedData(deptName);
  }
  applyFilter(filterValue: string) {
    let filter = {
      definition: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      strategic_objectives_description: filterValue.trim().toLowerCase(),
      start_date: filterValue.trim().toLowerCase(),
      end_date: filterValue.trim().toLowerCase(),
      status_name: filterValue.trim().toLowerCase(),
      section_name: filterValue.trim().toLowerCase(),
      percentage: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let definitionFound = data.definition.toString().trim().toLowerCase().indexOf(searchString.definition.toLowerCase()) !== -1
      let strObjectFound = data.strategic_objectives_description.toString().trim().toLowerCase().indexOf(searchString.strategic_objectives_description.toLowerCase()) !== -1
      let departmentFound = data.dept_name.trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let startDateFound = searchString.start_date ? moment(data.start_date).diff(moment(searchString.start_date), 'days') >= 0 : true;
      let endDateFound = searchString.end_date ? moment(data.end_date).diff(moment(searchString.end_date), 'days') <= 0 : true;
      let section_nameFound = data.section_name.toString().trim().toLowerCase().indexOf(searchString.section_name.toLowerCase()) !== -1
      let percentageFound = data.percentage.toString().trim().toLowerCase().indexOf(searchString.percentage.toLowerCase()) !== -1
      let statusFound;
      if (_.isArray(searchString.status_name)) {
        // use code for status select filter
        statusFound = (_.isArray(searchString.status_name) && !_.isEmpty(searchString.status_name)) ? (searchString.status_name.indexOf(data.status_name.toString().trim()) !== -1) : true;
      } else {
        // use code for input search filter
        statusFound = data.status_name.toString().trim().toLowerCase().indexOf(searchString.status_name.toLowerCase()) !== -1
      }

      if (searchString.topFilter) {
        return definitionFound || strObjectFound || departmentFound || startDateFound || endDateFound || section_nameFound || percentageFound || statusFound
      } else {
        return definitionFound && strObjectFound && departmentFound && startDateFound && endDateFound && section_nameFound && percentageFound && statusFound
      }
    }
    return myFilterPredicate;
  }
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      data => {
        this.userDepartment = data;
        this.dataDepartment = this.userDepartment.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      data => {
        this.getSelectData = data;
        this.getDataStatus = this.getSelectData.data.status;
      },
      error => {
        this.alertService.error(error);
      });
  }
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
      (data: any) => {
        this.userrole = data;
        this.straObjStatus = this.userrole.data;
        this.lesentGreen = this.straObjStatus[2].accuracy_percentage;
        this.lesentYellow = this.straObjStatus[3].accuracy_percentage;
        this.lesentRed = this.straObjStatus[4].accuracy_percentage;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewInitiative() {
    this.viewStrategicDashboard();
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.currentUser.data.company_id;
    this.userService.initiativeView(login_access_token, unit_id, company_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.viewInitiativeAllData = data;
        /*this.viewInitiativeAllData.data.map((Initiative: any, index: number) => {
          Initiative.sr_no = index + 1;
        });*/
       
      //  let count = 0;
      //   this.viewInitiativeAllData.data.map((Initiative: any, index: number) => {
      //     count = count+1;
      //     Initiative.sr_no = count;
      //   });
        const ELEMENT_DATA: PeriodicElement[] = this.viewInitiativeAllData.data;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
        if (this.statusId) {
          this.status_nameFilter.setValue([STATUSES[this.statusId]]);
        }
        if (this.deptNameByParams) {
          this.dept_nameFilter.setValue(this.deptNameByParams);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteInitiative(initiatives_id, user_id) {
    let login_access_token = this.currentUser.login_access_token;
    this.initiatives_id = initiatives_id;
    this.user_id = user_id;
    const confirmResult = this.confirmationDialogService.confirm('initiative');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.initiativeDelete(login_access_token, initiatives_id, user_id).pipe(first()).subscribe(
          data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.viewInitiative();
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
    });
  }
  openUserComment(element): void {
    let login_access_token = this.currentUser.login_access_token;
    let initiatives_id = element.initiatives_id;
    this.userService.getUserCommentInitiatives(login_access_token, initiatives_id).pipe(first()).subscribe(
      data => {
        this.userDataComment = data;
        const bottomSheetRef = this.bottomSheet.open(UserCommentSheet, {
          data: this.userDataComment
        });
        bottomSheetRef.afterDismissed().subscribe(() => {
        });
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
        this.strDataDashboard = data;
        this.processData(this.strDataDashboard.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  // filter only color table
  filterRenderedData(deptName: any) {
    let department;
    if (deptName) {
      department = this.strDataDashboard.data_acording_to_dept.filter((department) => {
        return department.dept_name.toString().trim() === deptName;
      });
      if (department[0] == null) {
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
    const ELEMENT_DATA_COLOR: PeriodicElementColor[] = [];
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
    ELEMENT_DATA_COLOR.push(objectivesTotal);
    ELEMENT_DATA_COLOR.push(initiativesTotal);
    ELEMENT_DATA_COLOR.push(actionPlanTotal);
    this.dataSourceColor = new MatTableDataSource<PeriodicElementColor>(ELEMENT_DATA_COLOR);
  }
  initiativeTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  initiativeDownloadPDF() {
    this.loaderService.show();
    var data = document.getElementById('initiativedata');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('initiative.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElementColor {
  name_StrInitia: string;
  total: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
}
export interface PeriodicElement {
  sr_no: number;
  definition: string;
  strategic_objectives_description: string;
  dept_name: string;
  section_name: string;
  start_date: string;
  end_date: string;
  percentage: number;
  status_name: string;
  comment: string;
  action: string;
}
@Component({
  selector: 'user-comment-sheet',
  templateUrl: 'user-comment-sheet.html',
})
export class UserCommentSheet implements OnInit {
  currentUser: any;
  CommentDataGet: any;
  displayedColumnsComment: string[] = ['sr_no', 'created_at', 'name', 'comment'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<UserCommentSheet>,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
  ) {

  }
  ngOnInit(): void {
    this.CommentDataGet = this.data;
    console.log('data', this.data);
    
    this.CommentDataGet.data.map((ActionComment: any, index: number) => {
      ActionComment.sr_no = index + 1;
    });
    const ELEMENT_DATA_COMMENT: PeriodicElementComment[] = this.CommentDataGet.data;
    this.dataSource = new MatTableDataSource<PeriodicElementComment>(ELEMENT_DATA_COMMENT);
  }
}
export interface PeriodicElementComment {
  sr_no: number;
  created_at: string;
  //description: string;
  comment: string;
  name: string;
}