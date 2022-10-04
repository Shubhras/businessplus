import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-objective',
    templateUrl: 'addobjective.component.html',
})
export class AddObjective {
    direction = 'row';
    currentUser: any;
    user_id: number;
    addObjForm: FormGroup;
    submitted = false;
    allDetailsCompany: any;
    company_id: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddObjective>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    addObjClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.user_id = this.currentUser.data.id;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.addObjForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id, Validators.required],
            business_objective: ['', Validators.required],
            keywords: ['', Validators.required]
        });
    }
    addObjSubmit() {
        this.submitted = true;
        // stop here if addPriorityForm is invalid
        if (this.addObjForm.invalid) {
            return;
        }
        this.addObjForm.value.company_id = this.company_id;
        this.userService.addBusinessObj(this.addObjForm.value).pipe(first()).subscribe(
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