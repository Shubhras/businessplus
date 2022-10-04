import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-priority-dialog',
    templateUrl: 'add-priority.component.html',
})
export class AddPriorityDialog {
    direction = 'row';
    currentUser: any;
    addPriorityForm: FormGroup;
    submitted = false;;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddPriorityDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    addPriorityClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.addPriorityForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            name: ['', Validators.required]
        });
    }
    addPrioritySubmit() {
        this.submitted = true;
        // stop here if addPriorityForm is invalid
        if (this.addPriorityForm.invalid) {
            return;
        }
        this.userService.addPriorityChange(this.addPriorityForm.value).pipe(first()).subscribe(
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
export interface DialogData {
    animal: string;
    name: string;
}