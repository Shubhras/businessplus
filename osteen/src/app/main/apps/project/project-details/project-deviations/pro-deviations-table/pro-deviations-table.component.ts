import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { AddDeviationsComponent } from '../add-deviations/add-deviations.component';
import { EditDeviationsComponent } from '../edit-deviations/edit-deviations.component';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'pro-deviations-table',
  templateUrl: './pro-deviations-table.html',
  styleUrls: ['./pro-deviations-table.scss'],
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
export class ProDeviationsTableComponent implements OnInit {
  deviation_start_date: any;
  deviation_end_date: any;
  sub: any;
  project_id: any;
  message: any;
  tasks_id: number;
  task_name: string;
  data: any;
  user_id: number;
  deviationData: any;
  currentUser: any;
  completion: any;
  currentUnitId: any;
  unit_id: any;
  displayedColumns: string[] = ['sr_no', 'deviation_name', 'deviation_region', 'deviation_start_date', 'deviation_end_date', 'deviation_risk_name', 'deviation_qty', 'dept_name', 'deviation_aprove_usr_name', 'file_name', 'action'];

  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  dataDepartment: any;
  userListAllData: any;
  company_id: any;
  selectedSearchUser: any;

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
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
  ) { }
  start_dateFilter = new FormControl();
  end_dateFilter = new FormControl();
  dept_nameFilter = new FormControl();
  userListAllDataFilter = new FormControl();
  filteredValues = { sr_no: '', deviation_date: '', deviation_name: '', deviation_region: '', deviation_start_date: '', deviation_end_date: '', deviation_risk_name: '', deviation_qty: '', dept_name: '', deviation_aprove_usr_name: '', file_name: '', action: '', topFilter: false };

  /**
   * On init
   */
  ngOnInit(): void {
    this.completion = '0000-00-00';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.company_id = this.currentUser.data.company_id;
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
      this.getDepartment();
      this.userLisetGet();
    });
    this.start_dateFilter.valueChanges.subscribe((start_dateFilterValue) => {
      if (start_dateFilterValue != undefined || start_dateFilterValue == '') {
        const d = start_dateFilterValue ? start_dateFilterValue : '';
        this.filteredValues['deviation_start_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.end_dateFilter.valueChanges.subscribe((end_dateFilterValue) => {
      if (end_dateFilterValue != undefined || end_dateFilterValue == '') {
        const d = end_dateFilterValue ? end_dateFilterValue : '';
        this.filteredValues['deviation_end_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.userListAllDataFilter.valueChanges.subscribe((userListAllDataFilterValue) => {
      this.filteredValues['deviation_aprove_usr_name'] = userListAllDataFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
  }
  resetOptions() {
    this.start_dateFilter.reset('');
    this.end_dateFilter.reset('');
    this.dept_nameFilter.reset('');
    this.userListAllDataFilter.reset('');
  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
       this.selectedSearchUser = this.userListAllData;
      },
      error => {
        this.alertService.error(error);
      });
  }
  //selectedSearchUser = this.userListAllData;
  // Receive user input and send to search method**
/*   companyUserSearch(value) {
    this.selectedSearchUser = this.searchCompanyUser(value);
  }
  // Filter the user list and send back to populate the selectedSearchUser**
  searchCompanyUser(value: string) {
    let filter = value.toLowerCase();
    return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
  } */
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        /*  this.userListAllData = data.data.project_member_data */
        this.deviationData = data.data.projectDeviation;
        this.deviationData.map((deviation: any, index: number) => {
          deviation.sr_no = index + 1;
        });
        const ELEMENT_DATA_CREATED: PeriodicElement[] = this.deviationData
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CREATED);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
      },
      error => {
        this.alertService.error(error);
      });
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let startDateFound = searchString.deviation_start_date ? moment(data.deviation_start_date).diff(moment(searchString.deviation_start_date), 'days') >= 0 : true;
      let endDateFound = searchString.deviation_end_date ? moment(data.deviation_end_date).diff(moment(searchString.deviation_end_date), 'days') <= 0 : true;
      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1

      let userListAllDataFound = data.deviation_aprove_usr_name.toString().trim().toLowerCase().indexOf(searchString.deviation_aprove_usr_name.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return startDateFound || endDateFound || departmentFound || userListAllDataFound
      } else {
        return startDateFound && endDateFound && departmentFound && userListAllDataFound
      }
    }
    return myFilterPredicate;
  }
  addDeviations() {
    const dialogref = this.dialog.open(AddDeviationsComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  editDeviations(element: any) {
    const dialogref = this.dialog.open(EditDeviationsComponent, {
      width: 'auto',
      data: element
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  deleteDeviations(element: any) {
    let deviation_id = element.id;
    if (deviation_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectDeviation",
        "deviation_id": deviation_id,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      const confirmResult = this.confirmationDialogService.confirm('deviation');
      confirmResult.afterClosed().subscribe((result) => {
        if (result == true) {
          this.userService.proDeleteSingle(deleteProData).pipe(first()).subscribe(
            (data: any) => {
              if (data.status_code == 200) {
                this.alertService.success(data.message, true);
                this.singleViewProjects();
              }
              else {
                this.alertService.error(data.message, true);
              }
            },
            error => {
              this.alertService.error(error);
            });
        }
      });
    }
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
}
export interface PeriodicElement {
  sr_no: number;
  //deviation_date: string;
  deviation_name: string;
  deviation_region: string;
  deviation_risk_name: string;
  deviation_start_date: string;
  deviation_end_date: string;
  deviation_qty: string;
  dept_name: string;
  deviation_aprove_usr_name: string;
  file_name: string;
  action: string;
}
