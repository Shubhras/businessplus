import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'edit-threats',
    templateUrl: 'editthreats.component.html',
})
export class EditThreats {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    editThreatsForm: FormGroup;
    submitted = false;
    company_id: any;
    allDetailsCompany: any;
    cYear: any;
    fYear: any;
    start_date: any;
    end_date: any;
    // Private
    constructor(
        public dialogRef: MatDialogRef<EditThreats>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }
    editThreatsClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.cYear = this.currentUser.userSelectedYear;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.fYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        // Reactive Form
        this.editThreatsForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            threats: [this.EditDataGet.threats, Validators.required],
            keywords: [this.EditDataGet.keywords, Validators.required],
            threats_id: [this.EditDataGet.threats_id]
        });
        if (this.fYear == 'jan-dec') {
            this.start_date = "01-01-" + this.cYear;
            this.end_date = "31-12-" + this.cYear;
            console.log(this.start_date);
            console.log(this.end_date);

        }
        else {
            this.start_date = "01-04-" + this.cYear;
            this.end_date = "01-03-" + (this.cYear + 1);
        }
    }
    editThreatsSubmit() {
        this.submitted = true;
        // stop here if editPriorityForm is invalid
        if (this.editThreatsForm.invalid) {
            return;
        }
        this.editThreatsForm.value.company_id = this.company_id;
        this.editThreatsForm.value.start_date = this.start_date;
        this.editThreatsForm.value.end_date = this.end_date;
        this.userService.editThreats(this.editThreatsForm.value)
            .pipe(first())
            .subscribe(
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