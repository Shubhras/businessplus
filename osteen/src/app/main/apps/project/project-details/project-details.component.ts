import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { MajarActivityEdit } from './majar-activity/majar-activity-edit/majar-activity-edit';
import { ResourcePlanningAddComponent } from "app/main/apps/project/project-details/resource-planning/resource-planning-add/resource-planning-add.component";
import { AgendaComponent } from './governance/governance-table/agenda.component';
@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit {
  direction = 'row';
  sub: any;
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  project_name: any;
  userModulePermission: any;
  proFilesPermission: any;
  minDate = new Date();
  start_date: any;
  end_date: any;
  dummyPicture: any;
  proAllDetails: any = {};
  key_objectives: any;
  key_objective: any;
  proCompanyUser: any;
  proExternalUser: any;
  proMilestone: any;
  proKpiData: any;
  proKpiMilestone: any;
  proActivityData: any;
  deleted_at: any;
  proKpiDataAll: any;
  // proSubActivityData: any;
  proGoverancesList: any = {};
  proGoverances: any = [];
  proBudget: any;
  dataSourceProActivity: any;
  dataSourceKpi: any;
  //memberDetails: any;
  //displayedColumnsKPI: string[] = ['project_kpi_name', 'dept_name', 'uom_name', 'project_kpi_value'];
  //dataSourceKPI: any;
  displayedColumnsKpiMile: string[] = ['sr_no', 'milestone_name', 'projct_kpi_dstrbt_vl', 'actual', 'status', 'reason', 'solution'];
  //dataSourceKpiMile: any;
  displayedColumnsMileStone: string[] = ['sr_no', 'milestone_name', 'symbol', 'mile_stone_date', 'actual_date', 'milestone_status', 'comments'];
  dataSourceMileStone: any;
  // displayedColumnsActivity: string[] = ['sr_no', 'activity_name', 'milestone_name', 'activity_start_date', 'activity_end_date', 'preceeding_activity', 'next_activity', 'responsibility_person'];
  displayedColumnsProActivity: string[] = ['sr_no', 'activity_name', 'milestone_name', 'actvity_start_date', 'actvity_end_date', 'preceeding_activity_name', 'next_activity_name', 'responsibility_person', 'other_responsibility', 'action'];
  displayedColumnsSubActivity: string[] = ['sr_no', 'sub_activity_name', 'sb_actvity_strt_date', 'sb_actvity_end_date'];
  disColumnsSubActivity: string[] = ['sr_no', 'activity_name', 'sub_activity_name', 'sb_actvity_strt_date', 'sb_actvity_end_date'];
  dataSourceSubActivity: any;
  displayedColumnsBudget: string[] = ['sr_no', 'dept_name', 'allocation_dstrbt_vl'];
  dataSourceBudget: any;
  displayedColumnsGovernance: string[] = ['sr_no', 'meeting_name', 'chair_person_name', 'co_chair_person_name', 'gov_member', 'gov_frequency', 'meeting_day', 'meeting_shedule', 'gov_venue', 'gov_duration', 'agenda'];
  dataSourceGoverance: any;
  displayedColumnsKpiMilee: string[] = ['milestoneName', 'dept_name', 'project_kpi_name', 'uom_name', 'project_kpi_def', 'project_kpi_trend', 'project_kpi_yr_targt', 'project_kpi_freqency', 'project_kpi_value', 'projct_kpi_dstrbt_vl'];

  allExpandState: any;
  allExpandStateKpi: any;
  config: any;
  courseStepContent: any;
  currentStep: any = '11';
  issueId: any;
  proIdSendDash: any;
  proIdSendKpiDash: any;
  userIdSendResourceDash: any;
  proIdSendKpiMile: any;
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
    this.allExpandState = false;
    this.allExpandStateKpi = false;
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proFilesPermission = this.userModulePermission[i];
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      // when we edit a governance structure in edit project than selected governance Step
      if (params['governance'] == "governance") {
        this.currentStep = '9';
      }
      this.singleViewProjects();
    });
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.dummyPicture = "assets/images/avatars/profile.jpg";
    this.toggleSidebar('academy-course-left-sidebar-1');
    // this.projectPicture = this.dummyPicture;
  }
  agendaOpen(element): void {
    const dialogRef = this.dialog.open(AgendaComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Project Milestone strat
  mainDashToMileClick() {
    this.currentStep = '17';
  }
  //Project Milestone end
  // Issue Tracker start
  mainDashToIssuesClick() {
    this.currentStep = '6';
  }
  TbChangeArowClik() {
    this.currentStep = '6';
  }
  RemarkClick($event) {
    this.currentStep = '8';
    this.issueId = $event
  }
  DashboardClick($event) {
    this.currentStep = '10';
    this.proIdSendDash = $event
  }
  // Issue Tracker end
  //Project Deliverables start
  mainDashToDeviationsClick() {
    this.currentStep = '7';
  }
  TbChangeArowKpiDashClik() {
    this.currentStep = '7';
  }
  TbChangeArowKpiMileClik() {
    this.currentStep = '7';
  }
  DashboardKpiClick($event) {
    this.currentStep = '12';
    this.proIdSendKpiDash = $event
  }
  MileKpiClick($event) {
    this.currentStep = '14';
    this.proIdSendKpiMile = $event
  }
  //Project Deliverables end
  //Resource Planning start
  TbChangeArowResourceDashClik() {
    this.currentStep = '4';
  }
  DashboardResourceClick($event) {
    this.currentStep = '16';
    this.userIdSendResourceDash = $event
  }
  //Resource Planning end
  editProSingle(data) {
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
  addResourcePlanning() {
    const dialogref = this.dialog.open(ResourcePlanningAddComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  ngAfterViewInit(): void {
    this.courseStepContent = this.fuseScrollbarDirectives.find((fuseScrollbarDirective) => {
      return fuseScrollbarDirective.elementRef.nativeElement.id === 'course-step-content';
    });
  }
  gotoStep(step): void {
    this.currentStep = step;
    this.toggleSidebarHide('academy-course-left-sidebar-1')
  }
  toggleSidebar(name): void {
    this._fuseConfigService.config.subscribe((config) => {
      this.config = config;
    });
    if (this.project_id !== '') {
      this.config.layout.navbar.folded = true;
    } else {
      this.config.layout.navbar.folded = false;
    }
    this._fuseSidebarService.getSidebar(name);
  }
  toggleSidebarHide(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data.projectData[0];
        this.key_objectives = this.proAllDetails.key_objective;
        // this.key_objective = this.key_objectives.replace(/<[^>]*>/g, '');

        console.log(this.key_objective);
        this.project_name = this.proAllDetails.project_name;

        this.proCompanyUser = data.data.project_member_data;
        this.proExternalUser = data.data.project_ex_member_data;
        // milestone data
        this.proMilestone = data.data.project_milestone_data;
        this.proMilestone.map((stone: any, index: number) => {
          stone.sr_no = index + 1;
        });
        this.dataSourceMileStone = new MatTableDataSource<PeriodicElementMileStone>(this.proMilestone);
        // kpi data
        this.proKpiData = data.data.project_kpi_data;
        /*  this.dataSourceKPI = new MatTableDataSource<PeriodicElementKPI>(this.proKpiData); */
        // kpi milestone data
        this.proKpiMilestone = data.data.project_kpi_milestone_data;
        /* this.proKpiMilestone.map((mile: any, index: number) => {
          mile.sr_no = index + 1;
        }); */
        /* this.dataSourceKpiMile = new MatTableDataSource<PeriodicElementKpiMile>(this.proKpiMilestone); */
        // activity data
        this.proActivityData = data.data.project_majr_activity_data;
        this.dataSourceProActivity = new MatTableDataSource<PeriodicElementActivity>(this.proActivityData);
        // sub activity data
        let stoteSubActivity = [];
        for (let i = 0; i < this.proActivityData.length; i++) {
          const element = this.proActivityData[i].project_sub_activity_data;
          for (let index = 0; index < this.proActivityData[i].project_sub_activity_data.length; index++) {
            const element = this.proActivityData[i].project_sub_activity_data[index];
            stoteSubActivity.push(element);
          }
        }
        //this.proSubActivityData = data.data.project_sub_activity_data;
        this.dataSourceSubActivity = new MatTableDataSource<PeriodicElementSubActivity>(stoteSubActivity);
        // project goverances data
        this.proGoverancesList = data.data.project_goverances[0] ? data.data.project_goverances[0] : '';
        this.proGoverances = data.data.project_goverances;
        // const ELEMENT_DATA_CREATED: PeriodicElementGovernance[] = this.proGoverances;
        this.dataSourceGoverance = new MatTableDataSource<PeriodicElementGovernance>(this.proGoverances);
        // Budget tracking data
        this.proBudget = data.data.project_budget_tracking;
        this.proBudget.map((mile: any, index: number) => {
          mile.sr_no = index + 1;
        });
        this.dataSourceBudget = new MatTableDataSource<PeriodicElementBudget>(this.proBudget);
        this.proKpiDataAll = data.data.project_milestone_and_kpi_data;
        this.processData(this.proKpiDataAll);
      },
      error => {
        this.alertService.error(error);
      });
  }
  projectDetailsPDF() {
    this.loaderService.show();
    this.allExpandState = true;
    this.allExpandStateKpi = true;
    setTimeout(() => {
      var data = document.getElementById('project-details');
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jspdf('p', 'mm', 'a4');
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('project-charter.pdf');
        this.loaderService.hide();
        this.allExpandState = false;
        this.allExpandStateKpi = false;
      });
    }, 50);
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
  processData(kpidata: any) {
    this.proKpiData = kpidata;
    let KPIDATA: PeriodicElementKpi[] = [];
    // mile stone data
    for (let i = 0; i < this.proKpiData.length; i++) {
      const DataMileStone = this.proKpiData[i];
      if (DataMileStone.project_kpi_data.length > 0) {
        // kpi data according mile stone
        for (let j = 0; j < DataMileStone.project_kpi_data.length; j++) {
          const mileKPIData: any = {
            "milestone_name": '',
            "milestoneName": '',
            "project_id": '',
            "milestone_id": '',
            "kpi_mile_stone_id": '',
            "dept_name": '',
            "project_kpi_name": '',
            "uom_name": '',
            "project_kpi_value": '',
            "project_kpi_def": '',
            "project_kpi_trend": '',
            "project_kpi_yr_targt": '',
            "project_kpi_freqency": '',
            "projct_kpi_dstrbt_vl": '',
            "project_kpi_actual": '',
            "project_kpi_status": '',
          }
          const DataKPIMileStone = DataMileStone.project_kpi_data[j];
          if (j == 0) {
            // milestoneName name use for table
            mileKPIData['milestoneName'] = DataMileStone.milestone_name;
          }
          else {
            mileKPIData['milestoneName'] = '';
          }
          // milestone_name name use for mile stone update status
          mileKPIData['milestone_name'] = DataMileStone.milestone_name;
          mileKPIData['dept_name'] = DataKPIMileStone.dept_name;
          mileKPIData['project_id'] = DataKPIMileStone.project_id;
          mileKPIData['milestone_id'] = DataKPIMileStone.milestone_id;
          mileKPIData['kpi_mile_stone_id'] = DataKPIMileStone.kpi_mile_stone_id;
          mileKPIData['project_kpi_solution'] = DataKPIMileStone.project_kpi_solution;
          mileKPIData['project_kpi_reason'] = DataKPIMileStone.project_kpi_reason;

          mileKPIData['project_kpi_name'] = DataKPIMileStone.project_kpi_name;
          mileKPIData['uom_name'] = DataKPIMileStone.uom_name;
          mileKPIData['project_kpi_value'] = DataKPIMileStone.project_kpi_value;
          mileKPIData['project_kpi_def'] = DataKPIMileStone.project_kpi_def;
          mileKPIData['project_kpi_trend'] = DataKPIMileStone.project_kpi_trend;
          mileKPIData['project_kpi_yr_targt'] = DataKPIMileStone.project_kpi_yr_targt;
          mileKPIData['project_kpi_freqency'] = DataKPIMileStone.project_kpi_freqency;
          mileKPIData['projct_kpi_dstrbt_vl'] = DataKPIMileStone.projct_kpi_dstrbt_vl;
          mileKPIData['project_kpi_actual'] = DataKPIMileStone.project_kpi_actual;
          mileKPIData['project_kpi_status'] = DataKPIMileStone.project_kpi_status;
          KPIDATA.push(mileKPIData);
        }
      }
    }
    this.dataSourceKpi = new MatTableDataSource<PeriodicElementKpi>(KPIDATA);
    //this.dataSourceKpi.filterPredicate = this.customFilterPredicate();
  }
}
export interface PeriodicElementKPI {
  project_kpi_name: string;
  dept_name: string;
  uom_name: string;
  project_kpi_value: string;
}
/* export interface PeriodicElementKpiMile {
  sr_no: any;
  milestone_name: string;
  projct_kpi_dstrbt_vl: string;
} */
export interface PeriodicElementMileStone {
  sr_no: any;
  milestone_name: string;
  mile_stone_date: string;
  actual_date: string;
  milestone_status: any;
  symbol: string;
  comments: string;
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
export interface PeriodicElementSubActivity {
  sr_no: any;
  activity_name: string;
  sub_activity_name: string;
  sb_actvity_strt_date: string;
  sb_actvity_end_date: string;
}
export interface PeriodicElementBudget {
  sr_no: any;
  dept_name: string;
  allocation_dstrbt_vl: string;
}
export interface PeriodicElementGovernance {
  sr_no: number;
  meeting_name: string;
  chair_person_name: string;
  co_chair_person_name: string;
  gov_member: string;
  gov_frequency: string;
  meeting_day: string;
  meeting_shedule: string;
  gov_venue: string;
  gov_duration: string;
  agenda: string;
}
export interface PeriodicElementKpi {
  // sr_no: any;
  milestoneName: string;
  dept_name: string;
  uom_name: string;
  project_kpi_def: string;
  project_kpi_trend: string;
  project_kpi_yr_targt: string;
  project_kpi_freqency: string;
  project_kpi_value: string;
  projct_kpi_dstrbt_vl: string;
  project_kpi_actual: string;
  project_kpi_status: string;
  /* reason: string;
  solution: string; */
  action: any;
}