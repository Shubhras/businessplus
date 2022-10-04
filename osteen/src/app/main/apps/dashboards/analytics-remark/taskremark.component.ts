import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddTaskRemarkDialog } from 'app/main/apps/dashboards/analytics-remark/addtask-remark.component';
import { EditTaskRemarkDialog } from 'app/main/apps/dashboards/analytics-remark/edittask-remark.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'taskremark',
  templateUrl: './taskremark.component.html',
  styleUrls: ['./taskremark.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TaskremarkComponent implements OnInit {
  currentUser: any;
  login_access_token: string;
  id: number;
  sub: any;
  tasks_id: number;
  status_id: number;
  task_name: string;
  data: any;
  unit_id: any;
  user_id: number;
  file_name: string;
  task_remark_id: number;
  showfilter: any;
  hidefilter: any;
  singleDataTask: any = { data: '' };
  TaskRemarkDataStatus: any;
  completion: any;
  userModulePermission: any;
  taskRemarkPermission: any;
  displayedColumnsTask: string[] = ['task_name', 'priority_name', 'dept_name', 'task_owaner_name', 'task_assigns_data', 'start_date', 'end_date', 'completion_date', 'status_name'];
  dataSourceTask: any;
  displayedColumns: string[] = ['tasks_id', 'name', 'status_name', 'remark', 'file_name', 'updated_at', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
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
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService
  ) { }
  status_nameFilter = new FormControl();
  filteredValues = { tasks_id: '', name: '', status_name: '', remark: '', file_name: '', updated_at: '', action: '', topFilter: false };
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.completion = '0000-00-00';
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
    });
    //this.dataSource.sort = this.sort;
    this.showfilter = false;
    this.hidefilter = true;
    this.singleTasksDetails();
    this.RmarkViewTasks();
    this.SelectModuleGet();
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Tasks") {
        this.taskRemarkPermission = this.userModulePermission[i];
      }
    }
  }
  applyFilter(filterValue: string) {
    let filter = {
      name: filterValue.trim().toLowerCase(),
      status_name: filterValue.trim().toLowerCase(),
      remark: filterValue.trim().toLowerCase(),
      //file_name: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let nameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1;
      let statusFound = data.status_name.toString().trim().toLowerCase().indexOf(searchString.status_name.toLowerCase()) !== -1;
      let remarkFound = data.remark.toString().trim().toLowerCase().indexOf(searchString.remark.toLowerCase()) !== -1;
      //let fileNameFound = data.file_name.toString().trim().toLowerCase().indexOf(searchString.file_name.toLowerCase()) !== -1;

      if (searchString.topFilter) {
        return nameFound || statusFound || remarkFound
      } else {
        return nameFound && statusFound && remarkFound
      }
    }
    return myFilterPredicate;
  }
  PriorityGetColor(element) {
    switch (element) {
      case 'low':
        return '#6c757d';
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#f1b53d';
    }
  }
  StatusGetColor(element) {
    switch (element) {
      case 'Closed':
        return 'green';
      case 'Open':
        return '#6c757d';
      case 'Delayed':
        return 'red';
      case 'Closed with Delay':
        return 'green';
      case 'On Hold':
        return 'blue';
    }
  }
  TaskRemarkShowFilter() {
    this.showfilter = true;
    this.hidefilter = false;
  }
  TaskRemarkHideFilter() {
    this.showfilter = false;
    this.hidefilter = true;
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.TaskRemarkDataStatus = data.data.status;
      },
      error => {
        this.alertService.error(error);
      });
  }
  AddTaskRemarkOpen(tasks_id, task_name): void {
    this.tasks_id = tasks_id;
    this.task_name = task_name;
    const dialogRef = this.dialog.open(AddTaskRemarkDialog, {
      width: 'auto',
      data: { tasks_id: this.tasks_id, task_name: this.task_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.RmarkViewTasks();
        this.singleTasksDetails();
      }
    });
  }
  EditTaskRemarkOpen(element): void {
    const dialogRef = this.dialog.open(EditTaskRemarkDialog, {
      width: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.RmarkViewTasks();
        this.singleTasksDetails();
      }
    });
  }
  singleTasksDetails() {
    let tasks_id = this.id;
    this.userService.tasksDetailsSingle(this.login_access_token, tasks_id).pipe(first()).subscribe(
      (data: any) => {
        this.singleDataTask = data.data;
        this.task_name = this.singleDataTask.task_name;
        this.tasks_id = this.singleDataTask.tasks_id;
        const ELEMENT_DATA: PeriodicElementTask[] = [data.data];
        this.dataSourceTask = new MatTableDataSource<PeriodicElementTask>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  changeStatusTask(event) {
    this.status_id = event.target.value;
    let task_id = this.singleDataTask.tasks_id;
    let task_user_id = this.singleDataTask.user_id;
    let statusid = this.status_id;
    let unit_id = this.unit_id;
    this.userService.taskStatusSingle(this.login_access_token, task_id, statusid, task_user_id, unit_id).pipe(first()).subscribe(
      (data: any) => {
        this.singleTasksDetails();
        this.RmarkViewTasks();
      },
      error => {
        this.alertService.error(error);
      });
  }
  RmarkViewTasks() {
    let tasks_id = this.id;
    this.userService.ViewTasksrRmark(this.login_access_token, tasks_id).pipe(first()).subscribe(
      (data: any) => {
        data.data.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = data.data;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.filterPredicate = this.customFilterPredicate();
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  TasksrRmarkDelete(taskUserId, task_remark_id) {
    const confirmResult = this.confirmationDialogService.confirm('task remark');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.DeleteTasksrRmark(this.login_access_token, task_remark_id, taskUserId, this.user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.RmarkViewTasks();
            } else {
              this.alertService.error(data.message, true);
            }
          },
          error => {
            this.alertService.error(error);
          });
      }
    });
  }
  TaskRmarkExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  TaskRmarkPDF() {
    this.loaderService.show();
    var data = document.getElementById('tasks-remark');
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
      pdf.save('tasksRemark.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElementTask {
  task_name: string;
  priority_name: string;
  dept_name: string;
  create_to_user_name: string;
  task_owaner_name: string;
  task_assigns_data: Array<any>;
  start_date: string;
  end_date: string;
  completion_date: string;
  status_name: string;
}
export interface PeriodicElement {
  sr_no: number;
  tasks_id: number;
  task_name: string;
  name: string;
  status_name: string;
  remark: string;
  file_name:string
  updated_at: string;
  action: string;
}
