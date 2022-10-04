import { Component,  Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
@Component({
  selector: 'edit-objective',
  templateUrl: 'editobjective.component.html',
})
export class EditObjective {
    direction = 'row';
    currentUser: any;
    EditDataGet:any;
    editObjForm: FormGroup;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    allDetailsCompany: any;
    company_id: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditObjective>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    }
    editObjClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
        this.EditDataGet = this.data;
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        // Reactive Form
        this.editObjForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            business_objective : [this.EditDataGet.business_objective, Validators.required],
            keywords : [this.EditDataGet.keywords, Validators.required],
            business_objective_id : [this.EditDataGet.business_objective_id, Validators.required]
        });
    }
    editObjSubmit() {
        this.submitted = true;
        // stop here if editPriorityForm is invalid
        if (this.editObjForm.invalid) {
            return;
        }
        this.editObjForm.value.company_id = this.company_id;
        this.userService.editBusinessObj(this.editObjForm.value)
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
export interface DialogData {
  animal: string;
  name: string;
}