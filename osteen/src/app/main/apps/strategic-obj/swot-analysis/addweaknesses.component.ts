import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-weaknesses',
    templateUrl: 'addweaknesses.component.html',
})
export class AddWeakness {
    direction = 'row';
    currentUser: any;
    addWeaknessForm: FormGroup;
    submitted = false;
    company_id: any;
    allDetailsCompany: any;
    cYear: any;
    fYear: any;
    start_date: any;
    end_date: any;
    unit_id: any;

    constructor(
        public dialogRef: MatDialogRef<AddWeakness>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
    }
    addWeaknessClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.cYear = this.currentUser.userSelectedYear;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.fYear = this.allDetailsCompany.general_data[0].financial_year;
        this.addWeaknessForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            weaknesses: ['', Validators.required],
            keywords: ['']
        });
        if (this.fYear == 'jan-dec') {
            this.start_date = "01-01-" + this.cYear;
            this.end_date = "31-12-" + this.cYear;
            // console.log(this.start_date);
            // console.log(this.end_date);

        }
        else {
            this.start_date = "01-04-" + this.cYear;
            this.end_date = "01-03-" + (this.cYear + 1);
        }
    }
    addWeaknessSubmit() {
        this.submitted = true;
        // stop here if addPriorityForm is invalid
        if (this.addWeaknessForm.invalid) {
            return;
        }
        this.addWeaknessForm.value.company_id = this.company_id;
        this.addWeaknessForm.value.unit_id = this.unit_id;

        this.addWeaknessForm.value.start_date = this.start_date;
        this.addWeaknessForm.value.end_date = this.end_date;
        this.userService.addWeakness(this.addWeaknessForm.value).pipe(first()).subscribe((data: any) => {
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
