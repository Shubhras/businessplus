import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { MilestoneStatusComponent } from '../milestone-status/milestone-status.component';
@Component({
  selector: 'project-milestone-table',
  templateUrl: './project-milestone-table.html',
  styleUrls: ['./project-milestone-table.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectMilestoneComponent implements OnInit {
  direction = 'row';
  sub: any;
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  userModulePermission: any;
  proFilesPermission: any;
  deleted_at: any;
  proMilestone: any;
  dataSourceMileStone: any;
  projectDetails: any;
  project_step_id: any;
  displayedColumsMilestone: string[] = ['sr_no', 'milestone_name', 'mile_stone_date', 'symbol', 'description', 'actual_date', 'comments', 'milestone_status', 'action'];
  @ViewChildren(FusePerfectScrollbarDirective)
  fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;
  /**
   * Constructor
   *
   *
   */
  constructor(
    private route: ActivatedRoute,
    //private router: RouterModule,
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private _formBuilder: FormBuilder,
    public datepipe: DatePipe,
    private cd: ChangeDetectorRef,
    private loaderService: LoaderService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseConfigService: FuseConfigService,
    private confirmationDialogService: ConfirmationDialogService,
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
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
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
  }
  updateMileStoneStatus(data) {
    const dialogref = this.dialog.open(MilestoneStatusComponent, {
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
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proMilestone = data.data.project_milestone_data;
        this.projectDetails = data.data.projectData[0];
        this.project_step_id = this.projectDetails.project_step_id;
        console.log(this.project_step_id);

        this.proMilestone.map((mile: any, index: number) => {
          mile.sr_no = index + 1;
        });
        this.dataSourceMileStone = new MatTableDataSource<PeriodicElementMileStone>(this.proMilestone);
      },
      error => {
        this.alertService.error(error);
      });
  }
  /* deleteMajrActivity(data) {
    let proproject_activity_id = data.project_activity_id;
    if (proproject_activity_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectActivity",
        project_activity_id: proproject_activity_id,
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
  } */
}
export interface PeriodicElementMileStone {
  sr_no: any;
  milestone_name: string;
  mile_stone_date: string;
  symbol: string;
  description: string;
  actual_date: string;
  comments: string;
  milestone_status: any;
  action: string;
}