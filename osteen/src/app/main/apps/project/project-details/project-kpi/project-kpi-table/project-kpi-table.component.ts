import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation,EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import * as _ from 'lodash';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KpiActualValueComponent } from "../kpi-actual-value-form/kpi-actual-value.component";
import { FormControl } from '@angular/forms';
import { ProjectKpiPopupComponent } from "app/main/apps/project/project-details/project-kpi/project-kpi-popup/project-kpi-popup-component";
import { ProjectKpiEditComponent } from "app/main/apps/project/project-details/project-kpi/project-kpi-edit/project-kpi-edit-component";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'project-kpi-table',
  templateUrl: './project-kpi-table.html',
  styleUrls: ['./project-kpi-table.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectKpiTable implements OnInit {
  direction = 'row';
  sub: any;
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  project_name: any;
  userModulePermission: any;
  proFilesPermission: any;
  proKpiData: any;
  proKpiDataAll: any;
  allExpandState: any;
  dataDepartment: any;
  displayedColumnsKpiMile: string[] = ['sr_no', 'milestone_name', 'projct_kpi_dstrbt_vl', 'actual', 'status', 'reason', 'solution', 'action'];
  config: any;
  courseStepContent: any;
  currentStep: any = '1';
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @Output() DashboardKpiClickEvent = new EventEmitter<number>();
  @Output() MileKpiClickEvent = new EventEmitter<number>();
  /**
   * Constructor
   *
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService,
    public datepipe: DatePipe,
  ) { }
  dept_nameFilter = new FormControl();
  ngOnInit(): void {
    this.allExpandState = true;
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proFilesPermission = this.userModulePermission[i];
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
    });
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.getDepartment();
  }
  sendKpiDashboard(proId){
    this.DashboardKpiClickEvent.emit(proId)
  }
  sendKpiMile(proId){
    this.MileKpiClickEvent.emit(proId)
  }

  resetOptions() {
    this.dept_nameFilter.reset('');
    this.processData(this.proKpiDataAll);
  }
  filterRenderedData(deptId: number) {
    const departments = this.proKpiDataAll.filter((department) => {
      if (deptId) {
        return department.project_kpi_dept === Number(deptId);
      }
      return true;
    });
    this.processData(departments);
  }
  processData(kpidata: any) {
    this.proKpiData = kpidata;
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        // kpi data
        this.proKpiDataAll = data.data.project_kpi_data;
        this.processData(this.proKpiDataAll);
      },
      error => {
        this.alertService.error(error);
      });
  }
  openKpiDialog() {
    const dialogref = this.dialog.open(ProjectKpiPopupComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  editKpiDialog(element): void {
    const dialogRef = this.dialog.open(ProjectKpiEditComponent, {
      width: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  openDialog(data) {
    const dialogref = this.dialog.open(KpiActualValueComponent, {
      width: 'auto',
      // panelClass: 'project-kpi-popup',
      data: data
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
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
  deleteKPI(event: any) {
    let project_kpi_id = event.project_kpi_id;
    const storeMile = [];
    if (event.project_kpi_milestone_data.length > 0) {
      for (let i = 0; i < event.project_kpi_milestone_data.length; i++) {
        storeMile.push(event.project_kpi_milestone_data[i].kpi_mile_stone_id);
      }
    }
    if (project_kpi_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "kpiProject",
        "project_kpi_id": project_kpi_id,
        "multi_kpi_mile_stone_id": storeMile,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      const confirmResult = this.confirmationDialogService.confirm('project deliverables');
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
