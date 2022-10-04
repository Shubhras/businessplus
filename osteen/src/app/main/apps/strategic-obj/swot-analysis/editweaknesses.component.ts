import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'edit-weaknesses',
    templateUrl: 'editweaknesses.component.html',
})
export class EditWeakness {
    direction = 'row';
    currentUser: any;
    EditDataGet: any;
    editWeaknessForm: FormGroup;
    submitted = false;
    company_id: any;
    cYear: any;
    fYear: any;
    start_date: any;
    end_date: any;
    allDetailsCompany: any;
    // Private
    constructor(
        public dialogRef: MatDialogRef<EditWeakness>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {

    }
    editWeaknessClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.cYear = this.currentUser.userSelectedYear;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.fYear = this.allDetailsCompany.general_data[0].financial_year;
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        let login_access_token = this.currentUser.login_access_token;
        // Reactive Form
        this.editWeaknessForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            weaknesses: [this.EditDataGet.weaknesses, Validators.required],
            keywords: [this.EditDataGet.keywords, Validators.required],
            weaknesses_id: [this.EditDataGet.weaknesses_id]
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
    editWeaknessSubmit() {
        this.submitted = true;
        // stop here if editPriorityForm is invalid
        if (this.editWeaknessForm.invalid) {
            return;
        }
        this.editWeaknessForm.value.company_id = this.company_id;
        this.editWeaknessForm.value.start_date = this.start_date;
        this.editWeaknessForm.value.end_date = this.end_date;
        this.userService.editWeakness(this.editWeaknessForm.value)
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