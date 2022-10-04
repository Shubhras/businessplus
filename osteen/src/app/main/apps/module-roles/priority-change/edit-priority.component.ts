import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'edit-priority-dialog',
    templateUrl: 'edit-priority.component.html',
})
export class EditPriorityDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    editPriorityForm: FormGroup;
    submitted = false;
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditPriorityDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    editPriorityClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        // Reactive Form
        this.editPriorityForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            name: [this.EditDataGet.name, Validators.required],
            id: [this.EditDataGet.id, Validators.required]/*,
            enable : [this.EditDataGet.enable, Validators.required]*/
        });
    }
    editPrioritySubmit() {
        this.submitted = true;
        // stop here if editPriorityForm is invalid
        if (this.editPriorityForm.invalid) {
            return;
        }
        this.userService.editPriorityChange(this.editPriorityForm.value).pipe(first()).subscribe(
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
}