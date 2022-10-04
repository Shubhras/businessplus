import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { FuseConfigService } from '@fuse/services/config.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription, pipe, Subject } from 'rxjs';
import { AlertService, AuthenticationService, UserService } from '../_services';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { log } from 'console';
import { load } from 'gantt';
import { AddSectionDialog } from '../module-roles/section-change/addsection.component';
import { every } from 'lodash';
import { AddSectionUnitDialog } from './addsectionunit.component';

@Component({
  selector: 'app-first-plan-setup',
  templateUrl: './first-plan-setup.component.html',
  styleUrls: ['./first-plan-setup.component.scss']
})
export class FirstPlanSetupComponent implements OnInit {
  total_objectives: any;

  // SO
  AddStraForm: FormGroup;
  start_date: any;
  end_date: any;
  dataDepartment: any;
  dataunitOfMeasur: any;
  direction = "row";
  multi_dept = true;
  dataAllDepartment: any;
  minStrDate = new Date(2020, 0, 1);
  //Initiative
  showIS: any;
  addInitiaForm: FormGroup;
  getStrOjeData: any;
  deptStrObjDisable: any;
  status_code: any;
  MessageSuccess: any;
  MessageError: any;
  dataStraObj: any;
  start_date2: any;
  end_date2: any;
  minStartDate: any;
  maxStartDate: any;
  minStartDate3: any;
  maxStartDate3: any;
  showStrdate = false;
  datepickerDisable: any;
  date = false;
  userSections: any;
  dataSections: any;

  //Action plan
  addActionForm: FormGroup;
  reminder_date: any;
  currentYear: number;
  getInitData: any;
  dataActionOwner: any;
  dataActionOwnername: any;
  dataInitiatives: any;
  testt = false;
  start_date3: any;
  end_date3: any;
  minStartDate2: Date;
  maxStartDate2: Date;
  showActionDate1: any;
  showActionDate2: any;
  displayActDate = false;
  //KPI
  kpiFromShow: any;
  addKpiPlus: any;
  addKpiMinus: any;
  kpiData: any;
  kpiDataList: any;
  //
  displayIniDate = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  step_data: any;
  user_id: any;
  userName: any;

  isEditable1 = false;
  isEditable2 = false;
  isEditable3 = false;
  // done = false;
  isfiled = false;
  isfiled2 = false;
  isfiled3 = false;

  public shouldShow1 = true;
  public shouldShow = true;
  public shouldlockedShow = true;
  isEditable = true;
  currentUser: any;
  login_access_token: any;
  unit_id: any;
  company_id: any;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  currentYearSubscription: Subscription;
  completed = true;
  objectives_stepsinfo: any;
  strategic_objectivesinfo: any;
  initiativesinfo: any;
  action_plansinfo: any;
  // minStartDate2: Date;
  // maxStartDate2: Date;
  submitted = false;
  sectionAllData: any;
  showInitiativeDate1: any;
  showInitiativeDate2: any;
  addsectionPlus = true;
  addsectionMinus: boolean;
  sectiongetdata: any;
  SODATA: any;
  userInactive: Subject<any> = new Subject();

  s_dept_id: number;
  dataUnitService: any;
  userActivity: NodeJS.Timer;
  constructor(
    public datepipe: DatePipe, private router: Router, private alertService: AlertService, private userService: UserService, private dataYearService: DataYearService, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any, private _formBuilder: FormBuilder, private _fuseConfigService: FuseConfigService,
    private authenticationService: AuthenticationService,
    ) {
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: false
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
 

  }


