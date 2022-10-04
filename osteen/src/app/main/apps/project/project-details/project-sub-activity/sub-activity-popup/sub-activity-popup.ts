import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'sub-activity-project',
  templateUrl: './sub-activity-popup.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SubActivityProjectComponent implements OnInit {
  direction = 'row';
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  start_date: any;
  end_date: any;
  submitted = false;
  dataDepartment: any;
  sub_activity_name: any;
  major_activity_id: any
  //isLinear = false;
  sb_actvity_strt_date: any;
  sb_actvity_end_date: any;
  subActivityFormGroup: FormGroup;
  activityGet: any;
  subActivityMinMaxDate: any = [];
  displayedColumnsSubActivity: string[] = ['activity_name', 'activity_start_date', 'activity_end_date'];
  dataSourceSubActivity: any;
  @ViewChild('fileInput') el: ElementRef;
  proAllDetails: any;
  projectDetails: any;
  proCompanyUser: any;
  selectedSearchUser: any;
  constructor(
    public dialogRef: MatDialogRef<SubActivityProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.project_id = this.data;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.subActivityFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['projectSubActivity'],
      major_activity_id: ['', Validators.required],
      project_sub_actvity_id: [''],
      responsibility: ['', Validators.required],
      sub_activity_name: ['', Validators.required],
      sb_actvity_strt_date: ['', Validators.required],
      sb_actvity_end_date: ['', Validators.required],
    });
    this.singleViewProjects();
  }
  activityChange(event: any) {
    let activity;
    activity = this.activityGet.filter((val) => {
      return val.project_activity_id === Number(event);
    });
    this.subActivityMinMaxDate.startDate = moment(activity[0].activity_start_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    this.subActivityMinMaxDate.endDate = moment(activity[0].activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    return true;
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data;
        this.proCompanyUser = this.proAllDetails.project_member_data;
        this.selectedSearchUser = this.proCompanyUser;
        this.projectDetails = data.data.projectData[0];
        this.project_id = this.projectDetails.id;
        this.activityGet = this.proAllDetails.project_majr_activity_data;
        this.dataSourceSubActivity = new MatTableDataSource<PeriodicElementSubActivity>(this.activityGet);
      },
      error => {
        this.alertService.error(error);
      });
  }
  subActivitySubmit() {
    this.submitted = true;
    if (this.subActivityFormGroup.invalid) {
      return;
    }
    this.subActivityFormGroup.value.project_id = this.project_id;
    const subActivitValues = [this.subActivityFormGroup.value];
    const storeSubActivit = [];
    subActivitValues.forEach((formRow) => {
      storeSubActivit.push({ major_activity_id: formRow.major_activity_id, project_sub_actvity_id: formRow.project_sub_actvity_id, sub_activity_name: formRow.sub_activity_name, sb_actvity_strt_date: this.datepipe.transform(formRow.sb_actvity_strt_date, 'dd-MM-yyyy'), responsibility: formRow.responsibility, sb_actvity_end_date: this.datepipe.transform(formRow.sb_actvity_end_date, 'dd-MM-yyyy'), project_id: this.project_id })
    });
    this.subActivityFormGroup.value.sub_activity = storeSubActivit;
    this.userService.ProjectAdd(this.subActivityFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.dialogRef.close('YesSubmit');
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  AddUserClose(): void {
    this.dialogRef.close();
  }
}
export interface PeriodicElementSubActivity {
  sr_no: any;
  activity_name: string;
  activity_start_date: string;
  activity_end_date: string;
}