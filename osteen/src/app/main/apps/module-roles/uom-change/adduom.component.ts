import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {  Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
@Component({
  selector: 'add-uom-dialog',
  templateUrl: 'adduom.component.html',
})
export class AddUomDialog {
    direction = 'row';
    currentUser: any;
    addUomForm: FormGroup;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddUomDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
    // Set the private defaults
       this._unsubscribeAll = new Subject();
    }
    addUomClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.addUomForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            company_id : [company_id, Validators.required],
            name : ['', Validators.required]/*,
            enable     : ['Yes', Validators.required]*/
        });
    }
    addUomSubmit() {
        this.submitted = true;
        // stop here if addUomForm is invalid
        if (this.addUomForm.invalid) {
            return;
        }
        this.userService.addUomChange(this.addUomForm.value)
            .pipe(first())
            .subscribe(
                data => {
                  this.status_code = data;
                    if(this.status_code.status_code == 200){
                        this.MessageSuccess = data;
                        this.alertService.success(this.MessageSuccess.message, true);
                        this.dialogRef.close('YesSubmit');
                   }
                   else{
                        this.MessageError = data;
                        this.alertService.error(this.MessageError.message, true);
                   }
                },
                error => {
                    this.alertService.error(error);

                });
    }
}