import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddTaskOverviewDialog } from 'app/main/apps/dashboards/analytics/addtask.component';
import { EditTaskOverviewDialog } from 'app/main/apps/dashboards/analytics/edittask.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { STATUSES_TASK } from '../../_constants';
@Component({
  selector: 'analytics-dashboard',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit {
  statusColorId: any;
  statusId: any;
  deptNameByParams: string;
  sub: any;
  user_name: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  tasks_id: number;
  task_name: string;
  data: any;
  user_id: number;
  showfilter: any;
  taskDataPriorities: any;
  EventallName: any;
  userListAllData: any;
  taskDataStatus: any;
  ViewTasksData: any;
  totalTasksData: any;
  total_task: any;
  closed_task: any;
  open_task: any;
  delayed_task: any;
  closedWithDelay_task: any;
  on_hold: any;
  currentUser: any;
  completion: any;
  currentUnitId: any;
  unit_id: any;
  userModulePermission: any;
  taskPermission: any;
  //event_name: any;
  dataDepartment: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  currentYearSubscription: Subscription;
  displayedColumns: string[] = ['tasks_id', 'task_name', 'priority_name', 'event_name', 'dept_name', 'task_owaner_name', 'task_assigns_data', 'start_date', 'end_date', 'completion_date', 'status_name', 'action'];
  dataSourceAssignedSelf: any;
  dataSourceAssignedOther: any;
  dataSourceCreated: any;
  @ViewChild(MatPaginator) paginatorSelf: MatPaginator;
  @ViewChild(MatPaginator) paginatorOther: MatPaginator;
  @ViewChild(MatPaginator) paginatorCr: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
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
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService,
  ) { }

  inputSearchFilter = new FormControl();
  priority_nameFilter = new FormControl();
  dept_nameFilter = new FormControl();
  status_nameFilter = new FormControl();
  task_owaner_nameFilter = new FormControl();
  // task_createFilter = new FormControl();
  filteredValues = { tasks_id: '', task_name: '', priority_name: '', dept_name: '', create_to_user_name: '', task_owaner_name: '', task_assigns_data: '', start_date: '', end_date: '', completion_date: '', status_name: '', action: '', topFilter: false };
  /**
   * On init
   */
  ngOnInit(): void {
    this.completion = '0000-00-00';
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.user_name = this.currentUser.data.name;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.showfilter = true;
    this.SelectModuleGet();
    this.userLisetGet();
    this.getDepartment();
    this.getEventname();
    this.sub = this.route.params.subscribe(params => {
      if (params['start']) {
        this.AddPopupOpen();
      }
      if (params['statusColorId']) {
        this.statusId = params['statusColorId'];
      }
      if (params['deptName']) {
        this.deptNameByParams = params['deptName'];
      }
      this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
        this.userSelectedYear = messageYear;
        this.totalTaskDataGet();
        this.ViewTasks();
      });
    });
    this.priority_nameFilter.valueChanges.subscribe((priority_nameFilterValue) => {
      this.filteredValues['priority_name'] = priority_nameFilterValue;
      this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
      this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
      this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
      this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.task_owaner_nameFilter.valueChanges.subscribe((task_owaner_nameFilterValue) => {
      this.filteredValues['task_owaner_name'] = task_owaner_nameFilterValue;
      this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
      this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
      this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    /*    this.task_createFilter.valueChanges.subscribe((task_createFilterValue) => {
         if (task_createFilterValue == 'assignedTo') {
           this.filteredValues['task_assigns_data'] = this.user_name;
           this.filteredValues['create_to_user_name'] = '';
           this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
           this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
           this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
           this.filteredValues['topFilter'] = false;
         }
         else if (task_createFilterValue == 'createdBy') {
           this.filteredValues['create_to_user_name'] = this.user_name;
           this.filteredValues['task_assigns_data'] = '';
           this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
           this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
           this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
           this.filteredValues['topFilter'] = false;
           // console.log('in created by');
         } else { // for all
           this.filteredValues['task_assigns_data'] = '';
           this.filteredValues['create_to_user_name'] = '';
           this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
           this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
           this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
           this.filteredValues['topFilter'] = false;
         }
       }); */
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Tasks") {
        this.taskPermission = this.userModulePermission[i];
      }
    }
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  resetOptions() {
    this.inputSearchFilter.reset('');
    this.priority_nameFilter.reset('');
    this.dept_nameFilter.reset('');
    this.task_owaner_nameFilter.reset('');
    this.status_nameFilter.reset('');
    //this.task_createFilter.reset('');
  }
  applyFilter(filterValue: string) {
    let filter = {
      task_name: filterValue.trim().toLowerCase(),
      priority_name: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      task_owaner_name: filterValue.trim().toLowerCase(),
      task_assigns_data: filterValue.trim().toLowerCase(),
      /*create_to_user_name: filterValue.trim().toLowerCase(),*/
      status_name: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSourceAssignedSelf.filter = JSON.stringify(filter);
    this.dataSourceAssignedOther.filter = JSON.stringify(filter);
    this.dataSourceCreated.filter = JSON.stringify(filter);
  }
  taskFilterByColor(status) {
    this.filteredValues['status_name'] = status;
    this.dataSourceAssignedSelf.filter = JSON.stringify(this.filteredValues);
    this.dataSourceAssignedOther.filter = JSON.stringify(this.filteredValues);
    this.dataSourceCreated.filter = JSON.stringify(this.filteredValues);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let task_nameFound = data.task_name.toString().trim().toLowerCase().indexOf(searchString.task_name.toLowerCase()) !== -1
      let priorityFound = data.priority_name.toString().trim().toLowerCase().indexOf(searchString.priority_name.toLowerCase()) !== -1
      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1

      let statusFound = data.status_name.toString().trim().toLowerCase().indexOf(searchString.status_name.toLowerCase()) !== -1
      let task_owanerFound = data.task_owaner_name.toString().trim().toLowerCase().indexOf(searchString.task_owaner_name.toLowerCase()) !== -1
      let task_assignsFound: boolean = false;
      if (searchString.task_assigns_data != '') {
        data.task_assigns_data.map((assignName: any) => {
          if (assignName.name.toLowerCase() === searchString.task_assigns_data.toLowerCase()) {
            task_assignsFound = true;
          }
        });
      } else {
        task_assignsFound = true;
      }
      /*  let task_createFound = data.create_to_user_name.toString().trim().toLowerCase().indexOf(searchString.create_to_user_name.toLowerCase()) !== -1 */
      if (searchString.topFilter) {
        return task_nameFound || priorityFound || departmentFound || task_owanerFound || task_assignsFound || statusFound
      } else {
        return task_nameFound && priorityFound && departmentFound && task_owanerFound && task_assignsFound && statusFound
      }
    }
    return myFilterPredicate;
  }
  statusGetColor(element) {
    switch (element) {
      case 'Closed':
        return '#4caf50';
      case 'Open':
        return '#d68e0a';
      case 'Delayed':
        return '#f44336';
      case 'Closed with Delay':
        return '#a9b7b6';
      case 'On Hold':
        return '#7dabf5';
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
  getEventname() {
    let login_access_token = this.currentUser.login_access_token;

    let company_id = this.currentUser.data.company_id;
    this.userService.viewTaskEventChange(login_access_token, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.EventallName = data.data;
        console.log("dattaa", this.EventallName);



      },
      error => {
        this.alertService.error(error);
      });

  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
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
  AddPopupOpen(): void {
    const dialogRef = this.dialog.open(AddTaskOverviewDialog, {
      panelClass: 'addtask-dial'
    });
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
        },
        footer:{
          hidden: false
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
        this.ViewTasks();
        this.totalTaskDataGet();
      }
    });
  }
  EditPopupOpen(element): void {
    const dialogRef = this.dialog.open(EditTaskOverviewDialog, {
      width: 'auto',
      data: element
    });
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
        this.ViewTasks();
        this.totalTaskDataGet();
      }
    });
  }
  TaskShowFilter() {
    this.showfilter = !this.showfilter;
  }
  ViewTasks() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let user_id = this.user_id
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    // let event_name = this.event_name;
    //console.log(event_name);

    let financialYear = this.companyFinancialYear;
    this.userService.TasksView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.ViewTasksData = data.data;
        //console.log("dattatat", this.ViewTasksData);

        // filter Assigned task create self
        // let user_name = this.currentUser.data.name;
        const assignedBySelf = this.ViewTasksData.filter((task) => {
          const assignSelf: Array<number> = JSON.parse(task.assign_to);
          return (assignSelf.indexOf(user_id) !== -1 && user_id == task.create_to_user_id);
        });
        // filter Assigned task create other
        const assignedByOther = this.ViewTasksData.filter((task) => {
          const assignOther: Array<number> = JSON.parse(task.assign_to);
          return (assignOther.indexOf(user_id) !== -1 && user_id != task.create_to_user_id);
        });
        // filter created task
        const createdTasks = this.ViewTasksData.filter((task) => {
          return task.user_id === user_id;
        });
        // filter Assigned table task create self
        const ASSIGNED_SELF: PeriodicElement[] = assignedBySelf;
        this.dataSourceAssignedSelf = new MatTableDataSource<PeriodicElement>(ASSIGNED_SELF);
        this.dataSourceAssignedSelf.paginator = this.paginatorSelf;
        this.dataSourceAssignedSelf.filterPredicate = this.customFilterPredicate();
        // filter Assigned table task create self
        const ASSIGNED_OTHER: PeriodicElement[] = assignedByOther;
        this.dataSourceAssignedOther = new MatTableDataSource<PeriodicElement>(ASSIGNED_OTHER);
        this.dataSourceAssignedOther.paginator = this.paginatorOther;
        this.dataSourceAssignedOther.filterPredicate = this.customFilterPredicate();
        // filter created table task
        const ELEMENT_DATA_CREATED: PeriodicElement[] = createdTasks;
        this.dataSourceCreated = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CREATED);
        this.dataSourceCreated.paginator = this.paginatorCr;
        this.dataSourceCreated.filterPredicate = this.customFilterPredicate();
        if (this.statusId) {
          this.status_nameFilter.setValue(STATUSES_TASK[this.statusId]);
        }
        if (this.deptNameByParams) {
          this.dept_nameFilter.setValue(this.deptNameByParams);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  totalTaskDataGet() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.tasksDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.totalTasksData = data;
        // console.log("hjjjj", this.totalTasksData);

        this.total_task = this.totalTasksData.data.task_data.total;
        this.open_task = this.totalTasksData.data.task_data.open;
        this.closed_task = this.totalTasksData.data.task_data.closed;
        this.delayed_task = this.totalTasksData.data.task_data.delayed;
        this.closedWithDelay_task = this.totalTasksData.data.task_data.closedWithDelay;
        this.on_hold = this.totalTasksData.data.task_data.onHold;
      },
      error => {
        this.alertService.error(error);
      });
  }
  DeleteTasks(tasks_id) {
    let login_access_token = this.currentUser.login_access_token;
    this.tasks_id = tasks_id;
    let user_id = this.user_id;
    const confirmResult = this.confirmationDialogService.confirm('task');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.TasksDelete(login_access_token, tasks_id, user_id).pipe(first()).subscribe(
          data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.ViewTasks();
              this.totalTaskDataGet();
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
  StatusPopupOpen(element): void {
    const dialogRef = this.dialog.open(ChangeStatusDialog, {
      // width: '321px',
      // height: '355px',
      data: element
    });
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
        this.ViewTasks();
      }
    });
  }
  TaskTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  TaskDownloadPDF() {
    this.loaderService.show();
    var data = document.getElementById('task-analytics');
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
      pdf.save('task.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}

export interface PeriodicElement {
  sr_no: number;
  tasks_id: number;
  task_name: string;
  priority_name: string;
  event_name: string;
  dept_name: string;
  create_to_user_name: string;
  task_owaner_name: string;
  task_assigns_data: Array<any>;
  start_date: string;
  end_date: string;
  completion_date: string;
  status_name: string;
  action: string;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'change_status.component.html',
})
export class ChangeStatusDialog implements OnInit {
  selectedFile: File = null;
  StatusForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  TaskSuccess: any;
  MessageSuccess: any;
  MessageError: any;
  TaskError: any;
  dataStatusTask: any;
  DataStatus: any;
  currentUser: any;
  constructor(
    public dialogRef: MatDialogRef<ChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) { }
  ngOnInit(): void {
    this.dataStatusTask = this.data;
    let task_id = this.dataStatusTask.tasks_id;
    // let login_access_token = JSON.parse(localStorage.getItem('currentUser'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    // let upload_id = this.fileToUpload;

    // Reactive StatusForm
    this.StatusForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      task_id: [task_id, Validators.required],
      status_id: ['', Validators.required],
      remark: [],
      // upload_id : [upload_id],
    });
    this.SelectModuleGet();

  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  StatusTaskSumit() {
    this.submitted = true;
    // stop here if StatusForm is invalid
    /* if (this.StatusForm.invalid) {
         return;
     }*/
    const fd = new FormData();
    if (this.selectedFile != undefined) {
      fd.append('upload_id', this.selectedFile, this.selectedFile.name);
    }
    if (this.StatusForm.value.remark != undefined) {
      fd.append('remark', this.StatusForm.value.remark);
    }
    fd.append('login_access_token', this.StatusForm.value.login_access_token);
    fd.append('status_id', this.StatusForm.value.status_id);
    fd.append('task_id', this.StatusForm.value.task_id);
    this.userService.TaskStatusSumit(fd).pipe(first()).subscribe(
      (data: any) => {
        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.dialogRef.close('YesSubmit');
        } else {
          this.MessageError = data;
          this.alertService.error(this.MessageError.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  StatusPopupClose(): void {
    this.dialogRef.close();
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.DataStatus = data.data.status;
      },
      error => {
        this.alertService.error(error);
      });
  }
}