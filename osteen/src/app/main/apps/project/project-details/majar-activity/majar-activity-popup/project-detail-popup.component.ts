import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
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
  selector: 'project-detail-popup',
  templateUrl: './project-detail-popup.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectDetailPopupComponent implements OnInit {
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
  preActivity_sr_no: any;
  projectStartDate: any;
  activityMaxDate: any;
  activityMinMaxDate: any;
  proAllDetails: any;
  projectDetails: any;
  preceeding_activityGet: any;
  preceed_activityDate: any;
  displayedColumnsProActivity: string[] = ['milestone_name', 'mile_stone_date'];
  dataSourceProActivity: MatTableDataSource<any>;
  selectedSearchUser: any;
  constructor(
    public dialogRef: MatDialogRef<ProjectDetailPopupComponent>,
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
    // this.currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.currentDate = this.projectStartDate;
    this.project_id = this.data;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.activityFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['projectActivity'],
      activity_sr_no: [''],
      project_activity_id: [''],
      activity_name: ['', Validators.required],
      milestone_id: [''],
      activity_start_date: ['', Validators.required],
      activity_end_date: ['', Validators.required],
      preceeding_activity: [''],
      next_activity: [''],
      responsibility: ['', Validators.required],
      other_responsibility: ['']
    });
    this.singleViewProjects();
  }
  mileStoneChange(event: any) {
    let mileStone;
    mileStone = this.mileStoneGet.filter((val) => {
      return val.project_milestone_id === Number(event);
    });
    //this.activityMinMaxDate = moment(mileStone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    this.activityMinMaxDate = mileStone[0].mile_stone_date;
    /* let aaaa= "23-12-2020"
     this.activityMinMaxDate = moment(aaaa, "DD-MM-YYYY").format('YYYY-MM-DD'); */
  }
  preceedingChange(event: any) {
    if (event) {
      let preceed_activity;
      preceed_activity = this.preceeding_activityGet.filter((val) => {
        return val.project_activity_id === Number(event);
      });
      this.preceed_activityDate = moment(preceed_activity[0].activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    } else {
      this.preceed_activityDate = '';
    }
  }
/*   activityChange(event: any, index: any) {
    let activity;
    activity = this.activityGet.filter((val) => {
      return val.project_activity_id === Number(event);
    });
    return true;
  } */
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data;
        this.projectDetails = data.data.projectData[0];
        this.project_id = this.projectDetails.id;
        this.preceeding_activity = this.proAllDetails.project_majr_activity_data
        this.project_name = this.proAllDetails.project_name;
        this.mileStoneGet = this.proAllDetails.project_milestone_data;
        this.dataSourceProActivity = new MatTableDataSource<PeriodicElementActivity>(this.mileStoneGet);
        this.mileStoneGet.map((milestone: any) => {
          milestone.mile_stone_date = moment(milestone.mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
          if (this.currentDate > milestone.mile_stone_date) {
            milestone.isDisabled = true;
          }
        });
        this.preceeding_activityGet = this.proAllDetails.project_majr_activity_data;
        this.proCompanyUser = this.proAllDetails.project_member_data;
        this.selectedSearchUser = this.proCompanyUser;
        this.exmemberUser = this.proAllDetails.project_ex_member_data;
        this.projectStartDate = this.projectDetails.start_date;
        this.activityMaxDate = this.projectDetails.end_date;
        this.activityGet = this.proAllDetails.project_majr_activity_data;
        if (this.activityGet.length == 0) {
          this.preActivity_sr_no = 0;
        }
        else {
          this.preActivity_sr_no = this.activityGet[0].activity_sr_no;
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  /*  companyUserSearch(value) {
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
    const activitValues = [this.activityFormGroup.value];
    const storeActivit = [];
    activitValues.forEach((formRow) => {
      storeActivit.push({ activity_sr_no: this.preActivity_sr_no + 1, project_activity_id: formRow.project_activity_id, activity_name: formRow.activity_name, milestone_id: formRow.milestone_id, activity_start_date: this.datepipe.transform(formRow.activity_start_date, 'dd-MM-yyyy'), activity_end_date: this.datepipe.transform(formRow.activity_end_date, 'dd-MM-yyyy'), preceeding_activity: formRow.preceeding_activity, next_activity: formRow.next_activity, responsibility: formRow.responsibility, project_id: this.activityFormGroup.value.project_id, other_responsibility: formRow.other_responsibility })
    });
    this.activityFormGroup.value.majar_activity = storeActivit;

   console.log('dsfsafgasd',this.activityFormGroup.value);
    this.userService.ProjectAdd(this.activityFormGroup.value).pipe(first()).subscribe(
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
  // start_date:string;
  milestone_name: string;
  mile_stone_date: string;
}