import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { PasswordService } from 'app/main/apps/change-password/password.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { takeUntil } from 'rxjs/internal/operators';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
@Component({
    selector: 'password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PasswordComponent implements OnInit {
    currentUser: any;
    passwordForm: FormGroup;
    submitted = false;
    login_access_token: string;
    current_password: string;
    new_password: string;
    confirm_password: string;
    MessageSuccess: any;
    message: any;
    status_code: any;
    status: any;
    errors: any;
    MessageError: any;
    /**
     * Constructor
     *
     * @param {PasswordService} _passwordService
     */
    private _unsubscribeAll: Subject<any>;
    user_id: any;
    constructor(
        private _passwordService: PasswordService,
        private _formBuilder: FormBuilder,
        // private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService
    ) {

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.user_id = this.currentUser.data.id;
        this.passwordForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id:[this.user_id, Validators.required],
            current_password: ['', Validators.required],
            new_password: ['', Validators.required],
            confirm_password: ['', [Validators.required, confirmPasswordValidator]]
        });
        // Update the validity of the 'confirm_password' field
        // when the 'password' field changes
        this.passwordForm.get('new_password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.passwordForm.get('confirm_password').updateValueAndValidity();
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
    PassworSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.passwordForm.invalid) {
            return;
        }
        this.userService.ChangePassword(this.passwordForm.value).pipe(first()).subscribe(
            data => {
                this.status_code = data;
                this.status = data;
                if (this.status_code.status_code == 200 && this.status.status == "success") {
                    this.message = data;
                    this.MessageSuccess = this.message.message;
                    this.alertService.success(this.MessageSuccess, true);
                }
                else if (this.status_code.status_code == 200 && this.status.status == "errors") {
                    this.errors = data;
                    this.MessageError = this.errors.errors;
                    this.alertService.error(this.MessageError, true);
                }
                else {
                    this.message = data;
                    this.MessageError = this.message.message;
                    this.alertService.error(this.MessageError, true);
                }
            },
            error => {
                this.alertService.error(error);
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

