import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'add-hoshin',
  templateUrl: 'addhoshin.component.html',
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class AddHoshin {
  direction = 'row';
  currentUser: any;
  unit_id: any;
  LoginUserDetails: any;
  addMatrixForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  dataActionOwner: any;
  dataInitiatives: any;
  actionPlansData: any;
  dataDepartment: any;
  dataStraObj: any;
  kpiDataList: any;
  invoiceForm: FormGroup;
  matrixErrorShow: any;
  matrixError: any;
  area_manager_value: any;
  area_manager_percent: any = 100;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    public dialogRef: MatDialogRef<AddHoshin>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private dataYearService: DataYearService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  addActionPlanClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
    let user_id = this.LoginUserDetails.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    // Reactive Form
    this.addMatrixForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      dept_id: [''],
      str_obj_id: [''],
      initiatives_id: [''],
      action_plan_id: [],
      kpi_id: [''],
      area_manager: [''],
      area_manager_value: [''],
      area_manager_percent: [this.area_manager_percent],
      itemDepartment: this._formBuilder.array([this.inititem()]),
      itemSection: this._formBuilder.array([this.inititem()]),
      itemSupervisor: this._formBuilder.array([this.inititem()])
    });
    this.SelectModuleGet();
    this.departmentGetUnit();
    this.matrixError = false;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      
    });
  }
  addMatrix() {
    this.submitted = true;
    // stop here if addMatrixForm is invalid
    if (this.addMatrixForm.invalid) {
      return;
    }
    this.addMatrixForm.value.dept_head = this.addMatrixForm.value.itemDepartment[0].itemhead;
    this.addMatrixForm.value.dept_head_value = this.addMatrixForm.value.itemDepartment[0].itemvalue;
    this.addMatrixForm.value.dept_head_percent = this.addMatrixForm.value.itemDepartment[0].itemparsent;
    this.addMatrixForm.value.section_head = this.addMatrixForm.value.itemSection[0].itemhead;
    this.addMatrixForm.value.section_head_value = this.addMatrixForm.value.itemSection[0].itemvalue;
    this.addMatrixForm.value.section_head_percent = this.addMatrixForm.value.itemSection[0].itemparsent;
    this.addMatrixForm.value.supervisor_head = this.addMatrixForm.value.itemSupervisor[0].itemhead;
    this.addMatrixForm.value.superv_head_value = this.addMatrixForm.value.itemSupervisor[0].itemvalue;
    this.addMatrixForm.value.superv_head_percent = this.addMatrixForm.value.itemSupervisor[0].itemparsent;
    this.addMatrixForm.value.itemDepartment.shift();
    this.addMatrixForm.value.itemSection.shift();
    this.addMatrixForm.value.itemSupervisor.shift();
    /* console.log(this.addMatrixForm.value);
    return; */
    this.userService.addHoshinKanri(this.addMatrixForm.value)
      .pipe(first())
      .subscribe(
        (data: any) => {
          this.status_code = data;
          if (this.status_code.status_code == 200) {
            this.MessageSuccess = data;
            this.alertService.success(this.MessageSuccess.message, true);
            this.dialogRef.close('YesSubmit');
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
  kpiTargetValue(event: any) {
    let kpiId = event;
    let kpidata = this.kpiDataList.filter((kpidata) => {
      return kpidata.kpi_id === Number(kpiId);
    });
    this.area_manager_value = kpidata[0].target;
    this.addMatrixForm.patchValue({ "area_manager_value": this.area_manager_value });
  }
  chackParsentValidation(item: string, index: number) {
    this.matrixError = false;
    //this.addMatrixForm.value.area_manager_value = 100;
    switch (index) {
      case 0:
        let totalPercent = Number(this.addMatrixForm.value.itemDepartment[index].itemparsent) + Number(this.addMatrixForm.value.itemSection[index].itemparsent) + Number(this.addMatrixForm.value.itemSupervisor[index].itemparsent);
        const itemPercent = (Number(this.addMatrixForm.value[item][0].itemparsent) / 100) * this.addMatrixForm.value.area_manager_value;
        (<FormArray>this.addMatrixForm.controls[item]).at(index).patchValue({ 'itemvalue': itemPercent });
        //console.log(this.addMatrixForm.value);
        if (Number(this.addMatrixForm.value.area_manager_percent) !== totalPercent) {
          // show error message
          this.matrixErrorShow = "Area Manager total value does not match";
          this.matrixError = true;
        }
        break;
      default:
        if (this.addMatrixForm.value[item].length > 1) {
          let totalItem = 0;
          for (let i = 1; i < this.addMatrixForm.value[item].length; i++) {
            totalItem += Number(this.addMatrixForm.value[item][i].itemparsent);
          }
          const itemPercent = (Number(this.addMatrixForm.value[item][index].itemparsent) / 100) * this.addMatrixForm.value[item][0].itemvalue;
          (<FormArray>this.addMatrixForm.controls[item]).at(index).patchValue({ 'itemvalue': itemPercent });
          //if (Number(this.addMatrixForm.value[item][0].itemparsent) !== totalItem) {
          if (100 !== totalItem) {
            // Item total does not match error message
            //console.log(this.addMatrixForm.value);
            this.matrixErrorShow = "Item total does not match";
            this.matrixError = true;
          }
        }
        break;
    }
  }
  inititem() {
    return this._formBuilder.group({
      itemhead: [''],
      itemvalue: [''],
      itemparsent: []
    });
  }
  addNewDepartment() {
    this.formArrDepartment.push(this.inititem());
  }
  get formArrDepartment() {
    return this.addMatrixForm.get('itemDepartment') as FormArray;
  }
  deleteDepartment(index: number) {
    this.formArrDepartment.removeAt(index);
  }
  addNewSection() {
    this.formArrSection.push(this.inititem());
  }
  get formArrSection() {
    return this.addMatrixForm.get('itemSection') as FormArray;
  }
  deleteSection(index: number) {
    this.formArrSection.removeAt(index);
  }
  addNewSupervisor() {
    this.formArrSupervisor.push(this.inititem());
  }
  get formArrSupervisor() {
    return this.addMatrixForm.get('itemSupervisor') as FormArray;
  }
  deleteSupervisor(index: number) {
    this.formArrSupervisor.removeAt(index);
  }
  numberValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  departmentGetUnit() {
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
  strategicObjGet(event: any) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = event;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.getStrategicObj(login_access_token, unit_id, dept_id,selectedYear,financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.dataStraObj = data.data.strategic_objectives;
      },
      error => {
        this.alertService.error(error);
      });
  }
  initiativesGet(event: any) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let s_o_id = event;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.getInitiatives(login_access_token, unit_id, s_o_id,selectedYear,financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.dataInitiatives = data.data.initiatives;
      },
      error => {
        this.alertService.error(error);
      });
  }
  actionPlansGet(event: any) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let initiatives_id = event;
    this.userService.getActionPlans(login_access_token, unit_id, initiatives_id,).pipe(first()).subscribe(
      (data: any) => {
        this.actionPlansData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  kpiGetByAction(event: any) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let action_plan_id = event;
    let kpiDataFilter = this.actionPlansData.filter((kpidata) => {
      return kpidata.action_plan_id === Number(action_plan_id);
    });
    let kpi_id = kpiDataFilter[0].kpi_data;
    this.userService.getKpiByAction(login_access_token, unit_id, kpi_id).pipe(first()).subscribe(
      (data: any) => {
        this.kpiDataList = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.dataActionOwner = data.data.users;
      },
      error => {
        this.alertService.error(error);
      });
  }
}
/* export interface DialogData {
  animal: string;
  name: string;
} */