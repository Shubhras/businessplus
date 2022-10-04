import { Component, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { AddDeptUserDialog, AddUserDialog } from '../users-list/add-user.component';
@Component({
    selector: 'add-department-dialog',
    templateUrl: 'adddepartment.component.html',
    styleUrls: ['department-change.component.scss'],
})
export class AddDepartmentDialog {
    direction = 'row';
    currentUser: any;
    AddDeptForm: FormGroup;
    submitted = false;
    message: any;
    userrole: any = { data: '' };
    userListAllData: any;
    unitsData: any;
    dropdownSettings = {};
    // Private
    private _unsubscribeAll: Subject<any>;
    allDetailsCompany: any;
    company_id: any;
    SprUsr: number;
    LoginUserDetails: any;
    userModulePermission: any;
    userPermission: any;
    constructor(
        public dialogRef: MatDialogRef<AddDepartmentDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public dialog: MatDialog,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    AddDeptClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'))
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Users") {
                this.userPermission = this.userModulePermission[i];
            }
        }
        this.SprUsr = this.LoginUserDetails.id;
        // console.log(this.SprUsr);
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.AddDeptForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            SprUsr: [this.SprUsr, Validators.required],
            unit_id: ['', Validators.required],
            company_id: [this.company_id, Validators.required],
            dept_name: ['', Validators.required],
            role_id: ['4', Validators.required],
            user_id: ['', Validators.required],
        });
        this.SelectModuleGet();
        this.userLisetGet();
        this.unitsGet();
    }

    addDepartment() {
        if (this.userPermission.acc_create == 1) {
            const dialogRef = this.dialog.open(AddDeptUserDialog);
            dialogRef.afterClosed().subscribe(result => {

                if (result == "YesSubmit") {
                    console.log("popdata", result);
                    this.userLisetGet();

                }
            });
        }
        else {
            alert('You don`t have permission');
        }
    }
    AddDeptSubmit() {
        this.submitted = true;

        let userValue = [];
        this.AddDeptForm.value.user_id.forEach(function (value) {
            userValue.push(value.user_id);
        });

        this.AddDeptForm.value.user_id = userValue.toString();
        // console.log('vijendra',this.AddDeptForm.value.user_id);
        // return;
        // stop here if AddUnitForm is invalid
        if (this.AddDeptForm.invalid) {
            return;
        }
        this.userService.addDepartmentChange(this.AddDeptForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    const storeDeptIdOld = this.currentUser.dept_id;
                    let newDeptId = data.data.dept_id;
                    const storeAllDept = storeDeptIdOld.concat(',', newDeptId);
                    this.currentUser.dept_id = storeAllDept;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
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
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.userrole = data.data;
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
    animal: string;
    name: string;
}