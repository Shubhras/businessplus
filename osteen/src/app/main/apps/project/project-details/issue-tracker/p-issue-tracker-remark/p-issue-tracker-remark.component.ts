import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, UserService } from 'app/main/apps/_services';
import { first } from 'rxjs/operators';
import { from } from 'rxjs';
import { AddIssueReamrkComponent } from './add-issue-reamrk/add-issue-reamrk.component'
import { EditIssueReamrkComponent } from './edit-issue-reamrk/edit-issue-reamrk.component';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-p-issue-tracker-remark',
  templateUrl: './p-issue-tracker-remark.component.html',
  styleUrls: ['./p-issue-tracker-remark.component.scss'],
  animations: fuseAnimations
})
export class PIssueTrackerRemarkComponent implements OnInit {

  //@ViewChild(PIssueTrackerComponent) child;
  @Input() IssueTrackerId: number;
  @Output() arrowclickEvent = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumnsIssue: string[] = ['issue_task_name', 'priority_name', 'dept_name', 'issue_owaner_name', 'issue_start_date', 'issue_end_date', 'completion_date', 'issue_revised_date', 'status_name'];
  //displayedColumns: string[] = ['issues_id', 'name', 'status_name','remark','file_name','updated_at','action'];
  displayedColumns: string[] = ['issues_id', 'name', 'remark', 'status_name', 'file_name', 'updated_at', 'action'];
  id: number;
  currentUser: any;
  singleDataTask: any;
  issue_task_name: any;
  issue_id: any;
  dataSourceTask: any;
  dataSourceRemark: any;
  data: any;
  userModulePermission: any;
  issueRemarkPermission: any;
  completion: string;
  constructor(
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    public datepipe: DatePipe,
  ) { }
  ngOnInit() {
    this.issue_id = this.IssueTrackerId
    this.completion = '0000-00-00';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.singleIssueDetails();
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Tasks") {
        this.issueRemarkPermission = this.userModulePermission[i];
      }
    }
  }
  applyFilter(filterValue: string) {
    this.dataSourceRemark.filter = filterValue.trim().toLowerCase();
  }
  singleIssueDetails() {
    //let issueId = this.IssueTrackerId;
    let login_access_token = this.currentUser.login_access_token;
    let projectDetails = 'IssueTrackerRemark';
    this.userService.singleRowData(login_access_token, this.issue_id, projectDetails).pipe(first()).subscribe(
      (data: any) => {
        this.singleDataTask = data.data.IssueTrackerRemark[0] ? data.data.IssueTrackerRemark[0] : '';
        this.issue_task_name = this.singleDataTask.issue_task_name;
        //this.issue_id = this.singleDataTask.id;
        const ELEMENT_DATA: PeriodicElementTask[] = data.data.IssueTrackerRemark;
        this.dataSourceTask = new MatTableDataSource<PeriodicElementTask>(ELEMENT_DATA);
        const ELEMENT_Remark_DATA: PeriodicElement[] = data.data.IssueRemarks;
        this.dataSourceRemark = new MatTableDataSource<PeriodicElement>(ELEMENT_Remark_DATA);
        this.dataSourceRemark.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  arrowclick() {
    this.arrowclickEvent.emit()
  }
  AddIssueRemarkOpen(): void {
    const dialogRef = this.dialog.open(AddIssueReamrkComponent, {
      width: 'auto',
      data: { issue_id: this.issue_id, issue_name: this.issue_task_name }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleIssueDetails();
      }
    });
  }
  EditIssueRemarkOpen(element): void {
    element.issue_name = this.issue_task_name
    const dialogRef = this.dialog.open(EditIssueReamrkComponent, {
      width: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleIssueDetails();
      }
    });
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
  deleteIssueRemark(event: any) {
    const fd = new FormData();
    fd.append('login_access_token', this.currentUser.login_access_token);
    fd.append('issue_remark_id', event.id);
    fd.append('deleted_at', this.datepipe.transform(new Date(), 'yyyy-MM-dd'));
    const confirmResult = this.confirmationDialogService.confirm('issue remark');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.AddEditDeleteIssueRmark(fd).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.singleIssueDetails();
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

export interface PeriodicElementTask {
  issue_task_name: string;
  priority_name: string;
  issue_task_dept: string;
  create_to_user_name: string;
  task_owaner_name: string;
  issue_start_date: string;
  issue_end_date: string;
  end_date: string;
  completion_date: string;
  issue_revised_date: string;
  status_name: string;
}
export interface PeriodicElement {
  sr_no: number;
  id: number;
  issues_id: number;
  task_name: string;
  name: string;
  status_name: string;
  remark: string;
  updated_at: string;
  action: string;
  file_name: string
}