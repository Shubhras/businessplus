import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    forgotPasswordForm: FormGroup;
    resetPasswordForm: FormGroup;
    submitted = false;
    email: string;
    reset_password_token: string;
    new_password: string;
    confirm_password: string;
    status_code: any;
    status: any;
    message: any;
    errors: any;
    ForgetSuccess: any;
    MessageSuccess: any;
    MessageError: any;
    ForgetError: any;
    ForgetFrom = true;
    ResetFrom = false;
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        // private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]]
        });
        this.resetPasswordForm = this._formBuilder.group({
            reset_password_token: ['', Validators.required],
            new_password: ['', Validators.required],
            confirm_password: ['', [Validators.required, confirmPasswordValidator]]
        });
        // Update the validity of the 'confirm_password' field
        // when the 'password' field changes
        this.resetPasswordForm.get('new_password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('confirm_password').updateValueAndValidity();
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
    ForgotSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }
        this.userService.forgotPassword(this.forgotPasswordForm.value).pipe(first()).subscribe((data: any) => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
                this.message = data;
                this.MessageSuccess = this.message.message;
                this.ForgetSuccess = true;
                this.ForgetError = false;
                this.ForgetFrom = false;
                this.ResetFrom = true;
            } else {
                this.message = data;
                this.MessageError = this.message.message;
                this.ForgetError = true;
            }
        },
            error => {
                this.alertService.error(error);
            });
    }
    ResetSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }
        this.userService.resetPassword(this.resetPasswordForm.value).pipe(first()).subscribe((data: any) => {
            this.status_code = data;
            this.status = data;
            if (this.status_code.status_code == 200 && this.status.status == "errors") {
                this.errors = data;
                this.MessageError = this.errors.errors;
                this.ForgetError = true;
                this.ForgetSuccess = false;
            }
            else if (this.status_code.status_code == 200 && this.status.status == "success") {
                this.message = data;
                this.MessageSuccess = this.message.message;
                this.ForgetSuccess = true;
                this.ForgetError = false;
            }
            else {
                this.message = data;
                this.MessageError = this.message.message;
                this.ForgetError = true;
                this.ForgetSuccess = false;
            }
        },
            error => {
                this.alertService.error(error);
                console.log(error);
            });
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
    const new_password = control.parent.get('new_password');
    const confirm_password = control.parent.get('confirm_password');
    if (!new_password || !confirm_password) {
        return null;
    }
    if (confirm_password.value === '') {
        return null;
    }
    if (new_password.value === confirm_password.value) {
        return null;
    }
    return { 'passwordsNotMatching': true };
};
