import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { discardElement } from 'highcharts';
@Component({
    selector: 'add-strengths',
    templateUrl: 'addstrengths.component.html',
})
export class AddStrengths {
    direction = 'row';
    currentUser: any;
    addStrengthsForm: FormGroup;
    submitted = false;
    company_id: any;
    allDetailsCompany: any;
    cYear: any;
    fYear: any;
    start_date: any;
    end_date: any;
    unit_id: string;
    // Private
    constructor(
        public dialogRef: MatDialogRef<AddStrengths>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }
    addStrengthsClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.unit_id = localStorage.getItem('currentUnitId');
        let login_access_token = this.currentUser.login_access_token;
        this.cYear = this.currentUser.userSelectedYear;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.fYear = this.allDetailsCompany.general_data[0].financial_year;
        // console.log(this.fYear);
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.addStrengthsForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            strength: ['', Validators.required],
            keywords: ['']
        });

        if (this.fYear == 'jan-dec') {
            this.start_date = "01-01-" + this.cYear;
            this.end_date = "31-12-" + this.cYear;
        }
        else {
            this.start_date = "01-04-" + this.cYear;
            this.end_date = "30-03-" + (this.cYear + 1);;
        }

    }

    strengthsSubmit() {
        this.submitted = true;
        // stop here if addPriorityForm is invalid
        if (this.addStrengthsForm.invalid) {
            return;
        }

        this.addStrengthsForm.value.company_id = this.company_id;
        this.addStrengthsForm.value.unit_id = this.unit_id;

        //console.log(this.cYear);
        // console.log(this.fYear);

        // this.addStrengthsForm.value.financial_year = this.company_id;
        this.addStrengthsForm.value.start_date = this.start_date;
        this.addStrengthsForm.value.end_date = this.end_date;

        this.userService.addStrengths(this.addStrengthsForm.value).pipe(first()).subscribe((data: any) => {
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
