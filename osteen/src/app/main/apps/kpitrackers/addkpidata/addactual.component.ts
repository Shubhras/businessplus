import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from "@angular/material";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import * as _ from 'lodash';
import * as moment from 'moment';

import { isThisISOWeek } from "date-fns";
import { parseInt } from "lodash";
@Component({
  selector: 'add-actual-dialog',
  templateUrl: 'addactual.component.html',
  styleUrls: ['./addkpidata.component.scss'],

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
export class addActualDialod {
  currentUser: any;
  userModulePermission: any;
  kpiTargetsPermission: any;
  kpiActualsPermission: any;
  userListAllData: any;
  direction = 'row';
  AddActualForm: FormGroup;
  submitted = false;
  bordershow = false;
  commenterrorfalse = false;
  kpiData: any;
  kpiAction: any;
  currentYearFull: any;
  currentMonthNumber: any;
  Month = [];
  companyFinancialYear: any;
  allDetailsCompany: any;
  companyFinancialreminderDate: any;
  user_id: any;
  commenterror = [false, false, false, false, false, false, false, false, false, false, false, false];
  recovery_planerror = [false, false, false, false, false, false, false, false, false, false, false, false];
  responsibilityerror = [false, false, false, false, false, false, false, false, false, false, false, false];
  targetedateerror = [false, false, false, false, false, false, false, false, false, false, false, false];
  text: string;
  text2: any;
  kpitagetvalue: any;
  monthChack: string;
  mydatemonth: string;
  myDate: any;
  currentMonth: any;
  mydateyear: string;
  mydatenextmonth: string;

  currentdate: any;
  actualmonth: any;
  mydateyear1: string;
  mydatenextmonth1: string;
  constructor(
    public dialogRef: MatDialogRef<addActualDialod>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
  ) {
  }
  /* Month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']; */
  ngOnInit(): void {
    this.myDate = new Date();

    console.log("mydate", this.myDate);

    let mydatemonth1 = this.datepipe.transform(this.myDate, 'dd');
    console.log('mydatemonth1', mydatemonth1);
    this.mydatemonth = this.datepipe.transform(this.myDate, 'dd');
    console.log('this.mydatemonth', this.mydatemonth);
    this.mydateyear1 = this.datepipe.transform(this.myDate, 'yyyy');
    // this.mydateyear = this.datepipe.transform(this.myDate, 'yyyy');
    console.log('mydateyear1', this.mydateyear1);

    this.mydatenextmonth1 = moment(new Date()).format("MM");
    console.log('mydatenextmonth1', this.mydatenextmonth1);
    let mydatenextmonth13 = moment(new Date()).format("MMM");
    console.log('mydatenextmonth13', mydatenextmonth13);

    // let mydatenextmonth2 = parseInt(mydatenextmonth1);
    // console.log('mydatenextmonth2', mydatenextmonth2);

    // let entry_reminder_date1 = new Date(parseInt(mydateyear1), mydatenextmonth2, parseInt(mydatemonth1));
    // let entry_reminder_date2 = moment(entry_reminder_date1, 'YYYY-MM-DD').format('YYYY-MM-DD');
    // console.log('entry_reminder_date', entry_reminder_date1);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    let rd1 = this.allDetailsCompany.general_data[0].reminder_date;
    this.companyFinancialreminderDate = this.allDetailsCompany.general_data[0].reminder_date;
    if (this.companyFinancialYear == "april-march") {
      this.Month = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];
    }
    else {
      this.Month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    }

    this.currentdate = moment(new Date()).format("YYYY-MM-DD");

    this.companyFinancialreminderDate = new Date(parseInt(this.mydateyear1), parseInt(this.mydatenextmonth1) - 1, rd1);


    this.companyFinancialreminderDate = moment(this.companyFinancialreminderDate, 'YYYY-MM-DD').format('YYYY-MM-DD');



    this.currentYearFull = new Date().getFullYear();
    this.currentMonthNumber = new Date().getMonth();
    this.userLisetGet();
    this.kpiAction = this.data.action;
    this.kpiData = this.data.kpiATDATA;

    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Kpi_targets") {
        this.kpiTargetsPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Kpi_actuals") {
        this.kpiActualsPermission = this.userModulePermission[i];
      }
    }
    this.AddActualForm = this._formBuilder.group({
      login_access_token: [login_access_token],
      user_id: [this.user_id],
      kpi_id: [this.kpiData[0].kpi_id],
      year: [this.kpiData[0].year],
      targetActualFrom: this._formBuilder.array([])
    });
    /*  for (var i = 0; i < this.kpiData.length; i++) {
       this.targetActualFrom.push(this.createItem(this.kpiData[i]));
     } */
    this.Month.map(month => {
      this.kpiData.filter((kpi) => {
        if (month == kpi.month) {
          this.targetActualFrom.push(this.createItem(kpi));
        }
      });
    });
  }
  public get targetActualFrom(): FormArray {
    return this.AddActualForm.get('targetActualFrom') as FormArray;
  }
  Oncmntkeyup(idea_trend, event: any, i: any, actualid: any, targetid: any) {
    let actualvalue = parseInt(actualid.value);
    let targetvalue = parseInt(targetid.value);

    if (event.target.value) {
      this.commenterror[i] = false;
    }
    else {
      if (idea_trend == 'positive') {
        if (actualvalue < targetvalue) {
          this.commenterror[i] = true;
        }
      } else {
        if (actualvalue > targetvalue) {
          this.commenterror[i] = true;
        }
      }
    }
  }
  Onrecvrykeyup(idea_trend, event: any, i: any, actualid: any, targetid: any) {
    let actualvalue = parseInt(actualid.value);
    let targetvalue = parseInt(targetid.value);
    if (event.target.value != '') {
      this.recovery_planerror[i] = false;
    }
    else {
      if (idea_trend == 'positive') {
        if (actualvalue < targetvalue) {
          this.recovery_planerror[i] = true;
        }
      } else {
        if (actualvalue > targetvalue) {
          this.recovery_planerror[i] = true;
        }
      }
    }
  }
  Onrespkeyup(event: any, i: any) {
    this.responsibilityerror[i] = false;
  }
  Ontrdatekeyup(event: any, i: any) {
    if (event.target.value != '') {
      this.targetedateerror[i] = false;
    }
    else {
      this.targetedateerror[i] = true;
    }
  }


  onKeyUp(idea_trend, i: any, valr: any, actualvalue, comid, recoveryid: any, responsibilityid1: any, target_dateid: any) {
    // console.log('idea_trend', idea_trend);

    this.actualmonth = i + 1;
    // this.currentdate =  new Date(this.actualmonth);
    // console.log('keyup', this.currentdate);

    let responsibilityid = responsibilityid1._selectionModel._selected;
    this.text = valr;

    this.monthChack = moment().month(valr).format("MM");
    // let mydatemonth22 = this.datepipe.transform(valr, 'MM');
    let actual = actualvalue.target.value;

    if (comid.value != '') {
      this.commenterror[i] = false;
    }
    if (recoveryid.value != '') {
      this.recovery_planerror[i] = false;
    } if (responsibilityid != null) {
      this.responsibilityerror[i] = false;
    } if (target_dateid.value != '') {
      this.targetedateerror[i] = false;
    }
    if (actual == '') {
      this.commenterror[i] = false;
      this.recovery_planerror[i] = false;
      this.responsibilityerror[i] = false;
      this.targetedateerror[i] = false;
      return;
    }
    if (this.kpiAction == 'Actual') {
      for (let index = 0; index < this.kpiData.length; index++) {

        let element = this.kpiData[index];
        if (element.month == this.text) {
          let target = parseInt(element.kpi_target);
          if (idea_trend == 'positive') {
            if (actual < target) {
              this.commenterrorfalse = true

              if (element.month == this.text && comid.value == '') {
                this.commenterror[i] = true;
              }
              if (element.month == this.text && recoveryid.value == '') {
                this.recovery_planerror[i] = true;
              }
              if (element.month == this.text && responsibilityid == null) {
                this.responsibilityerror[i] = true;
              }
              if (element.month == this.text && target_dateid.value == '') {
                this.targetedateerror[i] = true;
              }
            }
            else {
              this.commenterror[i] = false;
              this.recovery_planerror[i] = false;
              this.responsibilityerror[i] = false;
              this.targetedateerror[i] = false;
            }
          }
          else {
            if (actual > target) {
              this.commenterrorfalse = true

              if (element.month == this.text && comid.value == '') {
                this.commenterror[i] = true;
              }
              if (element.month == this.text && recoveryid.value == '') {
                this.recovery_planerror[i] = true;
              }
              if (element.month == this.text && responsibilityid == null) {
                this.responsibilityerror[i] = true;
              }
              if (element.month == this.text && target_dateid.value == '') {
                this.targetedateerror[i] = true;
              }
            }
            else {
              this.commenterror[i] = false;
              this.recovery_planerror[i] = false;
              this.responsibilityerror[i] = false;
              this.targetedateerror[i] = false;
            }
          }
        }
      }
    }

  }
  createItem(kpiData: any): FormGroup {
    let targets;
    let actuals;
    if (kpiData.kpi_target != null) {
      let monthVlaue = kpiData.kpi_target.split(".");
      if (monthVlaue[1] > '00') {
        targets = monthVlaue[0] + '.' + monthVlaue[1];
      }
      else {
        targets = monthVlaue[0];
      }
    }
    else {
      targets = null;
    }
    if (kpiData.kpi_actual != null) {
      let monthVlaue = kpiData.kpi_actual.split(".");
      if (monthVlaue[1] > '00') {
        actuals = monthVlaue[0] + '.' + monthVlaue[1];
      }
      else {
        actuals = monthVlaue[0];
      }
    }
    else {
      actuals = null;
    }
    let monthRatio;
    let month_label;
    if (actuals == 0.0 || actuals == null || targets == 0.0 || targets == null) {
      monthRatio = null;
    }
    else {
      monthRatio = actuals / targets;
    }
    console.log("monthraito", monthRatio);

    // green =1  yellow = 2 red= 3
    // if (kpiData.ideal_trend == "positive") {
    //   month_label = monthRatio >= 0.9 ? '1' : (monthRatio < 0.9 && monthRatio >= 0.7) ? '2' : (monthRatio < 0.7 && monthRatio != null) ? '3' : (monthRatio == null) ? '4' : '';
    // }
    // else {
    //   month_label = monthRatio >= 1.1 ? '3' : (monthRatio < 1.1 && monthRatio >= 1.0) ? '2' : (monthRatio < 1.0 && monthRatio != null) ? '1' : (monthRatio == null) ? '4' : '';
    // }
    if (kpiData.ideal_trend == "positive") {
      month_label = monthRatio >= 1.0 ? '1' : (monthRatio < 1.0 && monthRatio >= 0.9) ? '2' : (monthRatio < 0.9 && monthRatio != null) ? '3' : (monthRatio == null) ? '4' : '';
    }
    else {
      month_label = monthRatio >= 1.1 ? '3' : (monthRatio < 1.1 && monthRatio > 1.0) ? '2' : (monthRatio <= 1.0 && monthRatio != null) ? '1' : (monthRatio == null) ? '4' : '';
    }
    // target and actual redable or not readable
    let monthReadable;
    let monthNumber = moment().month(kpiData.month).format("M");
    if (kpiData.kpi_target !== null) {
      if (monthNumber < (this.currentMonthNumber + 1)) {
        monthReadable = false;
      } else {
        monthReadable = true;
      }
    } else {
      monthReadable = true;
    }

    return this._formBuilder.group({
      month: [kpiData.month],
      target: [targets],
      targetId: [kpiData.target_id],
      targetYear: [kpiData.year],
      actual: [actuals],
      // actual: new FormControl('', actuals<targets ? Validators.required : actuals),
      actualId: [kpiData.actual_id],
      actualYear: [kpiData.year],
      comment: [kpiData.comment],
      comment_id: [kpiData.comment_id],
      recovery_plan: [kpiData.recovery_plan],
      responsibility: [kpiData.responsibility],
      target_date: [kpiData.target_date],
      status: [month_label],
      readableMonth: [monthReadable],
      lateentry_id: [kpiData.lateentry_id],
    });
  }
  AddActualClose(): void {
    this.dialogRef.close();
  }
  alert_month(kpiAction: any, editable_month:any){
    if(kpiAction == 'Actual' && editable_month == true ){
      alert("Sorry you can't do it before month ends!");
    } 
  }
  AddActualSubmit() {
    // let month;
    // console.log('this.AddActualForm.value', this.AddActualForm.value.targetActualFrom);
    // console.log('this.kpiData', this.kpiData);
    // for (let i = 0; i <= this.kpiData.length; i++) {
    //   // if(this.AddActualForm.value.targetActualFrom[i].month == )
    //   if (this.AddActualForm.value.targetActualFrom[i].readableMonth == false && this.AddActualForm.value.targetActualFrom[i].actual == null ) {
    //     console.log('empaty actual', this.AddActualForm.value.targetActualFrom[i].month);
    //   }
    //   else {
    //     month = this.AddActualForm.value.targetActualFrom[i].month;
    //   }
    // }
    // console.log('month', month);

    // return;

    // for(let i =0; i<=11;i++){
    //   if(this.responsibilitye[i]){

    //   }
    // }
console.log('formm',this.AddActualForm.value.targetActualFrom);

    const formValues = [...this.AddActualForm.value.targetActualFrom];
    const formData = {
      kpi_id: this.AddActualForm.value.kpi_id,
      user_id: this.AddActualForm.value.user_id,
      year: this.AddActualForm.value.year,
      action: this.kpiAction,
      login_access_token: this.AddActualForm.value.login_access_token,
      targetData: {},
      actualData: {},
      data: [],
      updatedata: []
    };
    const tempData = [];
    const tempData2 = [];
    const actualtemp = [];

    this.currentMonth = moment(new Date()).format("MM");
    this.currentMonth = moment(this.currentMonth, 'MM').format("MMM").toLowerCase();
    for (let i = 0; i < formValues.length; i++) {
      if (formValues[i].readableMonth == false && formValues[i].month != this.currentMonth) {
        if (formValues[i].actual == null) {
          actualtemp.push({ month: formValues[i].month });
          formValues[i].actual = "0";
        }
      }
    }

    formValues.forEach((formRow) => {
      if (this.kpiAction == 'Target') {
        // formData.targetData['user_id'] = this.user_id;
        formData.targetData['target_id'] = formRow.targetId;
        formData.targetData['target_year'] = formRow.targetYear;
        formData.targetData[formRow.month] = formRow.target;
      }
      if (this.kpiAction == 'Actual') {
        // formData.actualData['user_id'] = this.user_id;
        formData.targetData['target_id'] = formRow.targetId;
        formData.targetData['target_year'] = formRow.targetYear;
        formData.targetData[formRow.month] = formRow.target;
        formData.actualData['actual_id'] = formRow.actualId;
        formData.actualData['actual_year'] = formRow.actualYear;
        formData.actualData[formRow.month] = formRow.actual;
      }

      if (this.companyFinancialreminderDate < this.currentdate && formRow.actual != null) {
        this.bordershow = true;
        // console.log("bordered", this.bordershow);
        tempData.push({ kpi_id: this.AddActualForm.value.kpi_id, year: formRow.targetYear, month: formRow.month, comment_id: formRow.comment_id, comment: formRow.comment, recovery_plan: formRow.recovery_plan, responsibility: formRow.responsibility, lateentry_id: formRow.lateentry_id, late_entry: this.bordershow, entrydate: this.datepipe.transform(this.myDate, 'yyyy-MM-dd'), target_date: this.datepipe.transform(formRow.target_date, 'yyyy-MM-dd'), status: formRow.status });
      }
      else {
        this.bordershow = false;
        tempData.push({ kpi_id: this.AddActualForm.value.kpi_id, year: formRow.targetYear, month: formRow.month, comment_id: formRow.comment_id, comment: formRow.comment, recovery_plan: formRow.recovery_plan, responsibility: formRow.responsibility, lateentry_id: formRow.lateentry_id, late_entry: this.bordershow, entrydate: '', target_date: this.datepipe.transform(formRow.target_date, 'yyyy-MM-dd'), status: formRow.status });
      }
      if (formRow.actual != null) {
        tempData2.push({ kpi_id: this.AddActualForm.value.kpi_id, year: formRow.targetYear, month: formRow.month, comment_id: formRow.comment_id, comment: formRow.comment, recovery_plan: formRow.recovery_plan, responsibility: formRow.responsibility, late_entry2: 'filled', entrydate: this.datepipe.transform(this.myDate, 'yyyy-MM-dd'), target_date: this.datepipe.transform(formRow.target_date, 'yyyy-MM-dd'), status: formRow.status });
      }
      else {
        tempData2.push({ kpi_id: this.AddActualForm.value.kpi_id, year: formRow.targetYear, month: formRow.month, comment_id: formRow.comment_id, comment: formRow.comment, recovery_plan: formRow.recovery_plan, responsibility: formRow.responsibility, late_entry2: 'not-filled', entrydate: this.datepipe.transform(this.myDate, 'yyyy-MM-dd'), target_date: this.datepipe.transform(formRow.target_date, 'yyyy-MM-dd'), status: formRow.status });
      }
    });
    console.log('tempData', tempData);

    formData.data = tempData;
    formData.updatedata = tempData2;
    this.submitted = true;
    // stop here if AddActualForm is invalid
    /*  if (this.AddActualForm.invalid) {
       console.log('invalid');
       return;
     } */

    // console.log('formData', formData);


    this.userService.editkpiTargetActual(formData).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);

          // let resultArray={
          //   bordervlue : this.bordershow,
          //   monthname : this.text,
          //   date: this.mydatemonth,
          //   kpi: this.AddActualForm.value.kpi_id
          // }

          this.dialogRef.close("YesSubmit");
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
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
}