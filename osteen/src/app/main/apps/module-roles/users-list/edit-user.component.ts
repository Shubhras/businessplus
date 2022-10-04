import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDatepickerModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { FormControl, AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
@Component({
    selector: 'edit-user-dialog',
    templateUrl: 'edit-user.component.html',
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class EditUserDialog {
    maxDate = new Date(2000, 0, 1);
    currentUser: any;
    direction = 'row';
    editUserForm: FormGroup;
    loading = false;
    submitted = false;
    unitsData: any;
    dataDepartment: any;
    dataSections: any;
    userDetials: any;
    date_birth: any;
    profile: any;
    message: any;
    userrole: any = { data: '' };
    // Private
    // private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditUserDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) {
        // Set the private defaults
        // this._unsubscribeAll = new Subject();
    }
    editUserClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.userDetials = this.data;
        console.log("hello", this.userDetials);
        console.log("hello", this.userDetials.role_id);
        this.SelectModuleGet();
        this.unitsGet();

        let deptSelect = 'D1';
        let sectionSelect = 'S1';
        let unitData = (this.userDetials.multi_unit_id).split(',').map(n => parseInt(n));
        let deptData = (this.userDetials.multi_dept_id).split(',').map(n => parseInt(n));
        this.departmentGet(unitData, deptSelect);
        this.sectionGet(deptData, sectionSelect);
        this.date_birth = this.userDetials.date_birth;
        this.editUserForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.userDetials.user_id, Validators.required],
            email: [this.userDetials.email, Validators.required],
            name: [this.userDetials.name, Validators.required],
            gender: [this.userDetials.gender, Validators.required],
            date_birth: [''],
            pan_card_no: [''],

            multi_unit_id: ['', Validators.required],
            multi_dept_id: [''],
            multi_section_id: [''],

            designation: [this.userDetials.designation, Validators.required],
            role_id: [this.userDetials.role_id, Validators.required],
            address: [this.userDetials.address],
            city: [this.userDetials.city],
            mobile: [this.userDetials.mobile, [Validators.pattern('[0-9]\\d{9}')]],
            mobile2: ['']
        });
    }
    mobileValidation(event: any) {
        const pattern = /[0-9]/;
        let inputChar = String.fromCharCode(event.charCode);
        if (!pattern.test(inputChar)) {
            event.preventDefault();
        }
    }
    editUserSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.editUserForm.invalid) {
            return;
        }
        /*  let latest_date_birth = this.datepipe.transform(this.editUserForm.value.date_birth, 'yyyy/MM/dd');
         this.editUserForm.value.date_birth = latest_date_birth; */
        if (this.editUserForm.value.multi_unit_id.length != 0
            && typeof this.editUserForm.value.multi_unit_id[0] != 'number') {
            let multiUnitId = [];
            this.editUserForm.value.multi_unit_id.forEach(function (value) {
                multiUnitId.push(value.id);
            });
            this.editUserForm.value.multi_unit_id = multiUnitId;
        }
        if (this.editUserForm.value.multi_dept_id.length != 0
            && typeof this.editUserForm.value.multi_dept_id[0] != 'number') {
            let multiDeptId = [];
            this.editUserForm.value.multi_dept_id.forEach(function (value) {
                multiDeptId.push(value.multi_dept_id);
            });
            this.editUserForm.value.multi_dept_id = multiDeptId;
        }
        if (this.editUserForm.value.multi_section_id.length != 0
            && typeof this.editUserForm.value.multi_section_id[0] != 'number') {
            let multiSectionId = [];
            this.editUserForm.value.multi_section_id.forEach(function (value) {
                multiSectionId.push(value.multi_section_id);
            });
            this.editUserForm.value.multi_section_id = multiSectionId;
        }

        this.userService.profileEdit(this.editUserForm.value).pipe(first()).subscribe(
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
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.userrole = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    // SelectModuleGet() {
    //     this.userService.GetSelectModule().pipe(first()).subscribe(
    //         (data: any) => {
    //             this.userrole = data.data.user_role;
    //             console.log(this.userrole);

    //             /*  let role_id = this.userrole.filter(Role => {
    //                  return this.userDetials.role_id.indexOf(Role.id) !== -1;
    //              });
    //              this.editUserForm.get('role_id').setValue(role_id); */
    //         },
    //         error => {
    //             this.alertService.error(error);
    //         });
    // }
    unitsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getUnitChange(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.unitsData = data.data;
                let multi_unit_id = this.unitsData.filter(Unit => {
                    return this.userDetials.multi_unit_id.indexOf(Unit.id) !== -1;
                });
                this.editUserForm.get('multi_unit_id').setValue(multi_unit_id);
            },
            error => {
                console.log("hgdhghd");
                this.alertService.error(error);
            });
    }
    compareFn(v1: any, v2: any): boolean {
        return v1 === v2.id;
    }
    departmentGet(event: any, deptSelect: any) {
        let unit_id = event;
        if (deptSelect == 'D1') {
            this.profile = 'profile';
        }
        else {
            this.profile = '';
        }
        this.userService.getDepartmentMultiUnit(unit_id, this.profile).pipe(first()).subscribe(
            (data: any) => {
                this.dataDepartment = data.data;
                let multi_dept_id = this.dataDepartment.filter(Dept => {
                    return this.userDetials.multi_dept_id.indexOf(Dept.multi_dept_id) !== -1;
                });
                this.editUserForm.get('multi_dept_id').setValue(multi_dept_id);
            },
            error => {
                this.alertService.error(error);
            });
    }
    compareDept(v1: any, v2: any): boolean {
        return v1 === v2.multi_dept_id;
    }

    sectionGet(event: any, sectionSelect: any) {
        let dept_id = event;
        if (sectionSelect == 'S1') {
            this.profile = 'profile';
        }
        else {
            this.profile = '';
        }
        this.userService.getSectionMultiDept(dept_id, this.profile).pipe(first()).subscribe(
            (data: any) => {
                this.dataSections = data.data;
                let multi_section_id = this.dataSections.filter(Section => {
                    return this.userDetials.multi_section_id.indexOf(Section.multi_section_id) !== -1;
                });
                this.editUserForm.get('multi_section_id').setValue(multi_section_id);
            },
            error => {
                this.alertService.error(error);
            });
    }
    compareSection(v1: any, v2: any): boolean {
        return v1 === v2.multi_section_id;
    }
}
export interface DialogData {
    animal: string;
    name: string;
}