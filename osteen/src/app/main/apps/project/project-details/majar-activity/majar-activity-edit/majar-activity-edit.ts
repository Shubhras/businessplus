import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormArray, FormControl, AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { fuseAnimations } from '@fuse/animations';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'majar-activity-edit',
  templateUrl: './majar-activity-edit.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MajarActivityEdit implements OnInit {
  direction = 'row';
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  project_name: any;
  //minDate = new Date();
  start_date: any;
  end_date: any;
  submitted = false;
  activityFormGroup: FormGroup;
  mileStoneGet: any;
  preceeding_activity: any;
  activityGet: any;
  proCompanyUser: any;
  exmemberUser: any;
  currentDate: any;
  activitySrNo: any;
  preActivity_sr_no: any;
  start_datedie: any;
  responsibility_person: any;
  activityMinDate: any;
  activityMaxDate: any;
  activityMinMaxDate: any;
  proAllDetails: any;
  projectDetails: any;
  end_datedie: string;
  preceeding_activityGet: any;
  preceed_activityDate: string;
  displayedColumnsProActivity: string[] = ['milestone_name', 'mile_stone_date'];
  dataSourceProActivity: MatTableDataSource<any>;
  selectedSearchUser: any;
  constructor(
    public dialogRef: MatDialogRef<MajarActivityEdit>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    public datepipe: DatePipe,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.project_id = this.data.project_id;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.start_datedie = moment(this.data.activity_start_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    this.end_datedie = moment(this.data.activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    // this.responsibility_person = this.data.responsibility_person;
    this.activityFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['projectActivity'],
      activity_sr_no: [this.data.activity_sr_no, Validators.required],
      project_activity_id: [this.data.project_activity_id],
      activity_name: [{ value: this.data.activity_name, disabled: true }, Validators.required],
      milestone_id: [{ value: this.data.milestone_id, disabled: true }],
      activity_start_date: [this.start_datedie, Validators.required],
      activity_end_date: [this.end_datedie, Validators.required],
      preceeding_activity: [this.data.preceeding_activity],
      next_activity: [this.data.next_activity],
      responsibility: [this.data.user_id, Validators.required],
      // other_responsibility: [this.data.project_ex_user_id]
      other_responsibility: [this.data.project_ex_user_id]
    });
    this.singleViewProjects();
  }
  mileStoneChange(event: any) {
    let mileStone;
    mileStone = this.mileStoneGet.filter((val) => {
      return val.project_milestone_id === Number(event);
    });
    this.activityMinMaxDate = moment(mileStone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
  }
  // preceedingChange(event: any) {
  //   let preceed_activity;
  //   preceed_activity = this.preceeding_activityGet.filter((val) => {
  //     return val.project_activity_id === Number(event);
  //   });
  //   this.preceed_activityDate = moment(preceed_activity[0].activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
  // }

  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;

    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data;
        this.projectDetails = data.data.projectData[0];

        this.project_id = this.projectDetails.id;
        // this.preceeding_activity = this.proAllDetails.project_majr_activity_data
        this.project_name = this.proAllDetails.project_name;
        this.mileStoneGet = this.proAllDetails.project_milestone_data;
        this.dataSourceProActivity = new MatTableDataSource<PeriodicElementActivity>(this.mileStoneGet);
        this.mileStoneGet.map((milestone: any) => {
          milestone.mile_stone_date = moment(milestone.mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
          if (this.currentDate > milestone.mile_stone_date) {
            milestone.isDisabled = true;
          }
        });
        // this.preceeding_activityGet = this.proAllDetails.project_majr_activity_data;
        this.proCompanyUser = this.proAllDetails.project_member_data;
        this.selectedSearchUser = this.proCompanyUser;
        this.exmemberUser = this.proAllDetails.project_ex_member_data;
        this.activityMinDate = this.projectDetails.start_date;
        this.activityMaxDate = this.projectDetails.end_date;
        this.activityGet = this.proAllDetails.project_majr_activity_data;
        this.activitySrNo = this.proAllDetails.project_majr_activity_data;
        /*
        if (this.activitySrNo.length == 0) {
          this.preActivity_sr_no = 0;
        }
        else {
          this.preActivity_sr_no = this.activitySrNo[this.activitySrNo.length - 1].activity_sr_no;
        } */
      },
      error => {
        this.alertService.error(error);
      });

  }
  /* companyUserSearch(value) {
    this.selectedSearchUser = this.searchCompanyUser(value);
  }
  // Filter the user list and send back to populate the selectedSearchUser**
  searchCompanyUser(value: string) {
    let filter = value.toLowerCase();
    return this.proCompanyUser.filter(option => option.name.toLowerCase().startsWith(filter));
  } */
  projectActivitySubmit() {

    this.submitted = true;
    if (this.activityFormGroup.invalid) {
      return;
    }


    this.activityFormGroup.value.project_id = this.project_id;
    this.activityFormGroup.value.activity_start_date = this.datepipe.transform(this.activityFormGroup.value.activity_start_date, 'dd-MM-yyyy');
    this.activityFormGroup.value.activity_end_date = this.datepipe.transform(this.activityFormGroup.value.activity_end_date, 'dd-MM-yyyy');
    // return;
    this.userService.ProjectUpdate(this.activityFormGroup.value).pipe(first()).subscribe(
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

export interface PeriodicElementActivity {
  milestone_name: string;
  mile_stone_date: string;
}