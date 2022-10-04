import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { takeUntil } from 'rxjs/internal/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'user-list-dialog',
    templateUrl: 'add-user.component.html',
})
export class AddUserDialog {
    currentUser: any;
    direction = 'row';
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role_id: number;
    dept_master_id: number;
    unit_id: number;
    section_id: number;
    userrole: any = { data: '' };
    dataDepartment: any;
    dataSections: any;
    unitsData: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddUserDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    AddUserClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required,],
            email: ['', [Validators.required, Validators.email]],
            password: ['Prima@123'],
            passwordConfirm: ['Prima@123'],
            role_id: ['', Validators.required],
            company_id: [this.currentUser.data.company_id],
            multi_dept_id: [''],
            multi_unit_id: ['', Validators.required],
            multi_section_id: ['']
        });
        this.SelectModuleGet();
        this.unitsGet();
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        this.userService.register(this.registerForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                } else {
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
        let profile = '';
        if (unit_id.length > 0) {
            this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
                (data: any) => {
                    this.dataDepartment = data.data;
                },
                error => {
                    this.alertService.error(error);
                });
        } else {
            this.dataDepartment = [];
        }
    }
    sectionGet(event: any) {
        let dept_id = event;
        let profile = '';
        if (dept_id.length > 0) {
            this.userService.getSectionMultiDept(dept_id, profile).pipe(first()).subscribe(
                (data: any) => {
                    this.dataSections = data.data;
                },
                error => {
                    this.alertService.error(error);
                });
        } else {
            this.dataSections = [];
        }
    }
}
/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');
    if (!password || !passwordConfirm) {
        return null;
    }
    if (passwordConfirm.value === '') {
        return null;
    }
    if (password.value === passwordConfirm.value) {
        return null;
    }
    return { 'passwordsNotMatching': true };
};

@Component({
    selector: 'add-dept-user',
    templateUrl: 'add-dept-user.component.html',
    // styleUrls: ['./welcome-screen.component.scss']
  })
  export class AddDeptUserDialog {
    currentUser: any;
    direction = 'row';
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role_id: number;
    dept_master_id: number;
    unit_id: number;
    section_id: number;
    userrole: any = { data: '' };
    dataDepartment: any;
    dataSections: any;
    unitsData: any;
    private _unsubscribeAll: Subject<any>;

    constructor(
      public dialogRef: MatDialogRef<AddDeptUserDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _formBuilder: FormBuilder,
      private userService: UserService,
      private alertService: AlertService
      ) {   this._unsubscribeAll = new Subject();}
   
      AddUserClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required,],
            email: ['', [Validators.required, Validators.email]],
            password: ['Prima@123'],
            passwordConfirm: ['Prima@123'],
            role_id: ['4'],
            company_id: [this.currentUser.data.company_id],
            multi_dept_id: [''],
            multi_unit_id: ['', Validators.required],
            multi_section_id: [' ']
        });
        this.SelectModuleGet();
        this.unitsGet();
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }
    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }
        let dept_array :any =[];
        let section_array :any =[];
        this.registerForm.value.multi_dept_id = dept_array;
        this.registerForm.value.multi_section_id = section_array;
        this.userService.register(this.registerForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                } else {
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
        let profile = '';
        if (unit_id.length > 0) {
            this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
                (data: any) => {
                    this.dataDepartment = data.data;
                },
                error => {
                    this.alertService.error(error);
                });
        } else {
            this.dataDepartment = [];
        }
    }
    sectionGet(event: any) {
        let dept_id = event;
        let profile = '';
        if (dept_id.length > 0) {
            this.userService.getSectionMultiDept(dept_id, profile).pipe(first()).subscribe(
                (data: any) => {
                    this.dataSections = data.data;
                },
                error => {
                    this.alertService.error(error);
                });
        } else {
            this.dataSections = [];
        }
    }
}
  
