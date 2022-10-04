import { Component,  Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {  Subject } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService,  UserService} from 'app/main/apps/_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'edit-qtly',
  templateUrl: 'edit-qtly-summary.component.html',
})
export class EditQtlySummary {
  direction = 'row';
  //selectedFile:  Array<File> = [];
  currentUser: any;
  unit_id:any;
  editQtlySummaryForm: FormGroup;
  submitted = false;
  dataDepartment: any;
  editQtlyData:any;
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
      public dialogRef: MatDialogRef<EditQtlySummary>,
      @Inject(MAT_DIALOG_DATA) public data:any,
      private _formBuilder: FormBuilder,
      private userService: UserService,
      private alertService: AlertService,
    )
     {
    // Set the private defaults
      this._unsubscribeAll = new Subject();
    }
    addQtlyClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
     // console.log( this.editQtlyData.image_path);
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      this.unit_id = localStorage.getItem('currentUnitId');
      this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
      this.companyFinancialYear = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].financial_year : null;
      this.companyCreateData = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].company_created_date : null;
      const currentYear = new Date().getFullYear();
      let companyDataCreate = new Date(this.companyCreateData).getFullYear();
      for (let a = companyDataCreate; a <= currentYear + 4; a++) {
        if (this.companyFinancialYear == "april-march") {
          this.showCompanyYearList.push({ "year_key": a, "year_value": `${a}-${(a + 1).toString().substr(2, 2)}` });
        }
        else {
          this.showCompanyYearList.push({ "year_key": a, "year_value": a });
        }
      }

      this.departmentGetUnit();
      this.editQtlyData = this.data;
      this.editQtlySummaryForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      unit_id : [this.unit_id, Validators.required],
      dept_id: [Number(this.editQtlyData.dept_id), Validators.required],
      quartupdatmanufacturs_id: [this.editQtlyData.quartupdatmanufacturs_id, Validators.required],
      year:[this.editQtlyData.year, Validators.required],
      quarterly:[this.editQtlyData.quarterly, Validators.required],
      highlight:[this.editQtlyData.highlight, Validators.required],
      majorgaps:[this.editQtlyData.majorgaps, Validators.required],
      challenges:[this.editQtlyData.challenges, Validators.required],
      priorities:[this.editQtlyData.priorities, Validators.required],
      remark:[this.editQtlyData.remark, Validators.required],
      itemRows: this._formBuilder.array([this.initItemRows()])
      });
    }
    get formArr() {
      return this.editQtlySummaryForm.get('itemRows') as FormArray;
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
    /* onFileSelected(event) {
        this.selectedFile = <Array<File>>event.target.files;
        console.log(this.selectedFile)
    } */
    remImg(index:any){
      if(index != -1) {
        this.editQtlyData.image_path.splice(index, 1);
      }
    }
    editQtlySummary() {
      this.submitted = true;
      // stop here if editQtlySummaryForm is invalid
      if (this.editQtlySummaryForm.invalid) {
      return;
      }
      let storeFiles: Array<HTMLInputElement> = Array.from(document.querySelectorAll('.qtly-file'));
      const formData: any = new FormData();
      if(storeFiles.length > 0){
        for (let index = 0; index < storeFiles.length; index++) {
          formData.append("photo[]", storeFiles[index].files[0]);
        }
      }
      formData.append('login_access_token',this.editQtlySummaryForm.value.login_access_token);
      formData.append('unit_id',this.editQtlySummaryForm.value.unit_id);
      formData.append('year',this.editQtlySummaryForm.value.year);
      formData.append('quarterly',this.editQtlySummaryForm.value.quarterly);
      formData.append('dept_id',this.editQtlySummaryForm.value.dept_id);
      formData.append('quartupdatmanufacturs_id',this.editQtlySummaryForm.value.quartupdatmanufacturs_id);
      formData.append('highlight',this.editQtlySummaryForm.value.highlight);
      formData.append('majorgaps',this.editQtlySummaryForm.value.majorgaps);
      formData.append('challenges',this.editQtlySummaryForm.value.challenges);
      formData.append('priorities',this.editQtlySummaryForm.value.priorities);
      formData.append('remark',this.editQtlySummaryForm.value.remark);
      this.userService.quarterlySummaryEdit(formData).pipe(first()).subscribe(
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
      let login_access_token = this.currentUser.login_access_token;
      let unit_id = this.unit_id;
      let dept_id = this.currentUser.dept_id;
      let role_id = this.currentUser.role_id;
      this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data:any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
    }
}
export interface DialogData {
  animal: string;
  name: string;
}