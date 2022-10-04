import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-section-dialog',
    templateUrl: 'addsection.component.html',
    styleUrls: ['section-change.component.scss'],
})
export class AddSectionDialog {
    direction = 'row';
    currentUser: any;
    AddSectionForm: FormGroup;
    submitted = false;
    userrole: any = { data: '' };
    unitsData: any;
    dropdownSettings = {};
    dataDepartment: any;
    userListAllData: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    allDetailsCompany: any;
    company_id: any;
    constructor(
        public dialogRef: MatDialogRef<AddSectionDialog>,
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
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.AddSectionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: ['', Validators.required],
            company_id: [this.company_id, Validators.required],
            dept_id: ['', Validators.required],
            section_name: ['', Validators.required],
            role_id: ['6', Validators.required],
            user_id: ['', Validators.required],
            enable: ['Yes', Validators.required],
        });
        //this.SelectModuleGet();
        // this.departmentGetUnit();
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
        this.AddSectionForm.value.user_id = this.AddSectionForm.value.user_id[0]['user_id'];
        // console.log('rddd', this.AddSectionForm.value);
        // return;
        
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
export interface DialogData {

}