import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-category-dialog',
    templateUrl: 'addcategory.component.html',
})
export class AddCategoryDialog {
    direction = 'row';
    currentUser: any;
    user_id:number;
    addCategoryForm: FormGroup;
    submitted = false;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddCategoryDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    addCategoryClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.addCategoryForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            user_id: [this.user_id, Validators.required],
            category_name: ['', Validators.required],
            enable: ['Yes', Validators.required]
        });
    }
    addCategorySubmit() {
        this.submitted = true;
        // stop here if addCategoryForm is invalid
        if (this.addCategoryForm.invalid) {
            return;
        }
        this.userService.addCategoryChange(this.addCategoryForm.value).pipe(first()).subscribe(
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
}