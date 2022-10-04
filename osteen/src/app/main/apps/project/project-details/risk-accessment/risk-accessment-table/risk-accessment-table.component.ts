import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { RiskAccessmentEditComponent } from '../risk-accessment-edit/risk-accessment-edit.component';
import { RiskAccessmentAddComponent } from '../risk-accessment-add/risk-accessment-add.component';

@Component({
  selector: 'risk-accessment-table',
  templateUrl: './risk-accessment-table.html',
  styleUrls: ['./risk-accessment-table.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RiskAccessmentComponent implements OnInit {
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
  currentUnitId: any;
  unit_id: any;
  displayedColumns: string[] = ['sr_no', 'risk_item', 'time_required', 'risk_level_name', 'risk_responsibility_name', 'mitigation_plan', 'action'];
  dataSourceCreated: any;
  @ViewChild(MatPaginator) paginatorCr: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
 /*  risk_item: any;
  time_required: any;
  risk_level: any;
  risk_responsibility: any;
  risk_mtiqation_plan: any; */

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
  /**
   * On init
   */
  ngOnInit(): void {
    this.completion = '0000-00-00';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
    });
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.ViewTasksData = data.data.RiskAccessmentLog;
        this.dataSourceCreated = new MatTableDataSource<PeriodicElement>(this.ViewTasksData);
      },
      error => {
        this.alertService.error(error);
      });
  }
  addRiskAccessment() {
    const dialogref = this.dialog.open(RiskAccessmentAddComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  editTracker(data) {
    const dialogref = this.dialog.open(RiskAccessmentEditComponent, {
      width: 'auto',
      data: data
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  deleteRiskAccessment(data) {
    let risk_id = data.id;
    if (risk_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "RiskAccessmentLog",
        id: risk_id,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      const confirmResult = this.confirmationDialogService.confirm('activity');
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
  risk_item: string;
  time_required: string;
  risk_level_name: string;
  risk_responsibility_name: string;
  mitigation_plan: string;
  action: string;
}