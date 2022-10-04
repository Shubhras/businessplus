import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
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
    status_code: any;
    LoginUserDetails: any;
    currentUser: any;
    // userrole: any = {data:''};
    // userDepartment: any = {data:''};
    //dataDepartment: any;
    // userSections: any = {data:''};
    //dataSections: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        // private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to dashboard if already logged in
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            this.router.navigate(['/apps/event-home']);
        }
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['Prima@123', Validators.required],
            passwordConfirm: ['Prima@123', [Validators.required, confirmPasswordValidator]],
            role_id: [2, Validators.required],
            company_id: [''],
            user_id: [''],
            multi_dept_id: [[]],
            multi_unit_id: [[]],
            multi_section_id: [[]]
        });
        // this.SelectModuleGet();
        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
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
                    setTimeout(() => {
                        localStorage.setItem('signupUserDetails', JSON.stringify(this.registerForm.value));
                        //this.router.navigate(['/apps/login']);
                        this.userLogin();
                    }, 3000);
                } else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    userLogin() {
        let signupUser = JSON.parse(localStorage.getItem('signupUserDetails'));
        this.loading = true;
        let data = {
            "email": signupUser.email,
            "password": signupUser.password
        }
        this.userService.login(data).pipe(first()).subscribe(
            (data: any) => {
                // this.status_code = data;
                if (data.status_code == 200) {
                    const userSelectedYear = new Date().getFullYear();
                    data.userSelectedYear = userSelectedYear;
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    localStorage.setItem('LoginUserDetails', JSON.stringify(data.data));
                    this.router.navigate(['/apps/company-setup']);
                } else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
    /*  SelectModuleGet() {
         this.userService.GetSelectModule().pipe(first()).subscribe(
             data => {
                 this.userrole = data;
                 },
             error => {
                 this.alertService.error(error);
             });
     } */
    /* departmentGet(event: any) {
        let unit_id = event;
        let profile ='';
        this.userService.getDepartmentMultiUnit(unit_id,profile).pipe(first()).subscribe(
            data => {
                this.userDepartment = data;
                this.dataDepartment = this.userDepartment.data;
                },
            error => {
                this.alertService.error(error);
            });
    } */
    /*  sectionGet(event: any) {
         let dept_id = event;
         let profile ='';
         this.userService.getSectionMultiDept(dept_id,profile).pipe(first()).subscribe(
             data => {
                 this.userSections = data;
                 this.dataSections = this.userSections.data;
                  //console.log(this.dataSections);
                 },
             error => {
                 this.alertService.error(error);
             });
     } */
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
