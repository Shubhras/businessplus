import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, EventEmitter, HostListener, Output } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ProjectIssueTrackerPopup } from "app/main/apps/project/project-details/issue-tracker/project-issue-tracker-popup/project-issue-tracker-popup.component";
import { PIssueTrackerEditComponent } from 'app/main/apps/project/project-details/issue-tracker/p-issue-tracker-edit/p-issue-tracker-edit.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isThisISOWeek } from 'date-fns';
import { PIssueTrackerRemarkComponent } from "app/main/apps/project/project-details/issue-tracker/p-issue-tracker-remark/p-issue-tracker-remark.component";
import { ProjectDetailsComponent } from '../../../project-details/project-details.component';

@Component({
  selector: 'p-issue-tracker',
  templateUrl: './p-issue-tracker.html',
  styleUrls: ['./p-issue-tracker.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PIssueTrackerComponent implements OnInit {
  sub: any;
  project_id: any;
  message: any;
  tasks_id: number;
  task_name: string;
  data: any;
  user_id: number;
  ViewTasksData: any;
  currentUser: any;
  completion: any;
  taskDataStatus: any;
  currentUnitId: any;
  unit_id: any;
  dataDepartment: any;
  userListAllData: any;
  dataSource: any;
  issueRemarkId: any;
  taskDataPriorities: any;
  displayedColumns: string[] = ['issue_id', 'issue_start_date', 'issue_task_name', 'issue_task_priority', 'task_owaner_name', 'dept_name', 'issue_end_date', 'issue_revised_date', 'status_name', 'edit'];
  dataSourceCreated: any;
  @ViewChild(MatPaginator) paginatorCr: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild(MatPaginator) paginatorSelf: MatPaginator;
  @Output() RemarkClickEvent = new EventEmitter<number>();
  @Output() DashboardClickEvent = new EventEmitter<number>();
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

  priority_nameFilter = new FormControl();
  dept_nameFilter = new FormControl();
  task_owaner_nameFilter = new FormControl();
  status_nameFilter = new FormControl();

  filteredValues = { tasks_id: '', task_name: '', priority_name: '', dept_name: '', create_to_user_name: '', task_owaner_name: '', issue_task_owner_name: '', task_assigns_data: '', start_date: '', end_date: '', completion_date: '', status_name: '', action: '', topFilter: false };
  /**
   * On init
   */
  ngOnInit(): void {
    this.completion = '0000-00-00';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.SelectModuleGet();
    this.getDepartment();
    this.userLisetGet();
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
    });
    this.priority_nameFilter.valueChanges.subscribe((priority_nameFilterValue) => {
      this.filteredValues['priority_name'] = priority_nameFilterValue;
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.task_owaner_nameFilter.valueChanges.subscribe((task_owaner_nameFilterValue) => {
      this.filteredValues['task_owaner_name'] = task_owaner_nameFilterValue;
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
  }
  SendRemarkId(RemarkId) {
    this.RemarkClickEvent.emit(RemarkId)
  }
  sendDashboard(proId) {
    this.DashboardClickEvent.emit(proId)
  }
  openIssueialog() {
    const dialogref = this.dialog.open(ProjectIssueTrackerPopup, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  editProSingle(data) {
    const dialogref = this.dialog.open(PIssueTrackerEditComponent, {
      width: 'auto',
      data: data
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    let user_id = this.user_id
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.ViewTasksData = data.data.projectIssueTracker;
        this.ViewTasksData.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA_CREATED: PeriodicElement[] = this.ViewTasksData;
        this.dataSourceCreated = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CREATED);
        this.dataSourceCreated.paginator = this.paginatorSelf;
        this.dataSourceCreated.filterPredicate = this.customFilterPredicate();
      },
      error => {
        this.alertService.error(error);
      });
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.taskDataStatus = data.data.status;
        this.taskDataPriorities = data.data.priorities;
      },
      error => {
        this.alertService.error(error);
      });
  }
  applyFilter(filterValue: string) {

    let filter = {
      task_name: filterValue.trim().toLowerCase(),
      // event_name: filterValue.trim().toLowerCase(),
      //project_name: filterValue.trim().toLowerCase(),
      priority_name: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      // unit_name: filterValue.trim().toLowerCase(),
      task_owaner_name: filterValue.trim().toLowerCase(),
      task_assigns_data: filterValue.trim().toLowerCase(),
      create_to_user_name: filterValue.trim().toLowerCase(),
      status_name: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSourceCreated.filter = JSON.stringify(filter);
  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
        this.selectedSearchUser = this.userListAllData;
      },
      error => {
        this.alertService.error(error);
      });
  }
/*   companyUserSearch(value) {
    this.selectedSearchUser = this.searchCompanyUser(value);
  }
  // Filter the user list and send back to populate the selectedSearchUser**
  searchCompanyUser(value: string) {
    let filter = value.toLowerCase();
    return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
  } */
  resetOptions() {
    this.priority_nameFilter.reset('');
    this.dept_nameFilter.reset('');
    this.task_owaner_nameFilter.reset('');
    this.status_nameFilter.reset('');
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

  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      const filters = JSON.parse(filter);
      let priorityFound = data.priority_name.toString().trim().toLowerCase().indexOf(filters.priority_name.toString().trim().toLowerCase()) !== -1
      let departmentFound: boolean = false;
      if (data.dept_name != null) {
         departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(filters.dept_name.toLowerCase()) !== -1
      }
      else {
         departmentFound = true;
      }
      /*  let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(filters.dept_name.toLowerCase()) !== -1 */
      let task_owanerFound = data.issue_task_owner_name.toString().trim().toLowerCase().indexOf(filters.task_owaner_name.toLowerCase()) !== -1
      let statusFound = data.status_name.toString().trim().toLowerCase().indexOf(filters.status_name.toLowerCase()) !== -1
      let task_assignsFound: boolean = false;
      if (filters.task_assigns_data != '') {
        if (data.issue_task_name.toLowerCase() === filters.task_assigns_data.toLowerCase()) {
          task_assignsFound = true;
        }
      } else {
        task_assignsFound = true;
      }
      if (filters.topFilter) {
        return priorityFound || departmentFound || task_owanerFound || task_assignsFound || statusFound
      } else {
        return priorityFound && departmentFound && task_owanerFound && task_assignsFound && statusFound
      }
    }
    return myFilterPredicate;
  }
  statusGetColor(element) {
    switch (element) {
      case 'Closed':
        return {
          'background-color': '#4caf50',
          'color': '#fff',
        };
      case 'Open':
        return {
          'background-color': '#FFD933',
          'color': '#000000de',
        };
      case 'Delayed':
        return {
          'background-color': '#f44336',
          'color': '#fff',
        };
      case 'Closed with Delay':
        return {
          'background-color': '#a9b7b6',
          'color': '#fff',
        };
      case 'On Hold':
        return {
          'background-color': '#7dabf5',
          'color': '#fff',
        };
    }
  }
  deleteTracker(data) {
    let proproject_issue_id = data.id;
    if (proproject_issue_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectIssueTracker",
        issue_id: proproject_issue_id,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      const confirmResult = this.confirmationDialogService.confirm('Issue');
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

}
export interface PeriodicElement {
  sr_no: number;
  tasks_id: number;
  issue_task_name: string;
  issue_task_priority: string;
  dept_name: string;
  create_to_user_name: string;
  issue_task_owner_name: string;
  issue_task_co_ownwer_value: Array<any>;
  issue_start_date: string;
  issue_end_date: string;
  issue_remindr_freq: string;
  issue_revised_date: string;
  status_name: string;
  //action_update: string;
  edit: string;
  priority_name: string;
}
