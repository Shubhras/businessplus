import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
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
  selector: 'pro-kpi-mile-view',
  templateUrl: './pro-kpi-mile-view.html',
  styleUrls: ['./pro-kpi-mile-view.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProKpiMileViewComponent implements OnInit {
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
  displayedColumnsKpiMile: string[] = ['milestoneName', 'dept_name', 'project_kpi_name', 'uom_name', 'project_kpi_def', 'project_kpi_trend', 'project_kpi_yr_targt', 'project_kpi_freqency', 'project_kpi_value', 'projct_kpi_dstrbt_vl', 'project_kpi_actual', 'project_kpi_status', 'action'];
  filteredValues = { sr_no: '', milestoneName: '', dept_name: '', project_kpi_name: '', uom_name: '', project_kpi_def: '', project_kpi_trend: '', project_kpi_yr_targt: '', project_kpi_freqency: '', project_kpi_value: '', projct_kpi_dstrbt_vl: '', project_kpi_actual: '', project_kpi_status: '', action: '', topFilter: false };
  config: any;
  courseStepContent: any;
  currentStep: any = '1';
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  dataSourceKpi: any;
  @Input() sendDataKpiMile: number;
  @Output() arrowclickKpiMileEvent = new EventEmitter<string>();
  allMileStoneData: any;
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
  kpi_statusFilter = new FormControl();
  milestone_nameFilter = new FormControl();
  ngOnInit(): void {
    this.allExpandState = true;
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proFilesPermission = this.userModulePermission[i];
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    /* this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
    }); */
    this.project_id = this.sendDataKpiMile;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.getDepartment();
    this.singleViewProjects();
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSourceKpi.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.kpi_statusFilter.valueChanges.subscribe((kpi_statusFilterValue) => {
      this.filteredValues['project_kpi_status'] = kpi_statusFilterValue;
      this.dataSourceKpi.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
  }
  arrowclick() {
    this.arrowclickKpiMileEvent.emit()
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.milestone_nameFilter.reset('');
    this.kpi_statusFilter.reset('');
    this.processData(this.proKpiDataAll);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElementKpi, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let kpi_statusFound = data.project_kpi_status.toString().trim().toLowerCase().indexOf(searchString.project_kpi_status.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return departmentFound || kpi_statusFound
      } else {
        return departmentFound && kpi_statusFound
      }
    }
    return myFilterPredicate;
  }
  filterRenderedData(mileId: number) {
    const mileStoneData = this.proKpiDataAll.filter((mileStone) => {
      if (mileId) {
        return mileStone.id === Number(mileId);
      }
      return true;
    });
    this.processData(mileStoneData);
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
    this.dataSourceKpi.filterPredicate = this.customFilterPredicate();
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        // kpi data
        this.project_name = data.data.projectData[0].project_name;
        this.allMileStoneData = data.data.project_milestone_data
        this.proKpiDataAll = data.data.project_milestone_and_kpi_data;
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