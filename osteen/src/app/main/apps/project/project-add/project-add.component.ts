import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatDialog, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'project-add',
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ProjectAddComponent implements OnInit {
  direction = 'row';
  //minDate = new Date();
  minDate = new Date(2020, 0, 1);
  start_date: any;
  end_date: any;
  currentUser: any;
  login_access_token: string;
  company_id: any;
  unit_id: any;
  project_id = null;
  image_id = null;
  project_name: any;
  userModulePermission: any;
  proFilesPermission: any;
  submitted = false;
  dataDepartment: any;
  dataUoM: any;
  dataBusinessInit: any;
  dataCategories: any;
  userListAllData: any;
  isLinear = true;
  project_step_id: number[] = [1, 2, 3, 4, 5];
  //isLinear = false;
  proFormGroup: FormGroup;
  proTeamFormGroup: FormGroup;
  mileStoneFormGroup: FormGroup;
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
  activityMaxDate: any;
  userrolecurrency: any;
  currencygetarray: any;
  straObjStatus: any;
  activityMinMaxDate: any = [{ 'startDate': null, 'endDate': null }];
  subActivityMinMaxDate: any = [{ 'startDate': null, 'endDate': null }];
  @ViewChild('fileInput') el: ElementRef;
  govMetingGet: any;
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
  ];
  selectedSearchUser: any;
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
    private cd: ChangeDetectorRef
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
    /* this.project_id = 185;
    this.proCompanyUser = [{ "user_id": 3, "name": "sotam" },
    { "user_id": 20, "project_company_user_id": 173, "name": "Arpit" },
    { "user_id": 25, "name": "kalpana" },
    { "user_id": 27, "name": "Rajendra Rajput" },
    { "user_id": 29, "name": "Bharat" },
    { "user_id": 37, "name": "jitendra" },
    { "user_id": 28, "name": "ghanshyam" },
    { "user_id": 36, "name": "newtest11" },
    { "user_id": 26, "name": "Test" }
    ] */
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proFilesPermission = this.userModulePermission[i];
      }
    }
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.dummyPicture = "assets/images/avatars/profile.jpg";
    this.userLisetGet();
    this.SelectModuleGet();
    this.getDepartment();
    this.getUoM();
    //this.getCurrencyfunc();
    this.kpiValueError = false;
    this.budgetValueError = false;
    // add project form
    this.proFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [this.login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      project_name: ['', Validators.required],
      department_id: ['', Validators.required],
      project_logo: [''],
      project_id: [''],
      image_id: [''],
      project_mission: ['', Validators.required],
      key_objective: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      projectDetails: ['project'],
    });
    // Project team form
    this.proTeamFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [this.login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      user_id: ['', Validators.required],
      project_leader_id: [''],
      project_leader: [1, Validators.required],
      department_id: ['', Validators.required],
      email: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]\\d{9}')]],
      pro_leader_logo: [''],
      pro_leader_logo_id: [''],
      pro_co_leader: this._formBuilder.array([this.initproCoLeaderUser()]),
      company_user: this._formBuilder.array([this.initCompanyUser()]),
      external_user: this._formBuilder.array([]),
      projectDetails: ['projectTeam'],
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
    // Project key dates form
    this.proTeamFormGroup.controls['email'].disable();
    this.mileStoneFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [this.login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      // start_date: ['', Validators.required],
      // end_date: ['', Validators.required],
      projectDetails: ['projectKeyDates'],
      mile_stone: this._formBuilder.array([this.initMileStone()])
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
    // Governance review meeting form
    this.governanceFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [this.login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      // project_id: this.project_id,
      govMeting: this._formBuilder.array([this.initGovernance()]),
      projectDetails: ['governanceProject'],
    });
    // Budget tracking form
    this.budgetTrackFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [this.login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      total_pro_cost: ['', Validators.required],
      currency: ['', Validators.required],
      allocation_dept: this._formBuilder.array([this.initAllocationDept()]),
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
          this.budgetValueErrorShow = "Allocation to department sub-total not match with total project cost";
        }
        else {
          this.budgetValueError = false;
        }
      }
    });
  }
  mileStoneChange(event: any, index: any) {
    let mileStone;
    mileStone = this.mileStoneGet.filter((val) => {
      return val.project_milestone_id === Number(event);
    });
    this.activityMinMaxDate[index].endDate = moment(mileStone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
  }

  activityChange(event: any, index: any) {
    let activity;
    activity = this.activityGet.filter((val) => {
      return val.project_activity_id === Number(event);
    });
    this.subActivityMinMaxDate[index].startDate = moment(activity[0].activity_start_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    this.subActivityMinMaxDate[index].endDate = moment(activity[0].activity_end_date, "DD-MM-YYYY").format('YYYY-MM-DD');
    return true;
  }
  // calculate project duration start and end date
  calcDateDuration(start, end) {
    console.log("d1", start, "d2", end);
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
    let user_id = event;
    let company_id = this.company_id;
    // this.selectedUser[index] = user_id;
    this.userService.singleUserDetails(this.login_access_token, company_id, user_id).pipe(first()).subscribe(
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
    });
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
  addCompanyUser() {
    this.formArrCompanyUser.push(this.initCompanyUser());
  }
  deleteCompanyUser(index: number) {
    let proComUserId = this.formArrCompanyUser.value[index].project_company_user_id;
    if (proComUserId) {
      const deleteProData = {
        "login_access_token": this.login_access_token,
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
        "login_access_token": this.login_access_token,
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
        "login_access_token": this.login_access_token,
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
  get govMetting() {
    return this.governanceFormGroup.get('govMeting') as FormArray;
  }
  initGovernance() {
    return this._formBuilder.group({
      project_id: [''],
      project_gov_id: [''],
      project_gov_memebers_id: [''],
      meeting_name: ['', Validators.required],
      chair_person: ['', Validators.required],
      co_chair_person: ['', Validators.required],
      gov_member: ['', Validators.required],
      gov_frequency: ['', Validators.required],
      meeting_day: [''],
      meeting_shedule: [''],
      gov_venue: ['', Validators.required],
      gov_duration: ['', Validators.required],
      agenda: ['', Validators.required],
    })
  }
  addGovMeting() {
    this.govMetting.push(this.initGovernance());
  }
  deleteGovMeting(index: number) {
    console.log('hh', index);
    let proGovId = this.govMetting.value[index].project_gov_id;
    let proGovMemebeId = this.govMetting.value[index].project_gov_memebers_id;
    if (proGovId) {
      const deleteProData = {
        "login_access_token": this.login_access_token,
        "project_id": this.project_id,
        "projectDetails": "governanceProject",
        "project_gov_id": proGovId,
        "project_gov_memebers_id": proGovMemebeId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.govMetting.removeAt(index);
  }
  proCompanyUserChange(event: any, index: number) {
    this.selectedProCompanyUser[index] = event;
    //console.log('user', this.selectedProCompanyUser);
  }
  governanceSubmit() {
    this.submitted = true;
    if (this.governanceFormGroup.invalid) {
      return;
    }
    this.governanceFormGroup.value.project_id = this.project_id;
    this.governanceFormGroup.value.project_step_id = this.project_step_id[3];
    const formValues = [...this.governanceFormGroup.value.govMeting];
    for (let i = 0; i < formValues.length; i++) {
      console.log('aaaa', formValues[i].gov_member);
      formValues[i].gov_member = formValues[i].gov_member.join(',');
      console.log('bbbbb', formValues[i].gov_member);
      formValues[i].project_id = this.project_id;
    }
    this.governanceFormGroup.value.govMeting = formValues;
    this.userService.ProjectAdd(this.governanceFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        //console.log("what data comes", data);
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.governanceFormGroup.patchValue({ "project_gov_id": data.data.project_gov_id });
          this.govMetingGet = data.data.govMeting;
          for (let i = 0; i < this.govMetingGet.length; i++) {
            this.govMetting.at(i).patchValue({ project_id: this.govMetingGet[i].project_id });
            this.govMetting.at(i).patchValue({ project_gov_id: this.govMetingGet[i].project_gov_id });
            this.govMetting.at(i).patchValue({ project_gov_memebers_id: this.govMetingGet[i].project_gov_memebers_id });
            this.govMetting.at(i).patchValue({ chair_person: this.govMetingGet[i].chair_person });
            this.govMetting.at(i).patchValue({ co_chair_person: this.govMetingGet[i].co_chair_person });
            this.govMetting.at(i).patchValue({ gov_member: this.govMetingGet[i].gov_member });
            this.govMetting.at(i).patchValue({ gov_frequency: this.govMetingGet[i].gov_frequency });
            this.govMetting.at(i).patchValue({ meeting_day: this.govMetingGet[i].meeting_day });
            this.govMetting.at(i).patchValue({ meeting_shedule: this.govMetingGet[i].meeting_shedule });
            this.govMetting.at(i).patchValue({ gov_venue: this.govMetingGet[i].gov_venue });
            this.govMetting.at(i).patchValue({ gov_duration: this.govMetingGet[i].gov_duration });
            this.govMetting.at(i).patchValue({ agenda: this.govMetingGet[i].agenda });

          }
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  // Budget tracking
  get formArrAllocationDept() {
    return this.budgetTrackFormGroup.get('allocation_dept') as FormArray;
  }
  initAllocationDept() {
    return this._formBuilder.group({
      dept_id: ['', Validators.required],
      project_budget_id: [''],
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
        "login_access_token": this.login_access_token,
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
  projectSubmit() {
    this.submitted = true;
    if (this.proFormGroup.invalid) {
      return;
    }
    this.proFormGroup.value.project_step_id = this.project_step_id[0];
    this.proFormGroup.value.project_id = this.project_id;
    this.proFormGroup.value.image_id = this.image_id;
    this.proFormGroup.value.start_date = this.datepipe.transform(this.proFormGroup.value.start_date, 'dd-MM-yyyy');
    this.proFormGroup.value.end_date = this.datepipe.transform(this.proFormGroup.value.end_date, 'dd-MM-yyyy');
    this.proFormGroup.value.project_duration = this.projectDuration;
    // console.log(this.proFormGroup);
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
    console.log('aADaDAd', this.proTeamFormGroup.value);
    // return;
    this.proTeamFormGroup.value.project_id = this.project_id;
    this.proTeamFormGroup.value.project_step_id = this.project_step_id[1];
    this.userService.ProjectAdd(this.proTeamFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.proCompanyUser = data.data;
          console.log('gov', this.proCompanyUser)
          let teamData = data.Team_data;
          this.proTeamFormGroup.patchValue({ "project_leader_id": teamData.project_leader_id });
          this.proTeamFormGroup.patchValue({ "pro_leader_logo_id": teamData.pro_leader_logo_id });
          // project co leader
          this.formArrCoLeaderUser.at(0).patchValue({ project_co_leader_id: teamData.pro_co_leader.project_co_leader_id });
          this.formArrCoLeaderUser.at(0).patchValue({ pro_co_leader_logo_id: teamData.pro_co_leader.pro_co_leader_logo_id });
          /* for (let i = 0; i < teamData.pro_co_leader.length; i++) {
            this.formArrCoLeaderUser.at(i).patchValue({ project_co_leader_id: teamData.pro_co_leader[i].project_co_leader_id });
            this.formArrCoLeaderUser.at(i).patchValue({ pro_co_leader_logo_id: teamData.pro_co_leader[i].pro_co_leader_logo_id });
          } */
          // company membar
          for (let i = 0; i < teamData.company_user.length; i++) {
            this.formArrCompanyUser.at(i).patchValue({ project_company_user_id: teamData.company_user[i].project_company_user_id });
            this.formArrCompanyUser.at(i).patchValue({ company_user_logo_id: teamData.company_user[i].company_user_logo_id });
          }
          // external membar
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
    this.mileStoneFormGroup.value.project_step_id = this.project_step_id[2];
    this.mileStoneFormGroup.value.project_id = this.project_id;
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

  isPartOfGovernance(userid: number) {
    return this.govMetting.value.filter((gov) => gov.gov_member == userid).length > 0;
  }
  budgetTrackSubmit() {
    this.submitted = true;
    if (this.budgetTrackFormGroup.invalid) {
      return;
    }
    this.budgetTrackFormGroup.value.project_id = this.project_id;
    this.budgetTrackFormGroup.value.project_step_id = this.project_step_id[4];
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
    let role_id = this.currentUser.role_id;
    let company_id = this.company_id;
    this.userService.getAllUserList(this.login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
        this.selectedSearchUser = this.userListAllData;
      },
      error => {
        this.alertService.error(error);
      });
  }
  companyUserSearch(value) {
    this.selectedSearchUser = this.searchCompanyUser(value);
  }
  // Filter the user list and send back to populate the selectedSearchUser**
  searchCompanyUser(value: string) {
    let filter = value.toLowerCase();
    return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
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
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(this.login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  getUoM() {
    this.userService.getUnitOfMeasurement(this.login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataUoM = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
}

