import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-section-unit-dialog',
    templateUrl: 'addsectionunit.component.html',
})
export class AddSectionUnitDialog {
    direction = 'row';
    currentUser: any;
    AddSectionForm: FormGroup;
    submitted = false;
    userrole: any = { data: '' };
    unitsData: any;
    dataDepartment: any;
    userListAllData: any;
    // Private
    private _unsubscribeAll: Subject<any>;
  currentUnitId: any;
  unit: any;
  company_id: any;
  allDetailsCompany: any;
    constructor(
        public dialogRef: MatDialogRef<AddSectionUnitDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    AddSectionClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.currentUnitId = JSON.parse(localStorage.getItem('currentUnitId'));
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.unit = this.currentUnitId;
        this.AddSectionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.unit, Validators.required],
            company_id: [this.company_id, Validators.required],
            dept_id: ['', Validators.required],
            section_name: ['', Validators.required],
            role_id: ['6', Validators.required],
            user_id: ['', Validators.required],
            enable: ['Yes', Validators.required],
        });
        //this.SelectModuleGet();
        this.departmentGet(this.unit);
        this.userLisetGet();
        this.unitsGet();
    }
    mobileValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();

        }
    }
    AddSectionSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddSectionForm.invalid) {
            return;
        }
        this.userService.addSectionChange(this.AddSectionForm.value).pipe(first()).subscribe(
            (data: any) => {
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
    /* SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            data => {
                this.userrole = data;
                this.unitsData = this.userrole.data.units;
                },
            error => {
                this.alertService.error(error);
            });
    } */
    unitsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getUnitChange(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.unitsData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    departmentGet(event: any) {
        let unit_id = event;
        let profile = 'section';
        this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
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
export interface DialogData {

}