  ngOnInit() {
    this.sectiongetdata = this.data;
    // console.log(this.sectiongetdata);
    this.deptStrObjDisable = false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.userName = this.currentUser.data.name;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    this.getStrOjeData = this.strategic_objectivesinfo;
    // console.log("soData", this.getStrOjeData);

    //KPI 
    this.kpiFromShow = false;
    this.addKpiPlus = true;
    this.addKpiMinus = false;
    // Reactive Form
    this.AddStraForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],
      target: ['', Validators.required],
      unit_of_measurement: ['', Validators.required], //Validators.required
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      user_id: [this.user_id, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      department_id: ['', Validators.required],
      //tracking_frequency: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.getObjectivesSteps();
    this.userService.objectivesStepsGet(this.unit_id, this.company_id, this.user_id).pipe(first()).subscribe(
      (data: any) => {
        this.SODATA = data.data.strategic_objectivesinfo;
        this.s_dept_id = this.SODATA.department_id
        // console.log("this.s_dept_id", this.s_dept_id);
      });



    // Reactive Form
    this.addInitiaForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],
      user_id: [this.user_id, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      dept_id: ['', Validators.required],
      s_o_id: ['', Validators.required],
      definition: ['', Validators.required],
      section_id: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
    this.getDepartment();
    this.showIS = false;
    this.unitOfMeasurementGet();
    this.currentYear = new Date().getFullYear();
    // add Initive from strategic objective page

    // console.log('Strategic data', this.getStrOjeData);
    if (this.getStrOjeData) {
      // this.deptStrObjDisable = true;

      this.strategicObjGet(this.getStrOjeData.department_id);
      this.sectionGet(this.getStrOjeData.department_id);
      //this.mainMaxDtaeStrObj(this.getStrOjeData.strategic_objectives_id);
      let startDate = this.getStrOjeData.start_date;
      this.minStartDate = new Date(startDate);
      let endDate = this.getStrOjeData.end_date;
      this.maxStartDate = new Date(endDate); //yy-mm-dd
      this.datepickerDisable = false;
      this.showInitiativeDate1 = this.minStartDate;
      this.showInitiativeDate2 = this.maxStartDate;
    }
    // Reactive Form

    this.addActionForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],

