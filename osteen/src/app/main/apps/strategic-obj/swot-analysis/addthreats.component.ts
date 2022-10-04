import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-threats',
    templateUrl: 'addthreats.component.html',
})
export class AddThreats {
    direction = 'row';
    currentUser: any;
    addThreatsForm: FormGroup;
    submitted = false;
    company_id: any;
    unit_id: any;
    allDetailsCompany: any;
    cYear: any;
    fYear: any;
    start_date: any;
    end_date: any;
    constructor(
        public dialogRef: MatDialogRef<AddThreats>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }
    addThreatsClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.cYear = this.currentUser.userSelectedYear;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.fYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.addThreatsForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            threats: ['', Validators.required],
            keywords: ['']
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
    addThreatsSubmit() {
        this.submitted = true;
        // stop here if addPriorityForm is invalid
        if (this.addThreatsForm.invalid) {
            return;
        }
        this.addThreatsForm.value.company_id = this.company_id;
        this.addThreatsForm.value.unit_id = this.unit_id;
        this.addThreatsForm.value.start_date = this.start_date;
        this.addThreatsForm.value.end_date = this.end_date;
        this.userService.addThreats(this.addThreatsForm.value).pipe(first()).subscribe((data: any) => {
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
