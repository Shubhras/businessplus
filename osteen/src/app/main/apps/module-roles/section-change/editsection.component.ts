import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { toInteger } from 'lodash';
@Component({
    selector: 'edit-section-dialog',
    templateUrl: 'editsection.component.html',
    styleUrls: ['section-change.component.scss'],
})
export class EditSectionDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    EditSectionForm: FormGroup;
    submitted = false;
    //userrole: any = { data: '' };
    unitsData: any;
    dropdownSettings = {};
    dataDepartment: any;
    userListAllData = [];
    selectedUser = [];
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditSectionDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    EditSectionClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        // Reactive Form
        this.EditSectionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.EditDataGet.unit_id, Validators.required],
            dept_id: [this.EditDataGet.dept_id, Validators.required],
            section_name: [this.EditDataGet.section_name, Validators.required],
            section_id: [this.EditDataGet.section_id, Validators.required],
            role_id: ['6', Validators.required],
            user_id: ['', Validators.required],
            enable: ['Yes', Validators.required],
        });
        // this.SelectModuleGet();
        this.userLisetGet();
        this.unitsGet();
        this.departmentGet(this.EditDataGet.unit_id);
    }
    EditSectionSubmit() {
        this.submitted = true;
        // stop here if EditDeptForm is invalid
        if (this.EditSectionForm.invalid) {
            return;
        }
        this.EditSectionForm.value.user_id = this.EditSectionForm.value.user_id[0]['user_id'];
        // console.log('vijendrarajput' , this.EditSectionForm.value);
        // return;
        this.userService.editSectionChange(this.EditSectionForm.value).pipe(first()).subscribe(
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
    /*  SelectModuleGet() {
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
               

                let a = [];
                a.push({ 'name': this.EditDataGet.name, user_id: toInteger(this.EditDataGet.user_id) });
                this.selectedUser = a;
                
                this.dropdownSettings = {
                    singleSelection: true,
                    idField: 'user_id',
                    textField: 'name',
                    selectAllText: 'Select All',
                    unSelectAllText: 'UnSelect All',
                    itemsShowLimit: 3,
                    allowSearchFilter: true
                };
            },
            error => {
                this.alertService.error(error);
            });
    }
    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
    }
    onItemDeSelect(item: any) {
        console.log(item);
    }
}
