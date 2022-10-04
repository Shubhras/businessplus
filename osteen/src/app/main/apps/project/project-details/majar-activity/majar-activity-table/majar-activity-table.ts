import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ProjectDetailPopupComponent } from '../majar-activity-popup/project-detail-popup.component';
import { MajarActivityEdit } from '../majar-activity-edit/majar-activity-edit';
@Component({
  selector: 'majar-activity-table',
  templateUrl: './majar-activity-table.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MajarActivityTable implements OnInit {
  direction = 'row';
  sub: any;
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  userModulePermission: any;
  proFilesPermission: any;
  proAllDetails: any = {};
  dataSourceProActivity: any;
  proCompanyUser: any;
  proActivityData: any;
  deleted_at: any;
  displayedColumnsProActivity: string[] = ['sr_no', 'activity_name', 'milestone_name', 'actvity_start_date', 'actvity_end_date', 'preceeding_activity_name', 'next_activity_name', 'responsibility_person', 'other_responsibility', 'action'];
  /**
   * Constructor
   *
   *
   */
  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
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
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
  }

  openDialog() {
    const dialogref = this.dialog.open(ProjectDetailPopupComponent, {
      width: 'auto',
      data: this.project_id
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
        this.proAllDetails = data.data.projectData[0];
        this.proCompanyUser = data.data.project_member_data;
        this.proActivityData = data.data.project_majr_activity_data;


        this.dataSourceProActivity = new MatTableDataSource<PeriodicElementActivity>(this.proActivityData);
        // sub activity data
        /* let stoteSubActivity = [];
        for (let i = 0; i < this.proActivityData.length; i++) {
          const element = this.proActivityData[i].project_sub_activity_data;
          for (let index = 0; index < this.proActivityData[i].project_sub_activity_data.length; index++) {
            const element = this.proActivityData[i].project_sub_activity_data[index];
            stoteSubActivity.push(element);
          }
        } */
      },
      error => {
        this.alertService.error(error);
      });
  }

  editProSingle(data) {
    data.project_id = this.project_id;
    const dialogref = this.dialog.open(MajarActivityEdit, {
      width: 'auto',
      data: data
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }

  deleteMajrActivity(data) {
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
  }
}
export interface PeriodicElementActivity {
  sr_no: any;
  activity_name: string;
  milestone_name: string;
  activity_start_date: string;
  activity_end_date: string;
  preceeding_activity: string;
  next_activity: string;
  responsibility_person: string;
}