      company_id: [this.company_id, Validators.required],
      user_id: [this.user_id, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      dept_id: ['', Validators.required],
      s_o_id: ['', Validators.required],
      initiatives_id: ['', Validators.required],
      kpi_id: [''],
      definition: ['', Validators.required],
      target: ['', Validators.required],
      co_owner: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      reminder_date: ['', Validators.required],
      control_point: ['', Validators.required],
      status: ['Blue'],
      kpiFromData: this._formBuilder.array([this.createItem()])
    });

    // add action plan from Initive page
    if (this.getInitData) {
      // this.deptStrIniDisable = true;
      //hello
      if (this.total_objectives.initiatives.total > 0) {
        // this.addActionForm.patchValue({ dept_id: this.getInitData.dept_id });
        // this.addActionForm.patchValue({ s_o_id: this.getInitData.s_o_id });
        // this.addActionForm.patchValue({ initiatives_id: this.getInitData.initiatives_id });
        this.strategicObjGet(this.getInitData.dept_id);
        this.SelectModuleGet(this.getInitData.dept_id);
        this.mainMaxDtaeInit(this.getInitData.initiatives_id);
        this.kpiGet(this.getInitData.dept_id);
        this.sectionGet(this.getInitData.dept_id);
        this.initiativesGet(this.getInitData.s_o_id);

        let startDate = this.initiativesinfo.start_date;
        this.minStartDate2 = new Date(startDate);
        let endDate = this.initiativesinfo.end_date;
        this.maxStartDate2 = new Date(endDate); //yy-mm-dd
        this.datepickerDisable = false;
        this.showActionDate(this.minStartDate2, this.maxStartDate2);
      }
    }
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;

      // this.step_data = JSON.parse(localStorage.getItem('Steps') || "{}");
      this.viewStrategicDashboard();

    });
  }


  // callnext() {
  //   this.isfiled = true;
  // }
  // callnext2() {
  //   this.isfiled2 = true;
  // }
  //   callnext3(){
  //     this.isfiled3 = true;
  // }

  AddStrategicSubmit() {
    let steps = [
      {
        step_id: 1,
        step_name: "strategic",
        unit_id: this.unit_id,
        company_id: this.company_id,
        user_id: this.user_id,
      }
    ];
    if (this.total_objectives.strategic_objectives.total > 0) {

      let EditStraForm = this.AddStraForm.value;
      EditStraForm['strategic_objectives_id'] = this.strategic_objectivesinfo.id;
      EditStraForm['comment'] = "hh";
      EditStraForm['status'] = this.strategic_objectivesinfo.status;
      // EditStraForm['unit_of_measurement'] = this.strategic_objectivesinfo.unit_of_measurement;
      let so_start_date = this.datepipe.transform(EditStraForm['start_date'], 'dd-MM-yyyy');
      let so_end_date = this.datepipe.transform(EditStraForm['end_date'], 'dd-MM-yyyy');
      EditStraForm['start_date'] = so_start_date;
      EditStraForm['end_date'] = so_end_date;
      console.log('iiiiii', EditStraForm);

      this.userService.StrategicEditSubmit(EditStraForm).pipe(first()).subscribe(
        (data: any) => {
          this.status_code = data;
          if (this.status_code.status_code == 200) {
            this.MessageSuccess = data;
            this.isfiled = true;
            this.getObjectivesSteps();
            this.viewStrategicDashboard();
            this.mainMaxDtaeStrObj(EditStraForm['strategic_objectives_id']);
            this.alertService.success(this.MessageSuccess.message, true);
          }
          else {
            this.MessageError = data;
            this.alertService.error(this.MessageError.message, true);
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
    else {
      console.log('Stratgic obj form: ', this.AddStraForm.value);

      // stop here if AddStraForm is invalid    
      if (this.AddStraForm.invalid) {
        return;
      }
      let latest_start_date = this.datepipe.transform(this.start_date, 'dd-MM-yyyy');
      let latest_end_date = this.datepipe.transform(this.end_date, 'dd-MM-yyyy');
      this.AddStraForm.value.start_date = latest_start_date;
      this.AddStraForm.value.end_date = latest_end_date;
      this.userService.strategicAddSubmit(this.AddStraForm.value).pipe(first()).subscribe(
        (data: any) => {
          if (data.status_code == 200) {
            this.isfiled = true;
            this.alertService.success(data.message, true);
            // Add objective step
            this.AddObjectiveStep(steps[0]);
            this.getObjectivesSteps();
            this.viewStrategicDashboard();
            // window.location.reload();
          }
          else {
            this.alertService.error(data.message, true);
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
  }
  AddObjectiveStep(data: any) {
    let tt = [];
    tt[0] = data;
    console.log("AddObjectiveStep", tt[0]);

    this.userService.objectivesStepsAdd(tt[0]).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.viewStrategicDashboard();
          this.getObjectivesSteps();
        }
        else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });

  }
  getObjectivesSteps() {
    let unit_id = this.unit_id;
    let company_id = this.company_id;
    let user_id = this.user_id;

    console.log('userId', this.user_id);
    this.userService.objectivesStepsGet(unit_id, company_id, user_id).pipe(first()).subscribe(
      (data: any) => {
        // this.step_data = data;

        this.objectives_stepsinfo = data.data.objectives_stepsinfo;
        this.strategic_objectivesinfo = data.data.strategic_objectivesinfo;
        this.getStrOjeData = this.strategic_objectivesinfo;
        this.initiativesinfo = data.data.initiativesinfo;
        this.action_plansinfo = data.data.action_plansinfo;
        //this.dataAllDepartment= data.data.department_masters;

        console.log('dattttt', this.objectives_stepsinfo);
        console.log('strategic_objectivesinfo', this.strategic_objectivesinfo);
        console.log('initiativesinfo', this.initiativesinfo);
        console.log('action_plansinfo', this.action_plansinfo);
        // console.log('dataAllDepartment', this.dataAllDepartment);

        if (this.objectives_stepsinfo[0].step_id == 1) {
          //Set SO data
          this.AddStraForm.patchValue({ description: this.strategic_objectivesinfo.description });
          this.AddStraForm.patchValue({ target: this.strategic_objectivesinfo.target });
          this.AddStraForm.patchValue({ start_date: this.strategic_objectivesinfo.start_date });
          this.AddStraForm.patchValue({ end_date: this.strategic_objectivesinfo.end_date });

          this.AddStraForm.patchValue({ unit_of_measurement: this.strategic_objectivesinfo.unit_of_measurement });
          this.getDepartment();
          this.AddStraForm.patchValue({ department_id: this.strategic_objectivesinfo.department_id });
        }
        if (this.objectives_stepsinfo[0].step_id == 2) {

          //Set Initiative data                  
          this.strategicObjGet(this.initiativesinfo.dept_id);
          this.sectionGet(this.initiativesinfo.dept_id);
         
          this.addInitiaForm.patchValue({ s_o_id: this.initiativesinfo.s_o_id });
          this.getDepartment();
          this.addInitiaForm.patchValue({ dept_id: this.initiativesinfo.dept_id });
          this.addInitiaForm.patchValue({ definition: this.initiativesinfo.definition });
          this.addInitiaForm.patchValue({ start_date: this.initiativesinfo.start_date });
          this.addInitiaForm.patchValue({ end_date: this.initiativesinfo.end_date });
          this.sectionChangeGet();
          this.addInitiaForm.patchValue({ section_id: this.initiativesinfo.section_id });
          // console.log('ssssss', this.initiativesinfo);
          // console.log('kkkkk', this.initiativesinfo.end_date);


          //Set SO data
          this.AddStraForm.patchValue({ description: this.strategic_objectivesinfo.description });
          this.AddStraForm.patchValue({ target: this.strategic_objectivesinfo.target });
          // console.log('strategic_objectivesinfoooo', this.strategic_objectivesinfo);
          this.AddStraForm.patchValue({ start_date: this.strategic_objectivesinfo.start_date });
          this.AddStraForm.patchValue({ end_date: this.strategic_objectivesinfo.end_date });
          this.AddStraForm.patchValue({ unit_of_measurement: this.strategic_objectivesinfo.unit_of_measurement });
          this.AddStraForm.patchValue({ department_id: this.strategic_objectivesinfo.department_id });
        }
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
    // console.log('kkkkkkkk', unit_id, dept_id);
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
        // console.log('alldataDepartment', this.dataDepartment);
      },
      error => {
        this.alertService.error(error);
      });
  }

  unitOfMeasurementGet() {
    let login_access_token = this.login_access_token;
    this.userService.getUnitOfMeasurement(login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataunitOfMeasur = data.data;
        // console.log('UOM', this.dataunitOfMeasur);
      },
      error => {
        this.alertService.error(error);
      });
  }

  addInitiative() {
    // stop here if addInitiaForm is invalid
    if (this.addInitiaForm.invalid) {
      return;
    }
    let steps = [
      {
        step_id: 2,
        step_name: "initiative",
        unit_id: this.unit_id,
        company_id: this.company_id,
        user_id: this.user_id,
      }
    ];

    if (this.total_objectives.initiatives.total > 0) {

      let editInitiaForm = this.addInitiaForm.value;
      editInitiaForm['initiatives_id'] = this.initiativesinfo.id;
      editInitiaForm['comment'] = "hh";
      editInitiaForm['status'] = this.initiativesinfo.status;

      let i_start_date = this.datepipe.transform(editInitiaForm['start_date'], 'dd-MM-yyyy');
      let i_end_date = this.datepipe.transform(editInitiaForm['end_date'], 'dd-MM-yyyy');
      editInitiaForm['start_date'] = i_start_date;
      editInitiaForm['end_date'] = i_end_date;


      this.userService.initiativeEdit(editInitiaForm).pipe(first()).subscribe(data => {
        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.getObjectivesSteps();
          this.viewStrategicDashboard();
        }
        else {
          this.MessageError = data;
          this.alertService.error(this.MessageError.message, true);
        }
      },
        error => {
          this.alertService.error(error);
        });

    }
    else {

      // console.log('this.addInitiaForm.value', this.addInitiaForm.value);

      let latest_start_date = this.datepipe.transform(this.start_date2, 'dd-MM-yyyy');
      let latest_end_date = this.datepipe.transform(this.end_date2, 'dd-MM-yyyy');
      this.addInitiaForm.value.start_date = latest_start_date;
      this.addInitiaForm.value.end_date = latest_end_date;
      this.userService.initiativeAdd(this.addInitiaForm.value).pipe(first()).subscribe(
        (data: any) => {
          this.status_code = data;
          // console.log(data);

          if (this.status_code.status_code == 200) {
            this.isfiled2 = true;
            this.MessageSuccess = data;
            this.alertService.success(this.MessageSuccess.message, true);
            this.AddObjectiveStep(steps[0]);
            this.getObjectivesSteps();
            this.viewStrategicDashboard();
            // window.location.reload();
          }
          else {
            this.MessageError = data;
            this.alertService.error(this.MessageError.message, true);
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
  }

  strategicObjGet(event: any) {
    // if(event){
    //   this.showStrdate = true;
    // }
    let login_access_token = this.login_access_token;
    this.SelectModuleGet(event);
    let unit_id = this.unit_id;
    let dept_id = event;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.getStrategicObj(login_access_token, unit_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.dataStraObj = data.data.strategic_objectives;
        // console.log("strategicssss", this.dataStraObj);
        this.mainMaxDtaeStrObj(this.getStrOjeData.id);
      },
      error => {
        this.alertService.error(error);
      });
  }

  mainMaxDtaeStrObj(event: any) {
    this.date = true;
    this.start_date = '';
    this.end_date = '';
    const strObj = this.dataStraObj.filter((strObj) => {
      return strObj.id === Number(event);
    });
    // let startDate = strObj[0].start_date.replace(/\-/gi, ",");
    let startDate = strObj[0].start_date;

    this.start_date = strObj[0].start_date;
    // console.log("strategic", this.start_date);
    this.minStartDate = new Date(startDate);
    // console.log("strategic", this.dataStraObj);
    // console.log("minStartDate", this.minStartDate);
    // let endDate = strObj[0].end_date.replace(/\-/gi, ",");
    let endDate = strObj[0].end_date;

    this.end_date = strObj[0].end_date;
    // console.log("strategic", this.end_date);
    this.maxStartDate = new Date(endDate); //yy-mm-dd
    // console.log("maxStartDate", this.maxStartDate);
    this.datepickerDisable = false;
    this.displayIniDate = true;
    this.showInitiativeDate(this.minStartDate, this.maxStartDate);
  }

  sectionGet(event: any) {
    if (event) {
      this.displayIniDate = false;
      // this.displayActDate = false;
    }
    let dept_id = event;
    if (event != this.strategic_objectivesinfo.department_id) {
      alert("There is no Strategic Objects, please select another department");
    }
    this.userService.getSectionDepartment(dept_id, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userSections = data;
        // console.log('All Sections', data);

        this.dataSections = this.userSections.data.sections;
        //this.dataSections = [...this.dataSections, { 'id': 0, 'section_name': "Not Applicable" }]
        //this.dataSections = this.dataSections.slice(1, 0, { 'id': 0, 'section_name': "Not Applicable" })
        this.dataSections.unshift({ 'id': 0, 'section_name': "Not Applicable" });
        // console.log("datasection", this.dataSections);
      },
      error => {
        this.alertService.error(error);
      });
  }
  // add section
  addSectionShow() {
    // this.SectionFromShow = true;
    this.addsectionPlus = false;
    this.addsectionMinus = true;
    const dialogRef = this.dialog.open(AddSectionUnitDialog);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
      // console.log("popdata", result);
      this.addsectionPlus = true;
      this.viewStrategicDashboard();

      this.addsectionMinus = false;

      if (result == "YesSubmit") {
        // console.log("popdata", result);

        this.addsectionPlus = true;
        this.addsectionMinus = false;
        // this.sectionChangeGet();
        // console.log("sodeptidd", this.strategic_objectivesinfo.department_id);

        this.sectionGet(this.strategic_objectivesinfo.department_id);
        this.getObjectivesSteps();
        // this.ViewTasks();
        // this.totalTaskDataGet();
      }
    });
  }
  numberValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addActionPlan() {
    if (this.kpiFromShow == false) {
      this.addActionForm.removeControl('kpiFromData');
    }
    this.submitted = true;
    // stop here if addActionForm is invalid
    if (this.addActionForm.invalid) {
      // console.log('Invalid form: ', this.addActionForm.value);
      // console.log("STARTDATE", this.start_date);
      return;
    }
    // if (this.addActionForm.valid) {
    //   console.log('valid form: ',this.addActionForm.value);

    //   return;
    //  }


    if (this.addActionForm.value.kpi_id == "") {
      this.addActionForm.value.kpi_id = [];
    }
    // console.log("STARTDATE", this.start_date3);

    let latest_start_date = this.datepipe.transform(this.start_date3, 'dd/MM/yyyy');
    let latest_end_date = this.datepipe.transform(this.end_date3, 'dd/MM/yyyy');
    let latest_reminder_date = this.datepipe.transform(this.reminder_date, 'dd/MM/yyyy');
    this.addActionForm.value.start_date = latest_start_date;
    this.addActionForm.value.end_date = latest_end_date;
    this.addActionForm.value.reminder_date = latest_reminder_date;
    let dataFromKPI;
    if (this.kpiFromShow == true) {
      this.addActionForm.value.kpiFromData[0].department_id = this.addActionForm.value.dept_id;
      dataFromKPI = this.addActionForm.value.kpiFromData[0];
    }
    else {
      dataFromKPI = '';
    }
    let allDataFrom = {
      "login_access_token": this.login_access_token,
      "company_id": this.company_id,
      "user_id": this.user_id,
      "unit_id": this.unit_id,
      "actionData": this.addActionForm.value,
      "kpData": dataFromKPI,
    }
    this.userService.addActionPlans(allDataFrom).pipe(first()).subscribe(
      (data: any) => {
        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.isfiled3 = true;
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.welcome_screen();
        }
        else {
          this.MessageError = data;
          this.alertService.error(this.MessageError.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

  showInitiativeDate(s1: any, s2: any) {
    let t = this.datepipe.transform(s1, 'dd-MM-yyyy');
    let t1 = this.datepipe.transform(s2, 'dd-MM-yyyy');
    this.showInitiativeDate1 = t;
    this.showInitiativeDate2 = t1;
  }

  showActionDate(s1: any, s2: any) {
    let t = this.datepipe.transform(s1, 'dd-MM-yyyy');
    let t1 = this.datepipe.transform(s2, 'dd-MM-yyyy');
    this.showActionDate1 = t;
    this.showActionDate2 = t1;
  }

  welcome_screen() {
    this.router.navigate(['/apps/welcome-screen']);
  }

  createItem(): FormGroup {
    let start_date;
    let end_date
    //start_date = this.datepipe.transform(new Date(), 'dd-MM-yyyy');
    start_date = "01-01-2020";
    if (this.companyFinancialYear == "april-march") {
      end_date = '31-03-' + (this.currentYear + 1);
    } else {
      end_date = '31-12-' + (this.currentYear);
    }
    return this._formBuilder.group({
      login_access_token: [this.currentUser.login_access_token],
      user_id: [this.user_id],
      unit_id: [this.unit_id],
      department_id: [''],
      section_id: ['', Validators.required],
      kpi_name: ['', Validators.required],
      kpi_definition: ['', Validators.required],
      ideal_trend: ['', Validators.required],
      unit_of_measurement: ['', Validators.required],
      target_condition: ['', Validators.required],
      lead_kpi: ['', Validators.required],
      kpi_performance: ['', Validators.required],
      frequency: ['', Validators.required],
      target_year: [this.currentYear],
      start_date: [start_date],
      end_date: [end_date],
      jan: [null],
      feb: [null],
      mar: [null],
      apr: [null],
      may: [null],
      jun: [null],
      jul: [null],
      aug: [null],
      sep: [null],
      oct: [null],
      nov: [null],
      dec: [null],
    });
  }
  addKpiShow() {
    this.kpiFromShow = true;
    this.addKpiPlus = false;
    this.addKpiMinus = true;
  }
  addKpiHide() {
    this.kpiFromShow = false;
    this.addKpiPlus = true;
    this.addKpiMinus = false;
  }
  sectionChangeGet() {
    this.userService.getSectionChange(this.login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.sectionAllData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  initiativesGet(event: any) {
    // if(event){
    //   this.displayActDate = false;
    // }
    let unit_id = this.unit_id;
    let s_o_id = event;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.getInitiatives(this.login_access_token, unit_id, s_o_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.dataInitiatives = data.data.initiatives;
        // console.log("initeiveiat", this.dataInitiatives);
        this.mainMaxDtaeInit(this.dataInitiatives.id);
        // this.mainMaxDtaeInit(this.getInitData.initiatives_id);
      },
      error => {
        this.alertService.error(error);
      });
  }
  mainMaxDtaeInit(event: any) {
    this.start_date2 = '';
    this.end_date2 = '';
    const Initiative = this.dataInitiatives.filter((Initiative) => {
      return Initiative.id === Number(event);
    });

    this.testt = true;
    // let startDate = Initiative[0].start_date.replace(/\-/gi, ",");
    let startDate = Initiative[0].start_date;
    this.start_date2 = Initiative[0].start_date;
    // console.log("start", this.start_date2);
    this.minStartDate3 = new Date(startDate);
    // let endDate = Initiative[0].end_date.replace(/\-/gi, ",");
    let endDate = Initiative[0].end_date;
    this.end_date2 = Initiative[0].end_date;
    // console.log("dat", this.end_date2);

    this.maxStartDate3 = new Date(endDate); //yy-mm-dd
    // this.datepickerDisable = false;
    this.displayActDate = true;
    this.showActionDate(this.minStartDate3, this.maxStartDate3);
  }
  SelectModuleGet(event: any) {
    let login_access_token = this.login_access_token;
    // console.log("department wise");

    let unit_id = this.unit_id;
    let company_id = this.company_id;
    let dept_id = event;

    this.userService.getdepartmentUser(login_access_token, unit_id, company_id, dept_id).pipe(first()).subscribe((data: any) => {
      this.dataActionOwner = data.data;
      // console.log("user-order", this.dataActionOwner)
    },
      error => {
        this.alertService.error(error);
      });
  }

  kpiGet(event: any) {
    let unit_id = this.unit_id;
    let dept_id = event;
    this.userService.getKpi(this.login_access_token, unit_id, dept_id).pipe(first()).subscribe(
      data => {
        this.kpiData = data;
        this.kpiDataList = this.kpiData.data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  test() {
    // alert('Please add Strategic Objective or Initiative');
  }

  viewStrategicDashboard() {
    let login_access_token = this.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    // console.log('dept_id', dept_id);

    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strategicDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        let stralldata = data.data;
        this.total_objectives = data.data;
        // console.log('hhhhK', this.total_objectives);

        // const TOTALSTRDATA: PeriodicElementSIA[] = [];
        const objectivesTotal = {
          name_StrInitia: 'Strategic Objectives',
          total: stralldata.strategic_objectives.total,
          green: stralldata.strategic_objectives.green,
          yellow: stralldata.strategic_objectives.yellow,
          red: stralldata.strategic_objectives.red,
          blue: stralldata.strategic_objectives.blue,
          gray: stralldata.strategic_objectives.gray
        };

        const initiativesTotal = {
          name_StrInitia: 'Initiatives',
          total: stralldata.initiatives.total,
          green: stralldata.initiatives.green,
          yellow: stralldata.initiatives.yellow,
          red: stralldata.initiatives.red,
          blue: stralldata.initiatives.blue,
          gray: stralldata.initiatives.gray
        }
        const actionPlanTotal = {
          name_StrInitia: 'Action Plan',
          total: stralldata.action_plans.total,
          green: stralldata.action_plans.green,
          yellow: stralldata.action_plans.yellow,
          red: stralldata.action_plans.red,
          blue: stralldata.action_plans.blue,
          gray: stralldata.action_plans.gray
        }
        if (stralldata.strategic_objectives.total > 0) {
          this.multi_dept = false;
          // console.log('strategic_objectivesinfo', this.strategic_objectivesinfo);

          this.isfiled = true;
        }
        if (stralldata.initiatives.total > 0) {
          this.isfiled2 = true;
          // this.showIS = true;
        }
        if (this.total_objectives.initiatives.total == 0) {
          this.addInitiaForm.patchValue({ dept_id: this.strategic_objectivesinfo.department_id });
          this.strategicObjGet(this.strategic_objectivesinfo.department_id);
          this.addInitiaForm.patchValue({ s_o_id: this.strategic_objectivesinfo.id });
          this.sectionGet(this.strategic_objectivesinfo.department_id);

        }
        if (this.total_objectives.action_plans.total == 0) {
          this.addActionForm.patchValue({ dept_id: this.initiativesinfo.dept_id });
          this.addActionForm.patchValue({ s_o_id: this.initiativesinfo.s_o_id });
          this.getIntData(this.initiativesinfo.s_o_id);
          this.displayActDate = true;
        }
        // if (stralldata.ac.total > 0) {
        //   this.isfiled3 = true;
        //   // this.showIS = true;
        // }
      },
      error => {
        this.alertService.error(error);
      });
  }
  getIntData(event: any) {

    let unit_id = this.unit_id;
    let s_o_id = event;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.getInitiatives(this.login_access_token, unit_id, s_o_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.dataInitiatives = data.data.initiatives;
        this.addActionForm.patchValue({ initiatives_id: this.dataInitiatives[0].id });

        this.showActionDate1 = this.dataInitiatives[0].start_date;
        this.showActionDate2 = this.dataInitiatives[0].end_date;
        this.minStartDate3 = this.showActionDate1;
        this.maxStartDate3 = this.showActionDate2;
      },
      error => {
        this.alertService.error(error);
      });
  }
}