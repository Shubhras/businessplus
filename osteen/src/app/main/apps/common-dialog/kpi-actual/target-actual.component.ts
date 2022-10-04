import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'target-actual-dialog',
  templateUrl: 'target-actual.component.html',
  styleUrls: ['target-actual.component.scss'],
  animations: fuseAnimations,
})
export class targetActualDialod {
  currentUser: any;
  direction = 'row';
  AddActualForm: FormGroup;
  submitted = false;
  Month = [];
  companyFinancialYear: any;
  allDetailsCompany: any;
  kpiData: any;
  constructor(
    public dialogRef: MatDialogRef<targetActualDialod>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    //public datepipe: DatePipe,
  ) {
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    if (this.companyFinancialYear == "april-march") {
      this.Month = ['apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar'];
    }
    else {
      this.Month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    }
    this.kpiData = this.data;
    this.AddActualForm = this._formBuilder.group({
      login_access_token: [login_access_token],
      kpi_id: [this.kpiData[0].id],
      targetActualFrom: this._formBuilder.array([])
    });
    /* for (var i = 0; i < this.kpiData.length; i++) {
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
      monthRatio = 0.0;
    }
    else {
      monthRatio = actuals / targets;
    }
    // green =1  yellow = 2 red= 3
    if (kpiData.ideal_trend == "positive") {
      month_label = monthRatio >= 0.9 ? '1' : (monthRatio < 0.9 && monthRatio >= 0.7) ? '2' : (monthRatio < 0.7 && monthRatio != null) ? '3' : '';
    }
    else {
      month_label = monthRatio >= 1.1 ? '3' : (monthRatio < 1.1 && monthRatio >= 1.0) ? '2' : (monthRatio < 1.0 && monthRatio != null) ? '1' : '';
    }
    return this._formBuilder.group({
      month: [kpiData.month],
      target: [targets],
      targetId: [kpiData.target_id],
      targetYear: [kpiData.year],
      actual: [actuals],
      actualId: [kpiData.actual_id],
      actualYear: [kpiData.year],
      comment: [kpiData.comment],
      comment_id: [kpiData.comment_id],
      recovery_plan: [kpiData.recovery_plan],
      responsibility: [kpiData.responsibility],
      target_date: [kpiData.target_date],
      status: [month_label],
    });
  }
  AddActualClose(): void {
    this.dialogRef.close();
  }
}
