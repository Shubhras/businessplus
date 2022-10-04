import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'edit-business-dialog',
    templateUrl: 'editbusiness.component.html',
})
export class EditBusinessDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    editBusinessForm: FormGroup;
    submitted = false;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditBusinessDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    editBusinessClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        // Reactive Form
        this.editBusinessForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            business_initiative: [this.EditDataGet.business_initiative, Validators.required],
            business_initiatives_id: [this.EditDataGet.business_initiatives_id, Validators.required],
            enable: [this.EditDataGet.enable, Validators.required]
        });
    }
    editBusinessSubmit() {
        this.submitted = true;
        // stop here if editBusinessForm is invalid
        if (this.editBusinessForm.invalid) {
            return;
        }
        this.userService.editBusinessChange(this.editBusinessForm.value).pipe(first()).subscribe((data: any) => {
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
}