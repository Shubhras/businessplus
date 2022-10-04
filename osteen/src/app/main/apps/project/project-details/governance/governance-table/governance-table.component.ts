import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AddGovernanceComponent } from "app/main/apps/project/project-details/governance/add-governance/add-governance.component";
import { EditGovernanceComponent } from "app/main/apps/project/project-details/governance/edit-governance/edit-governance.component";
import { AddMomComponent } from "app/main/apps/project/project-details/governance/add-mom/add-mom.component";
import { AgendaComponent } from './agenda.component';
//import { MomComponent } from './abmom-view';

//import { MomComponent } from './agenda.component';

@Component({
  selector: 'governance-table',
  templateUrl: './governance-table.html',
  styleUrls: ['./governance-table.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GovernanceTableComponent implements OnInit {
  sub: any;
  project_id: any;
  message: any;
  tasks_id: number;
  task_name: string;
  data: any;
  user_id: number;
  governanceData: any;
  currentUser: any;
  completion: any;
  currentUnitId: any;
  unit_id: any;
  displayedColumns: string[] = ['sr_no', 'meeting_name', 'chair_person_name', 'co_chair_person_name', 'gov_member', 'gov_frequency', 'meeting_shedule', 'meeting_day', 'gov_duration', 'gov_venue', 'agenda', 'action'];

  dataSourceCreated: any;
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
  agendaOpen(element): void {
    const dialogRef = this.dialog.open(AgendaComponent, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  // momOpen(element): void {
  //   const dialogRef = this.dialog.open(MomComponent, {

  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //   });
  // }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.governanceData = data.data.project_goverances;
        const ELEMENT_DATA_CREATED: PeriodicElement[] = this.governanceData;
        this.dataSourceCreated = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA_CREATED);
      },
      error => {
        this.alertService.error(error);
      });
  }
  addGovernance() {
    const dialogref = this.dialog.open(AddGovernanceComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  editGovernance(element: any) {
    const dialogref = this.dialog.open(EditGovernanceComponent, {
      width: 'auto',
      data: element
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.singleViewProjects();
      }
    });
  }
  addMom() {
    const dialogref = this.dialog.open(AddMomComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {

      }
    });
  }
  deleteGovernance(element: any) {
    let project_gov_id = element.project_gov_id;
    let project_gov_memebers_id = element.project_gov_memebers_id;
    if (project_gov_id) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "governanceProject",
        "project_gov_id": project_gov_id,
        project_gov_memebers_id: project_gov_memebers_id,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      const confirmResult = this.confirmationDialogService.confirm('meeting');
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
  action: string;
}
