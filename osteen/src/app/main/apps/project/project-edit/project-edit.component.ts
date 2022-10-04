import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { MatStepper, MatStep } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as _ from 'lodash';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';

import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { element } from '@angular/core/src/render3';
@Component({
  selector: 'project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectEditComponent implements OnInit {
  //isLinear = 'true';
  direction = 'row';
  sub: any;
  currentUser: any;
  company_id: any;
  unit_id: any;
  project_id: any;
  image_id = null;
  project_name: any;
  project_step_id: number[] = [1, 2, 3, 4, 5];
  userModulePermission: any;
  proFilesPermission: any;
  minDate = new Date();
  start_date: any;
  end_date: any;
  submitted = false;
  dataDepartment: any;
  dataUoM: any;
  dataBusinessInit: any;
  dataCategories: any;
  userListAllData: any;
  isLinear = false;
  //isLinear = false;
  proFormGroup: FormGroup;
  proTeamFormGroup: FormGroup;
  mileStoneFormGroup: FormGroup;
  activityFormGroup: FormGroup;
  subActivityFormGroup: FormGroup;
  kpiFormGroup: FormGroup;
  kpiValueError: any;
  kpiValueErrorShow: any;
  governanceFormGroup: FormGroup;
  budgetValueError: any;
  budgetValueErrorShow: any;
  budgetTrackFormGroup: FormGroup;
  selectedAllocationDept: Array<number> = [];
  dummyPicture: any;
  //projectPicture: any;
  leaderPicture: any;
  singleDetailsUser: any;
  mileStoneGet: any;
  activityGet: any;
  projectDuration: any;
  selectedUser: Array<number> = [];
  selectedMileStone: Array<number> = [];
  proCompanyUser: any;
  selectedProCompanyUser: Array<number> = [];
  //storeMajarActivity: any;
  activityMinDate: any;
  current_project_steps_id: number;
  current_project_steps_idtwo: number;
  activityMaxDate: any;
  userSelectedYear: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  login_access_token: any;
  viewProjectData: any;
  // selectedIndex: number;
  loadStepDataById: any;
  userrolecurrency: any;
  straObjStatus: any;
  currencygetarray: any;
  currentYearSubscription: any;
  //activityMinMaxDate: any = [{ 'startDate': null, 'endDate': null }];
  activityMinMaxDate: any = [];
  // subActivityMinMaxDate: any = [{ 'startDate': null, 'endDate': null }];
  subActivityMinMaxDate: any = [];
  // public processing = true;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('fileInput') el: ElementRef;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    width: '70rem',
    //width: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  selected: string;

  currencies = [
    { value: 'U.S. Dollar $', text: '$' },
    { value: 'Euro €', text: 'Euro €' },
    { value: 'Japanese Yen ¥', text: '¥' },
    { value: 'Pounds £', text: '£' },
    { value: 'Indian Rupee ₹', text: '₹' }
    // { value: 'us', text: 'U.S. Dollar $' },
    // { value: 'euro', text: 'Euro €' },
    // { value: 'yen', text: 'Japanese Yen ¥' },
    // { value: 'pound', text: 'Pounds £' },
    // { value: 'inr', text: 'Indian Rupee ₹' }
  ];
  proAllDetails: any;
  projectDetails: any;
  stepperindex: number;

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
    private dataYearService: DataYearService,
    private cd: ChangeDetectorRef
  ) {
    // this.stepperindex = 1;
    // setTimeout(() => {
    //   this.stepper.selectedIndex = 2;
    //   //this.stepperindex = this.current_project_steps_id;
    //   // console.log(this.stepperindex);

    // }, 1000);

  }

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
      this.project_id = +params['id'];
      console.log("rererer", this.project_id);

      this.current_project_steps_id = +params['stepId'];
      console.log("thiss", params['stepId']);
      console.log(this.current_project_steps_id);

      // (+) converts string 'id' to a number

      this.singleViewProjects();
      //this.getCurrencyfunc();

    });
    let login_access_token = this.currentUser.login_access_token;
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    // this.userSelectedYear = this.currentUser.data.userSelectedYear;
    // console.log(this.userSelectedYear);
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.dummyPicture = "assets/images/avatars/profile.jpg";
    // this.projectPicture = this.dummyPicture;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
    });
    this.userLisetGet();
    this.SelectModuleGet();
    this.getDepartment();
    this.getUoM();

    // this.viewProjects();
    this.kpiValueError = false;
    this.budgetValueError = false;
    // add project form
    this.proFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      project_id: [this.project_id],
      project_name: ['', Validators.required],
      department_id: ['', Validators.required],
      image_id: [''],
      project_logo: [''],
      project_mission: ['', Validators.required],
      key_objective: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      projectDetails: ['project'],
    });
    // Project team form
    this.proTeamFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      user_id: ['', Validators.required],
      project_id: [this.project_id],
      project_leader_id: [''],
      project_leader: [1, Validators.required],
      department_id: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]\\d{9}')]],
      pro_leader_logo: [''],
      pro_leader_logo_id: [''],
      pro_co_leader: this._formBuilder.array([]),
      company_user: this._formBuilder.array([]),
      external_user: this._formBuilder.array([]),
      projectDetails: ['projectTeam'],
    });
    // Project key dates form
    this.proTeamFormGroup.controls['email'].disable();
    this.mileStoneFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      // start_date: ['', Validators.required],
      // end_date: ['', Validators.required],
      projectDetails: ['projectKeyDates'],
      mile_stone: this._formBuilder.array([])
    });
    this.proFormGroup.valueChanges.subscribe((val) => {
      if (val.start_date != '' && val.end_date != '') {
        let start = this.datepipe.transform(val.start_date, 'yyyy-MM-dd');
        let end = new Date(this.datepipe.transform(val.end_date, 'yyyy-MM-dd'));
        this.calcDateDuration(start, end);
        this.activityMinDate = val.start_date;
        this.activityMaxDate = val.end_date;

      }
    });
    // this.mileStoneFormGroup.valueChanges.subscribe((val) => {
    //   if (val.start_date != '' && val.end_date != '') {
    //     let start = this.datepipe.transform(val.start_date, 'yyyy-MM-dd');
    //     let end = new Date(this.datepipe.transform(val.end_date, 'yyyy-MM-dd'));
    //     this.calcDateDuration(start, end);
    //     this.activityMinDate = val.start_date;
    //     this.activityMaxDate = val.end_date;
    //   }
    // });
    // Majar activity plan form
    this.activityFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['projectActivity'],
      majar_activity: this._formBuilder.array([])
    });

    /* this.activityFormGroup.valueChanges.subscribe(val => {
      this.storeMajarActivity = val.majar_activity;
    }); */
    // Add sub activity form
    this.subActivityFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['projectSubActivity'],
      sub_activity: this._formBuilder.array([])
    });
    // kpi form
    this.kpiFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      project_kpi_id: [''],
      project_kpi_name: ['', Validators.required],
      project_kpi_dept: ['', Validators.required],
      project_kpi_uom: ['', Validators.required],
      project_kpi_value: ['', Validators.required],
      projectDetails: ['kpiProject'],
      kpi_mile_stone: this._formBuilder.array([])
    });
    this.kpiFormGroup.valueChanges.subscribe(val => {
      if (val.project_kpi_value !== '') {
        let totalKpiValue = 0;
        for (let i = 0; i < this.kpiFormGroup.value.kpi_mile_stone.length; i++) {
          totalKpiValue += Number(this.kpiFormGroup.value.kpi_mile_stone[i].projct_kpi_dstrbt_vl);
        }
        if (Number(this.kpiFormGroup.value.project_kpi_value) !== totalKpiValue) {
          this.kpiValueError = true;
          this.kpiValueErrorShow = "Milestone sub-total not match with KPI value";
        }
        else {
          this.kpiValueError = false;
        }
      }
    });
    // Governance review meeting form
    /*  this.governanceFormGroup = this._formBuilder.group({
       company_id: [this.company_id, Validators.required],
       login_access_token: [login_access_token, Validators.required],
       unit_id: [this.unit_id, Validators.required],
       project_gov_id: [''],
       meeting_name: ['', Validators.required],
       chair_person: ['', Validators.required],
       co_chair_person: ['', Validators.required],
       gov_member: ['', Validators.required],
       gov_frequency: ['', Validators.required],
       meeting_day: [''],
       meeting_shedule: [''],
       gov_venue: ['', Validators.required],
       gov_duration: ['', Validators.required],
       projectDetails: ['governanceProject'],
     }); */
    // Budget tracking form
    this.budgetTrackFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      total_pro_cost: ['', Validators.required],
      currency: ['', Validators.required],
      allocation_dept: this._formBuilder.array([]),
      projectDetails: ['budgetTrackProject'],
    });
    this.budgetTrackFormGroup.valueChanges.subscribe(val => {
      if (val.total_pro_cost !== '') {
        let totalBudgetValue = 0;
        for (let i = 0; i < this.budgetTrackFormGroup.value.allocation_dept.length; i++) {
          totalBudgetValue += Number(this.budgetTrackFormGroup.value.allocation_dept[i].allocation_dstrbt_vl);
        }
        if (Number(this.budgetTrackFormGroup.value.total_pro_cost) !== totalBudgetValue) {
          this.budgetValueError = true;
          this.budgetValueErrorShow = "Allocation to department sub-total must match with total project cost or it is optional";
        }
        // "Allocation to department sub-total not match with total project cost"
        else {
          this.budgetValueError = false;
        }
      }
    });

    // this.setStepper();
  }

  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;

    //this.current_project_steps_id = 2;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data;

        this.projectDetails = data.data.projectData[0];
        console.log("single", this.projectDetails);

        this.project_id = this.projectDetails.id;
        this.project_name = this.projectDetails.project_name;
        console.log("testt", this.project_name);
        this.current_project_steps_idtwo = (this.projectDetails.project_step_id);
        //this.processing = false;
        console.log("testt", this.current_project_steps_idtwo);

        // this.selectedIndex = this.current_project_steps_id; // Number(sorDataService.selectedIndex);
        // console.log(this.selectedIndex);

        // project form Details
        this.proFormGroup.patchValue({ project_name: this.projectDetails.project_name });
        this.proFormGroup.patchValue({ department_id: this.projectDetails.department_id });
        this.proFormGroup.patchValue({ project_mission: this.projectDetails.project_mission });
        this.proFormGroup.patchValue({ key_objective: this.projectDetails.key_objective });
        this.proFormGroup.patchValue({ start_date: this.projectDetails.start_date });
        this.proFormGroup.patchValue({ end_date: this.projectDetails.end_date });
        this.proFormGroup.patchValue({ project_logo: this.projectDetails.file_name });
        this.proFormGroup.patchValue({ image_id: this.projectDetails.project_logo });
        // Project team form Details
        this.proCompanyUser = this.proAllDetails.project_member_data;
        const proMemData = this.proAllDetails.project_member_data;
        if (proMemData == '') {
          this.formArrCompanyUser.push(this.initCompanyUser());
          this.formArrCoLeaderUser.push(this.initproCoLeaderUser()); //changed code
        }
        else {
          let memIndex = 0;
          for (let i = 0; i < proMemData.length; i++) {
            let deptDataUser = (proMemData[i].multi_dept_id).split(",");
            if (proMemData[i].project_leader == 1) {
              this.selectedUser[i] = proMemData[i].user_id; //team leader index
              this.proTeamFormGroup.patchValue({ user_id: proMemData[i].user_id });
              this.proTeamFormGroup.patchValue({ project_leader_id: proMemData[i].project_company_user_id });
              this.proTeamFormGroup.patchValue({ department_id: 0 });
              if (deptDataUser.length == 1) {
                this.proTeamFormGroup.patchValue({ "department_id": Number(deptDataUser[0]) });
              }
              else {
                this.proTeamFormGroup.patchValue({ "department_id": 0 });
              }
              this.proTeamFormGroup.patchValue({ email: proMemData[i].email });
              this.proTeamFormGroup.patchValue({ mobile: proMemData[i].mobile });
              this.proTeamFormGroup.patchValue({ pro_leader_logo: proMemData[i].file_name });
              this.proTeamFormGroup.patchValue({ pro_leader_logo_id: proMemData[i].photo_id });
            }
            else if (proMemData[i].project_leader == 2) {
              this.formArrCoLeaderUser.push(this.initproCoLeaderUser());
              this.selectedUser[memIndex + 1] = proMemData[i].user_id; // co leader member index
              this.formArrCoLeaderUser.at(memIndex).patchValue({ user_id: proMemData[i].user_id });
              this.formArrCoLeaderUser.at(memIndex).patchValue({ project_co_leader_id: proMemData[i].project_company_user_id });
              this.formArrCoLeaderUser.at(memIndex).patchValue({ email: proMemData[i].email });
              if (deptDataUser.length == 1) {
                this.formArrCoLeaderUser.at(memIndex).patchValue({ "department_id": Number(deptDataUser[0]) });
              }
              else {
                this.formArrCoLeaderUser.at(memIndex).patchValue({ "department_id": 0 });
              }
              this.formArrCoLeaderUser.at(memIndex).patchValue({ mobile: proMemData[i].mobile });
              this.formArrCoLeaderUser.at(memIndex).patchValue({ pro_co_leader_logo: proMemData[i].file_name });
              this.formArrCoLeaderUser.at(memIndex).patchValue({ pro_co_leader_logo_id: proMemData[i].photo_id });
            }
            else {
              this.formArrCompanyUser.push(this.initCompanyUser());
              this.selectedUser[memIndex + 2] = proMemData[i].user_id; // team member index
              this.formArrCompanyUser.at(memIndex).patchValue({ user_id: proMemData[i].user_id });
              this.formArrCompanyUser.at(memIndex).patchValue({ project_company_user_id: proMemData[i].project_company_user_id });
              this.formArrCompanyUser.at(memIndex).patchValue({ email: proMemData[i].email });
              if (deptDataUser.length == 1) {
                this.formArrCompanyUser.at(memIndex).patchValue({ "department_id": Number(deptDataUser[0]) });
              }
              else {
                this.formArrCompanyUser.at(memIndex).patchValue({ "department_id": 0 });
              }
              this.formArrCompanyUser.at(memIndex).patchValue({ mobile: proMemData[i].mobile });
              this.formArrCompanyUser.at(memIndex).patchValue({ company_user_logo: proMemData[i].file_name });
              this.formArrCompanyUser.at(memIndex).patchValue({ company_user_logo_id: proMemData[i].photo_id });
              memIndex++;
            }
          }
        }
        const proExMemData = this.proAllDetails.project_ex_member_data;
        for (let i = 0; i < proExMemData.length; i++) {
          this.formArrExternalUser.push(this.initExternalUser());
          this.formArrExternalUser.at(i).patchValue({ project_ex_user_id: proExMemData[i].project_ex_user_id });
          this.formArrExternalUser.at(i).patchValue({ ex_membar_name: proExMemData[i].ex_membar_name });
          this.formArrExternalUser.at(i).patchValue({ email_id: proExMemData[i].email_id });
          this.formArrExternalUser.at(i).patchValue({ company_name: proExMemData[i].company_name });
          this.formArrExternalUser.at(i).patchValue({ phone_number: proExMemData[i].phone_number });
          this.formArrExternalUser.at(i).patchValue({ external_user_logo: proExMemData[i].file_name });
          this.formArrExternalUser.at(i).patchValue({ project_ex_user_img_id: proExMemData[i].photo });
        }
        //  Project key dates form Details
        // this.mileStoneFormGroup.patchValue({ start_date: this.projectDetails.start_date });
        // this.mileStoneFormGroup.patchValue({ end_date: this.projectDetails.end_date });
        this.mileStoneGet = this.proAllDetails.project_milestone_data;
        const MileStoneData = this.proAllDetails.project_milestone_data;
        if (MileStoneData == '') {
          this.formArr.push(this.initMileStone());
        }
        else {
          for (let i = 0; i < MileStoneData.length; i++) {
            this.formArr.push(this.initMileStone());
            this.formArr.at(i).patchValue({ project_milestone_id: MileStoneData[i].project_milestone_id });
            this.formArr.at(i).patchValue({ milestone_name: MileStoneData[i].milestone_name });
            this.formArr.at(i).patchValue({ mile_stone_date: moment(MileStoneData[i].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD') });
            this.formArr.at(i).patchValue({ symbol: MileStoneData[i].symbol });
            this.formArr.at(i).patchValue({ description: MileStoneData[i].description });
          }
        }
        this.budgetTrackFormGroup.patchValue({ total_pro_cost: this.projectDetails.project_cost });
        this.budgetTrackFormGroup.patchValue({ currency: this.projectDetails.currency });
        const proBudgetData = this.proAllDetails.project_budget_tracking;
        if (proBudgetData == '') {
          this.formArrAllocationDept.push(this.initAllocationDept());
        }
        else {
          for (let i = 0; i < proBudgetData.length; i++) {
            this.formArrAllocationDept.push(this.initAllocationDept());
            this.selectedAllocationDept[i] = proBudgetData[i].dept_id;
            this.formArrAllocationDept.at(i).patchValue({ dept_id: proBudgetData[i].dept_id });
            this.formArrAllocationDept.at(i).patchValue({ project_budget_id: proBudgetData[i].project_budget_id });
            this.formArrAllocationDept.at(i).patchValue({ allocation_dstrbt_vl: proBudgetData[i].allocation_dstrbt_vl });
          }
        }
      },
      error => {
        this.alertService.error(error);
      });
  }



  compareFnUser(v1: any, v2: any): boolean {
    return v1 === v2.member_id;
  }
  mileStoneChange(event: any, index: any) {
    let mileStone;
    mileStone = this.mileStoneGet.filter((val) => {
      return val.project_milestone_id === Number(event);
    });
    // this.activityMinMaxDate[index].endDate = mileStone[0].mile_stone_date; //2020-02-15
    this.activityMinMaxDate[index].endDate = moment(mileStone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
  }
  activityChange(event: any, index: any) {
    let activity;
    activity = this.activityGet.filter((val) => {
      return val.project_activity_id === Number(event);
    });
    //this.subActivityMinMaxDate[index].startDate = activity[0].activity_start_date;
    //this.subActivityMinMaxDate[index].endDate = activity[0].activity_end_date;
    this.subActivityMinMaxDate[index].startDate = moment(activity[0].activity_start_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    this.subActivityMinMaxDate[index].endDate = moment(activity[0].activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    return true;
  }
  // calculate project duration start and end date
  calcDateDuration(start, end) {
    let start_date = start.split('-');
    var end_date = end;
    var year = end_date.getFullYear();
    var month = end_date.getMonth() + 1;
    var day = end_date.getDate();
    var yy = parseInt(start_date[0]);
    var mm = parseInt(start_date[1]);
    var dd = parseInt(start_date[2]);
    var years, months, days;
    // months
    months = month - mm;
    if (day < dd) {
      months = months - 1;
    }
    // years
    years = year - yy;
    if (month * 100 + day < mm * 100 + dd) {
      years = years - 1;
      months = months + 12;
    }
    // days
    days = Math.floor((end_date.getTime() - (new Date(yy + years, mm + months - 1, dd)).getTime()) / (24 * 60 * 60 * 1000));
    this.projectDuration = years + ' ' + 'Year' + ' ' + months + ' ' + 'Month' + ' ' + days + ' ' + 'Days';
    //return { years: years, months: months, days: days };
  }
  singleUser(event: any, userType, index: any) {
    let login_access_token = this.currentUser.login_access_token;
    let user_id = event;
    let company_id = this.company_id;
    //this.selectedUser[index] = user_id;
    this.userService.singleUserDetails(login_access_token, company_id, user_id).pipe(first()).subscribe(
      (data: any) => {
        this.singleDetailsUser = data.data;
        let deptData = (this.singleDetailsUser.multi_dept_id).split(",");
        if (userType == 'proLeader') {
          this.selectedUser[index] = user_id; // team leader index
          this.leaderPicture = this.singleDetailsUser.profile_picture;
          this.proTeamFormGroup.patchValue({ "email": this.singleDetailsUser.email });
          this.proTeamFormGroup.patchValue({ "mobile": this.singleDetailsUser.mobile });
          if (this.singleDetailsUser.mobile != '') {
            this.proTeamFormGroup.controls['mobile'].disable();
          }
          else {
            this.proTeamFormGroup.controls['mobile'].enable();
          }
          if (deptData.length == 1) {
            this.proTeamFormGroup.patchValue({ "department_id": Number(deptData[0]) });
          }
          else {
            this.proTeamFormGroup.patchValue({ "department_id": 0 });
          }
          this.proTeamFormGroup.patchValue({ pro_leader_logo: this.singleDetailsUser.profile_picture })
        }
        else if (userType == 'proCoLeader') {
          this.selectedUser[index + 1] = user_id; // team member index
          this.formArrCoLeaderUser.at(index).patchValue({ email: this.singleDetailsUser.email });
          this.formArrCoLeaderUser.at(index).patchValue({ mobile: this.singleDetailsUser.mobile });
          if (deptData.length == 1) {
            this.formArrCoLeaderUser.at(index).patchValue({ "department_id": Number(deptData[0]) });
          }
          else {
            this.formArrCoLeaderUser.at(index).patchValue({ "department_id": 0 });
          }
          this.formArrCoLeaderUser.at(index).patchValue({ pro_co_leader_logo: this.singleDetailsUser.profile_picture });
          this.formArrCoLeaderUser.at(index).patchValue({ project_id: this.project_id });
        }
        else {
          this.selectedUser[index + 2] = user_id; // team member index
          this.formArrCompanyUser.at(index).patchValue({ email: this.singleDetailsUser.email });
          this.formArrCompanyUser.at(index).patchValue({ mobile: this.singleDetailsUser.mobile });
          if (deptData.length == 1) {
            this.formArrCompanyUser.at(index).patchValue({ "department_id": Number(deptData[0]) });
          }
          else {
            this.formArrCompanyUser.at(index).patchValue({ "department_id": 0 });
          }
          this.formArrCompanyUser.at(index).patchValue({ company_user_logo: this.singleDetailsUser.profile_picture });
          this.formArrCompanyUser.at(index).patchValue({ project_id: this.project_id });
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  // setTimeout(() => {
  //   this.stepper.selectedIndex = 2;
  // },3000);
  // setTimeout() {
  //   this.stepper.selectedIndex = this.current_project_steps_id;
  // }
  // setStepper() {
  //   // this.stepper.linear = false
  //   // this.current_project_steps_ids = index;
  //   this.stepper.selectedIndex = this.current_project_steps_ids;
  //   setTimeout(() => {
  //     this.stepper.selectedIndex = this.current_project_steps_ids;
  //     // this.stepper.linear = true;
  //   }, 3000);

  // }

  proLogoSelected(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.proFormGroup.patchValue({
          project_logo: reader.result
        });
      }
    }
  }
  leaderLogoSelected(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.leaderPicture = reader.result;
        this.proTeamFormGroup.patchValue({
          pro_leader_logo: reader.result
        });
      }
    }
  }
  coLeaderLogoSelected(event, index: number) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.formArrCoLeaderUser.at(index).patchValue({
          pro_co_leader_logo: reader.result
        });
      }
    }
  }
  companyUserLogo(event, index: number) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.formArrCompanyUser.at(index).patchValue({
          company_user_logo: reader.result
        });
      }
    }
  }
  externalUserLogo(event, index: number) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.formArrExternalUser.at(index).patchValue({
          external_user_logo: reader.result
        });
      }
    }
  }
  mobileValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  //project co leader user
  get formArrCoLeaderUser() {
    return this.proTeamFormGroup.get('pro_co_leader') as FormArray;
  }
  initproCoLeaderUser() {
    return this._formBuilder.group({
      project_id: [this.project_id],
      user_id: ['', Validators.required],
      project_co_leader_id: [''],
      project_leader: [2, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      department_id: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]\\d{9}')]],
      pro_co_leader_logo: [''],
      pro_co_leader_logo_id: [''],
    });
  }
  // Project team
  get formArrCompanyUser() {
    return this.proTeamFormGroup.get('company_user') as FormArray;
  }
  initCompanyUser() {
    return this._formBuilder.group({
      project_id: [this.project_id],
      project_leader: [0],
      user_id: ['', Validators.required],
      project_company_user_id: [''],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      department_id: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]\\d{9}')]],
      company_user_logo: [''],
      company_user_logo_id: [''],
      deleted_at: [''],
    });
  }
  addCompanyUser() {
    this.formArrCompanyUser.push(this.initCompanyUser());
  }
  deleteCompanyUser(index: number) {
    let proComUserId = this.formArrCompanyUser.value[index].project_company_user_id;
    if (proComUserId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectTeam",
        "project_company_user_id": proComUserId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
      //this.proCompanyUser.splice(index + 1, 1);
    }
    this.formArrCompanyUser.removeAt(index);
    this.selectedUser.splice(index + 2, 1);
  }
  get formArrExternalUser() {
    return this.proTeamFormGroup.get('external_user') as FormArray;
  }
  initExternalUser() {
    return this._formBuilder.group({
      project_id: [this.project_id],
      project_ex_user_id: [''],
      ex_membar_name: ['', Validators.required],
      email_id: ['', [Validators.required, Validators.email]],
      company_name: ['', Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern('[6-9]\\d{9}')]],
      external_user_logo: [''],
      project_ex_user_img_id: [''],
    });
  }
  addExternalUser() {
    this.formArrExternalUser.push(this.initExternalUser());
  }
  deleteExternalUser(index: number) {
    let proExUserId = this.formArrExternalUser.value[index].project_ex_user_id;
    if (proExUserId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectTeam",
        "project_ex_user_id": proExUserId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrExternalUser.removeAt(index);
  }
  get formArr() {
    return this.mileStoneFormGroup.get('mile_stone') as FormArray;
  }
  initMileStone() {
    return this._formBuilder.group({
      project_milestone_id: [''],
      milestone_name: ['', Validators.required],
      mile_stone_date: ['', Validators.required],
      description: ['', Validators.required],
      symbol: ['', Validators.required],
    });
  }
  // Project Key Dates
  addMileStone() {
    this.formArr.push(this.initMileStone());
  }
  deleteMileStone(index: number) {
    let proMileId = this.formArr.value[index].project_milestone_id;
    if (proMileId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectKeyDates",
        "project_milestone_id": proMileId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArr.removeAt(index);
  }
  // Majar activity plan
  get formArrMajarActivity() {
    return this.activityFormGroup.get('majar_activity') as FormArray;
  }
  initMajarActivity() {
    return this._formBuilder.group({
      activity_sr_no: ['', Validators.required],
      project_activity_id: [''],
      activity_name: ['', Validators.required],
      milestone_id: [''],
      activity_start_date: ['', Validators.required],
      activity_end_date: ['', Validators.required],
      preceeding_activity: [''],
      next_activity: [''],
      responsibility: ['', Validators.required],
    });
  }
  addMajarActivity() {
    if (this.activityFormGroup.invalid) {
      return;
    } else {
      this.projectActivitySubmit();
      this.activityMinMaxDate.push({ 'startDate': null, 'endDate': null });
      this.formArrMajarActivity.push(this.initMajarActivity());
    }
  }
  deleteMajarActivity(index: number) {
    let proActiviyId = this.formArrMajarActivity.value[index].project_activity_id;
    if (proActiviyId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectActivity",
        "project_activity_id": proActiviyId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrMajarActivity.removeAt(index);
    this.activityMinMaxDate.splice(index, 1);
  }
  // Add sub activity
  get formArrSubActivity() {
    return this.subActivityFormGroup.get('sub_activity') as FormArray;
  }
  initSubActivity() {
    return this._formBuilder.group({
      major_activity_id: ['', Validators.required],
      project_sub_actvity_id: [''],
      sub_activity_name: ['', Validators.required],
      sb_actvity_strt_date: ['', Validators.required],
      sb_actvity_end_date: ['', Validators.required],
    });
  }
  addSubActivity() {
    this.subActivityMinMaxDate.push({ 'startDate': null, 'endDate': null });
    this.formArrSubActivity.push(this.initSubActivity());
  }
  deleteSubActivity(index: number) {
    let proSubActiviyId = this.formArrSubActivity.value[index].project_sub_actvity_id;
    if (proSubActiviyId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "projectSubActivity",
        "project_sub_actvity_id": proSubActiviyId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrSubActivity.removeAt(index);
    this.subActivityMinMaxDate.splice(index, 1);
  }
  // KPI
  get formArrKpiMileStone() {
    return this.kpiFormGroup.get('kpi_mile_stone') as FormArray;
  }
  initKpiMileStone() {
    return this._formBuilder.group({
      project_id: [this.project_id],
      milestone_id: ['', Validators.required],
      kpi_mile_stone_id: [''],
      projct_kpi_dstrbt_vl: ['', Validators.required],
    });
  }
  addKpiMileStone() {
    this.formArrKpiMileStone.push(this.initKpiMileStone());
  }
  deleteKpiMileStone(index: number) {
    let proKpiMileId = this.formArrKpiMileStone.value[index].kpi_mile_stone_id;
    if (proKpiMileId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "kpiProject",
        "kpi_mile_stone_id": proKpiMileId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrKpiMileStone.removeAt(index);
    this.selectedMileStone.splice(index, 1);
  }
  kpiMileStone(event: any, index: number) {
    this.selectedMileStone[index] = event;
  }
  proCompanyUserChange(event: any, index: number) {
    this.selectedProCompanyUser[index] = event;
  }
  // Budget tracking
  get formArrAllocationDept() {
    return this.budgetTrackFormGroup.get('allocation_dept') as FormArray;
  }
  initAllocationDept() {
    return this._formBuilder.group({
      project_id: [this.project_id],
      dept_id: [''],
      project_budget_id: [''], //change
      allocation_dstrbt_vl: [''],
    });
  }
  addAllocationDept() {
    this.formArrAllocationDept.push(this.initAllocationDept());
  }
  deleteAllocationDept(index: number) {
    let proBudgetId = this.formArrAllocationDept.value[index].project_budget_id;
    if (proBudgetId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "budgetTrackProject",
        "project_budget_id": proBudgetId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrAllocationDept.removeAt(index);
    this.selectedAllocationDept.splice(index, 1);
  }
  allocationDept(event: any, index: number) {
    this.selectedAllocationDept[index] = event;
  }

  // getCurrencyfunc() {
  //   let login_access_token = this.currentUser.login_access_token;
  //   this.userService.getCurrency(login_access_token, this.company_id).pipe(first()).subscribe(
  //     (data: any) => {
  //       this.userrolecurrency = data;
  //       console.log("currency", this.userrolecurrency.data);
  //       this.currencygetarray = this.userrolecurrency.data.currency;
  //       this.straObjStatus = this.userrolecurrency.data;

  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }
  projectSubmit() {
    this.submitted = true;
    if (this.proFormGroup.invalid) {
      return;
    }
    //this.proFormGroup.value.project_id = this.project_id;
    if (this.current_project_steps_idtwo == 5) {
      this.proFormGroup.value.project_step_id = this.project_step_id[4];
      // alert("hello-yes");
    }
    else {
      this.proFormGroup.value.project_step_id = this.project_step_id[0];
      // alert("hello-no");
    }
    this.proFormGroup.value.image_id = this.image_id;
    this.proFormGroup.value.start_date = this.datepipe.transform(this.proFormGroup.value.start_date, 'dd-MM-yyyy');
    this.proFormGroup.value.end_date = this.datepipe.transform(this.proFormGroup.value.end_date, 'dd-MM-yyyy');
    this.proFormGroup.value.project_duration = this.projectDuration;
    this.userService.ProjectAdd(this.proFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.project_id = data.data.project_id;
          this.project_name = data.data.project_name;
          this.image_id = data.data.image_id;
          this.proFormGroup.value.project_logo = "";
          this.alertService.success(data.message, true);
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  projectTeamSubmit() {
    this.submitted = true;
    if (this.proTeamFormGroup.invalid) {
      return;
    }
    console.log("hhjjh", this.proTeamFormGroup.value);
    if (this.current_project_steps_idtwo == 5) {
      this.proTeamFormGroup.value.project_step_id = this.project_step_id[4];
      // alert("hello-yes");
    }
    else {
      this.proTeamFormGroup.value.project_step_id = this.project_step_id[1];
      // alert("hello-no");
    }



    this.userService.ProjectAdd(this.proTeamFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.proCompanyUser = data.data;
          let teamData = data.Team_data;
          this.proTeamFormGroup.patchValue({ "project_leader_id": teamData.project_leader_id });
          this.proTeamFormGroup.patchValue({ "pro_leader_logo_id": teamData.pro_leader_logo_id });
          // project co leader
          this.formArrCoLeaderUser.at(0).patchValue({ project_co_leader_id: teamData.pro_co_leader.project_co_leader_id });
          this.formArrCoLeaderUser.at(0).patchValue({ pro_co_leader_logo_id: teamData.pro_co_leader.pro_co_leader_logo_id });
          /*  for (let i = 0; i < teamData.pro_co_leader.length; i++) {
             this.formArrCoLeaderUser.at(i).patchValue({ project_co_leader_id: teamData.pro_co_leader[i].project_co_leader_id });
             this.formArrCoLeaderUser.at(i).patchValue({ pro_co_leader_logo_id: teamData.pro_co_leader[i].pro_co_leader_logo_id });
           } */
          for (let i = 0; i < teamData.company_user.length; i++) {
            this.formArrCompanyUser.at(i).patchValue({ project_company_user_id: teamData.company_user[i].project_company_user_id });
            this.formArrCompanyUser.at(i).patchValue({ company_user_logo_id: teamData.company_user[i].company_user_logo_id });
          }
          for (let i = 0; i < teamData.external_user.length; i++) {
            this.formArrExternalUser.at(i).patchValue({ project_ex_user_id: teamData.external_user[i].project_ex_user_id });
            this.formArrExternalUser.at(i).patchValue({ project_ex_user_img_id: teamData.external_user[i].project_ex_user_img_id });
          }
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  projectMileSubmit() {
    this.submitted = true;
    if (this.mileStoneFormGroup.invalid) {
      return;
    }
    // this.mileStoneFormGroup.value.start_date = this.datepipe.transform(this.mileStoneFormGroup.value.start_date, 'yyyy-MM-dd');
    // this.mileStoneFormGroup.value.end_date = this.datepipe.transform(this.mileStoneFormGroup.value.end_date, 'yyyy-MM-dd');
    this.mileStoneFormGroup.value.project_id = this.project_id;
    if (this.current_project_steps_idtwo == 5) {
      this.mileStoneFormGroup.value.project_step_id = this.project_step_id[4];
      // alert("hello-yes");
    }
    else {
      this.mileStoneFormGroup.value.project_step_id = this.project_step_id[2];
      // alert("hello-no");
    }

    this.mileStoneFormGroup.value.project_step_id = this.project_step_id[2];

    // this.mileStoneFormGroup.value.project_duration = this.projectDuration;
    const mileStoneValues = [...this.mileStoneFormGroup.value.mile_stone];
    const storeMileStone = [];
    mileStoneValues.forEach((formRow) => {
      storeMileStone.push({ project_id: this.project_id, project_milestone_id: formRow.project_milestone_id, milestone_name: formRow.milestone_name, mile_stone_date: this.datepipe.transform(formRow.mile_stone_date, 'dd-MM-yyyy'), description: formRow.description, symbol: formRow.symbol })
    });
    this.mileStoneFormGroup.value.mile_stone = storeMileStone;
    this.userService.ProjectAdd(this.mileStoneFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.mileStoneGet = data.data.mile_stone;
          for (let i = 0; i < this.mileStoneGet.length; i++) {
            this.formArr.at(i).patchValue({ project_milestone_id: this.mileStoneGet[i].project_milestone_id });
          }
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  projectActivitySubmit() {
    this.submitted = true;
    if (this.activityFormGroup.invalid) {
      return;
    }
    this.activityFormGroup.value.project_id = this.project_id;
    const activitValues = [...this.activityFormGroup.value.majar_activity];
    const storeActivit = [];
    activitValues.forEach((formRow) => {
      storeActivit.push({ activity_sr_no: formRow.activity_sr_no + 1, project_activity_id: formRow.project_activity_id, activity_name: formRow.activity_name, milestone_id: formRow.milestone_id, activity_start_date: this.datepipe.transform(formRow.activity_start_date, 'dd-MM-yyyy'), activity_end_date: this.datepipe.transform(formRow.activity_end_date, 'dd-MM-yyyy'), preceeding_activity: formRow.preceeding_activity, next_activity: formRow.next_activity, responsibility: formRow.responsibility, project_id: this.project_id })
    });
    this.activityFormGroup.value.majar_activity = storeActivit;

    this.userService.ProjectAdd(this.activityFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.activityGet = data.data.majar_activity;
          for (let i = 0; i < this.activityGet.length; i++) {
            this.formArrMajarActivity.at(i).patchValue({ project_activity_id: this.activityGet[i].project_activity_id });
          }
        } else {
          this.alertService.error(data.message, true);
        }
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
    const subActivitValues = [...this.subActivityFormGroup.value.sub_activity];
    const storeSubActivit = [];
    subActivitValues.forEach((formRow) => {
      storeSubActivit.push({ major_activity_id: formRow.major_activity_id, project_sub_actvity_id: formRow.project_sub_actvity_id, sub_activity_name: formRow.sub_activity_name, sb_actvity_strt_date: this.datepipe.transform(formRow.sb_actvity_strt_date, 'dd-MM-yyyy'), sb_actvity_end_date: this.datepipe.transform(formRow.sb_actvity_end_date, 'dd-MM-yyyy'), project_id: this.project_id })
    });
    this.subActivityFormGroup.value.sub_activity = storeSubActivit;
    this.userService.ProjectAdd(this.subActivityFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          let activitySubData = data.data.sub_activity;
          for (let i = 0; i < activitySubData.length; i++) {
            this.formArrSubActivity.at(i).patchValue({ project_sub_actvity_id: activitySubData[i].project_sub_actvity_id });
          }
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  kpiSubmit() {
    this.submitted = true;
    if (this.kpiFormGroup.invalid) {
      return;
    }

    this.kpiFormGroup.value.project_id = this.project_id;
    this.userService.ProjectAdd(this.kpiFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          let kpiData = data.data;
          this.kpiFormGroup.patchValue({ "project_kpi_id": kpiData.project_kpi_id });
          for (let i = 0; i < kpiData.kpi_mile_stone.length; i++) {
            this.formArrKpiMileStone.at(i).patchValue({ kpi_mile_stone_id: kpiData.kpi_mile_stone[i].kpi_mile_stone_id });
          }
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  /*   governanceSubmit() {
      this.submitted = true;
      if (this.governanceFormGroup.invalid) {
        return;
      }
      this.governanceFormGroup.value.project_id = this.project_id;
      const memberData = this.governanceFormGroup.value.gov_member;
      let memberList = [];
      for (let i = 0; i < memberData.length; i++) {
        memberList.push({ "project_gov_memebers_id": "", "user_id": memberData[i] })
      }
      this.governanceFormGroup.value.gov_member = memberList;
      this.userService.ProjectAdd(this.governanceFormGroup.value).pipe(first()).subscribe(
        (data: any) => {
          if (data.status_code == 200) {
            this.alertService.success(data.message, true);
            this.governanceFormGroup.patchValue({ "project_gov_id": data.data.project_gov_id });
          } else {
            this.alertService.error(data.message, true);
          }
        },
        error => {
          this.alertService.error(error);
        });
    } */
  budgetTrackSubmit() {
    this.submitted = true;
    if (this.budgetTrackFormGroup.invalid) {
      return;
    }
    this.budgetTrackFormGroup.value.project_id = this.project_id;
    if (this.current_project_steps_idtwo == 5) {
      this.budgetTrackFormGroup.value.project_step_id = this.project_step_id[4];
      // alert("hello-yes");
    }
    else {
      this.budgetTrackFormGroup.value.project_step_id = this.project_step_id[4];
      // alert("hello-No");
    }


    const allocationDeptValues = [...this.budgetTrackFormGroup.value.allocation_dept];
    const allocationDept = [];
    allocationDeptValues.forEach((formRow) => {
      allocationDept.push({ dept_id: formRow.dept_id, project_budget_id: formRow.project_budget_id, allocation_dstrbt_vl: formRow.allocation_dstrbt_vl, project_id: this.project_id })
    });
    this.budgetTrackFormGroup.value.allocation_dept = allocationDept;
    this.userService.ProjectAdd(this.budgetTrackFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.router.navigate(['/apps/dashboards/project']);
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteProSingle(data) {
    this.userService.proDeleteSingle(data).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
        }
        else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.dataCategories = data.data.categories;
        this.dataBusinessInit = data.data.business_initiatives;
      },
      error => {
        this.alertService.error(error);
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
  viewProjects() {
    let unit_id = this.unit_id;
    let selectedYear = this.userSelectedYear;
    console.log(selectedYear);

    let financialYear = this.companyFinancialYear;
    this.userService.ProjectsView(this.login_access_token, unit_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {

        this.viewProjectData = data.data;
        console.log("datta", this.viewProjectData);

      },
      error => {
        this.alertService.error(error);
      });
  }
  getUoM() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getUnitOfMeasurement(login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataUoM = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
}

