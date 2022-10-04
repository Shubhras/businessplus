import { Component, Inject } from '@angular/core';
import {  MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as _ from 'lodash';
@Component({
  selector: 'add-qtly',
  templateUrl: 'add-qtly-summary.component.html',
})
export class AddQtlySummary {
  direction = 'row';
  //selectedFile:  Array<File> = [];
  currentUser: any;
  login_access_token:string;
  unit_id:any;
  addQtlySummaryForm: FormGroup;
  submitted = false;
  dataDepartment: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  companyCreateData: any;
  showCompanyYearList: any = [];
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '5rem',
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
  // Private
  private _unsubscribeAll: Subject<any>;
  constructor(
    public dialogRef: MatDialogRef<AddQtlySummary>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  addActionPlanClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].financial_year : null;
    this.companyCreateData = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].company_created_date : null;
    const currentYear = new Date().getFullYear();
    let companyDataCreate = new Date(this.companyCreateData).getFullYear();
    for (let a = companyDataCreate; a <= currentYear + 14; a++) {
      if (this.companyFinancialYear == "april-march") {
        this.showCompanyYearList.push({ "year_key": a, "year_value": `${a}-${(a + 1).toString().substr(2, 2)}` });
      }
      else {
        this.showCompanyYearList.push({ "year_key": a, "year_value": a });
      }
    }

    // Reactive Form
    this.addQtlySummaryForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],
      unit_id : [this.unit_id, Validators.required],
      dept_id: ['', Validators.required],
      year:['', Validators.required],
      quarterly:['', Validators.required],
      highlight:['', Validators.required],
      majorgaps:['', Validators.required],
      challenges:['', Validators.required],
      priorities:['', Validators.required],
      remark:['', Validators.required],
      itemRows: this._formBuilder.array([this.initItemRows()])
    });
    this.departmentGetUnit();
  }
  /* onFileSelected(event) {
    this.selectedFile = <Array<File>>event.target.files;
  } */
  get formArr() {
    return this.addQtlySummaryForm.get('itemRows') as FormArray;
  }
  initItemRows() {
    return this._formBuilder.group({
      itemname: ['']
    });
  }
  addNewRow() {
    this.formArr.push(this.initItemRows());
  }
  deleteRow(index: number) {
    this.formArr.removeAt(index);
  }
  addQtlySummary() {
    this.submitted = true;
     // stop here if addQtlySummaryForm is invalid
    if (this.addQtlySummaryForm.invalid) {
      return;
    }
    let storeFiles: Array<HTMLInputElement> = Array.from(document.querySelectorAll('.qtly-file'));
    const formData: any = new FormData();
    if(storeFiles.length > 0){
      for (let index = 0; index < storeFiles.length; index++) {
          formData.append("photo[]", storeFiles[index].files[0]);
      }
    }
    formData.append('login_access_token',this.addQtlySummaryForm.value.login_access_token);
    formData.append('unit_id',this.addQtlySummaryForm.value.unit_id);
    formData.append('year',this.addQtlySummaryForm.value.year);
    formData.append('quarterly',this.addQtlySummaryForm.value.quarterly);
    formData.append('dept_id',this.addQtlySummaryForm.value.dept_id);
    formData.append('highlight',this.addQtlySummaryForm.value.highlight);
    formData.append('majorgaps',this.addQtlySummaryForm.value.majorgaps);
    formData.append('challenges',this.addQtlySummaryForm.value.challenges);
    formData.append('priorities',this.addQtlySummaryForm.value.priorities);
    formData.append('remark',this.addQtlySummaryForm.value.remark);
    this.userService.quarterlySummaryAdd(formData).pipe(first()).subscribe(
      (data:any) => {
        if (data.status_code == 200 && data.status == "success") {
          this.alertService.success(data.message, true);
          this.dialogRef.close('YesSubmit');
        }
        else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
    });
  }
  departmentGetUnit() {
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(this.login_access_token, this.unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data:any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
}
