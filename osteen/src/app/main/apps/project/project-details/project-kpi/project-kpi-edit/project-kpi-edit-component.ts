import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'project-kpi-edit-component',
  templateUrl: './project-kpi-edit-component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectKpiEditComponent {
  direction = 'row';
  currentUser: any;
  project_id: any;
  projectId:any;
  unit_id;
  kpiFormGroup: FormGroup;
  kpiValueError: any;
  kpiValueErrorShow: any;
  userrole: any;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  dataDepartment: any;
  company_id: any;
  selectedMileStone: Array<number> = [];
  mileStoneGet: any;
  dataunitOfMeasur: any;
  proAllDetails: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  kpiAllData: any;
  constructor(
    public dialogRef: MatDialogRef<ProjectKpiEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  AddKpiPopupClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.kpiAllData = this.data;
    this.projectId =this.kpiAllData.project_id;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.kpiValueError = false;
    this.departmentGet();
    this.unitOfMeasurementGet();
    this.singleViewProjects();
    // Reactive Form
    this.kpiFormGroup = this._formBuilder.group({
      company_id: [this.company_id, Validators.required],
      login_access_token: [login_access_token, Validators.required],
      unit_id: [this.unit_id, Validators.required],
      project_id: [this.projectId],
      project_kpi_dept: [this.kpiAllData.project_kpi_dept, Validators.required],
      project_kpi_name: [this.kpiAllData.project_kpi_name, Validators.required],
      project_kpi_def: [this.kpiAllData.project_kpi_def, Validators.required],
      project_kpi_trend: [this.kpiAllData.project_kpi_trend, Validators.required],
      project_kpi_uom: [this.kpiAllData.project_kpi_uom, Validators.required],
      project_kpi_id: [this.kpiAllData.project_kpi_id],
      project_kpi_yr_targt: [this.kpiAllData.project_kpi_yr_targt, Validators.required],
      project_kpi_freqency: [this.kpiAllData.project_kpi_freqency, Validators.required],
      projectDetails: ['kpiProject'],
      project_kpi_value: [this.kpiAllData.project_kpi_value, Validators.required],
      kpi_mile_stone: this._formBuilder.array([])
      // milestone_id: [''],
      // projct_kpi_dstrbt_vl: [''],
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
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let proId = this.kpiAllData.project_id
    this.userService.singleProjectsView(login_access_token, unit_id, proId).pipe(first()).subscribe(
      (data: any) => {
        this.proAllDetails = data.data;
        this.mileStoneGet = this.proAllDetails.project_milestone_data;
        const kpiMileData = this.kpiAllData.project_kpi_milestone_data;
        if (kpiMileData.length == 0) {
          this.formArrKpiMileStone.push(this.initKpiMileStone());
        }
        else {
          for (let i = 0; i < kpiMileData.length; i++) {
            this.formArrKpiMileStone.push(this.initKpiMileStone());
            this.selectedMileStone[i] = kpiMileData[i].milestone_id;
            this.formArrKpiMileStone.at(i).patchValue({ project_id: kpiMileData[i].project_id });
            this.formArrKpiMileStone.at(i).patchValue({ milestone_id: kpiMileData[i].milestone_id });
            this.formArrKpiMileStone.at(i).patchValue({ kpi_mile_stone_id: kpiMileData[i].kpi_mile_stone_id });
            this.formArrKpiMileStone.at(i).patchValue({ projct_kpi_dstrbt_vl: kpiMileData[i].projct_kpi_dstrbt_vl });
          }
        }
      },
      error => {
        this.alertService.error(error);
      });

  }
  get formArrKpiMileStone() {
    return this.kpiFormGroup.get('kpi_mile_stone') as FormArray;
  }
  initKpiMileStone() {
    return this._formBuilder.group({
      project_id: [this.projectId],
      milestone_id: ['', Validators.required],
      kpi_mile_stone_id: [''],
      projct_kpi_dstrbt_vl: ['', Validators.required],
    });
  }
  kpiMileStone(event: any, index: number) {
    this.selectedMileStone[index] = event;
  }
  mileStoneChange(event: any) {
    let mileStone;
    mileStone = this.mileStoneGet.filter((val) => {
      return val.project_milestone_id === Number(event);
    });
    // this.activityMinMaxDate = moment(mileStone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
  }
  departmentGet() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
   // this.project_id = this.data;
   let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      data => {
        this.userrole = data;
        this.dataDepartment = this.userrole.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  unitOfMeasurementGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getUnitOfMeasurement(login_access_token,this.company_id).pipe(first()).subscribe(
      data => {
        this.userrole = data;
        this.dataunitOfMeasur = this.userrole.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  numberValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  addKpiMileStone() {
    this.formArrKpiMileStone.push(this.initKpiMileStone());
  }
  deleteKpiMileStone(index: number) {
    let proKpiMileId = this.formArrKpiMileStone.value[index].kpi_mile_stone_id;
    if (proKpiMileId) {
      const deleteProData = {
        "login_access_token": this.currentUser.login_access_token,
        "project_id": this.projectId,
        "projectDetails": "kpiProject",
        "kpi_mile_stone_id": proKpiMileId,
        "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
      }
      this.deleteProSingle(deleteProData);
    }
    this.formArrKpiMileStone.removeAt(index);
    this.selectedMileStone.splice(index, 1);
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
  AddKpiSubmit() {
    this.submitted = true;
    // stop here if kpiFormGroup is invalid
    if (this.kpiFormGroup.invalid) {
      return;
    }
    if (this.kpiValueError !== false) {
      return;
    }
    this.kpiFormGroup.value.project_id = this.projectId;
    this.userService.ProjectUpdate(this.kpiFormGroup.value).pipe(first()).subscribe(
      (data: any) => {
        // this.status_code = data;
        if (data.status_code == 200) {
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
}