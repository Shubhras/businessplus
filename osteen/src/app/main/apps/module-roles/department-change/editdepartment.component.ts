import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { User } from '../../_models';
import { toInteger } from 'lodash';

@Component({
    selector: 'edit-department-dialog',
    templateUrl: 'editdepartment.component.html',
    styleUrls: ['department-change.component.scss'],
})
export class EditDepartmentDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    EditDeptForm: FormGroup;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    userrole: any = { data: '' };
    userListAllData = [];
    unitsData: any;
    dropdownSettings = {};
    selected_user = [];
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditDepartmentDialog>,
        @Inject(MAT_DIALOG_DATA) public data: User,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    EditDeptClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        // Reactive Form
        this.EditDeptForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.EditDataGet.unit_id, Validators.required],
            dept_name: [this.EditDataGet.dept_name, Validators.required],
            user_id: ['', Validators.required],
            role_id: ['4'],
            dept_id: [this.EditDataGet.dept_id, Validators.required],
        });
        this.unitsGet();
        this.SelectModuleGet();
        this.userLisetGet();
    }
    EditDeptSubmit() {
        this.submitted = true;
        // stop here if EditDeptForm is invalid
        if (this.EditDeptForm.invalid) {
            return;
        }
        this.EditDeptForm.value.user_id = this.EditDeptForm.value.user_id[0]['user_id'];
     
        this.userService.editDepartmentChange(this.EditDeptForm.value).pipe(first()).subscribe(
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
                //  this.userListAllData = data.data;

                this.userListAllData = data.data;
                console.log('radhemohan1', this.userListAllData);
                console.log('radhemohan2', toInteger(this.EditDataGet.user_id));

                let a = [];
                a.push({ 'name': this.EditDataGet.name, user_id: toInteger(this.EditDataGet.user_id) });
                console.log('cccccccc', a);
                this.selected_user = a;


                // console.log('radhemohan',this.EditDataGet);
                //                 let arr  = [];
                //               let a =  this.EditDataGet.user_id;
                //               let b =  this.EditDataGet.name;
                //               arr.push({'user_id': a,'name': b});
                // console.log('eeeeeeeeeeeeeeee', arr);

                //                 let c  = [];
                //                 arr.forEach((element,index) => {
                //                     let temp ={'user_id':element.user_id,'name':element.name };
                //                    c.push(temp);
                //                 });
                //                this.selected_user  = c; 

                //  let a  = [];
                //  let temp ={'user_id':this.EditDataGet.user_id,'name':this.EditDataGet.name };
                //  a.push(temp);
                // //  this.selected_user = a;
                // this.selected_user = a;

                // this.selected_user = [{'user_id': this.EditDataGet.user_id, 'name': this.EditDataGet.name}];
                this.dropdownSettings = {
                    singleSelection: true,
                    idField: 'user_id',
                    textField: 'name',
                    selectAllText: 'Select All',
                    unSelectAllText: 'UnSelect All',
                    itemsShowLimit: 2,
                    allowSearchFilter: true
                };

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
    /*compareFn(v1: any, v2: any): boolean {
        return v1 === v2.id;
    }*/

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