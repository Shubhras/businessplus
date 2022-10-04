import { Component,  Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Subject } from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
@Component({
  selector: 'edit-priority-dialog',
  templateUrl: 'editpriority.component.html',
})
export class EditPriorityDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet:any;
    editPriorityForm: FormGroup;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    allDetailsCompany: any;
    company_id:any;
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<EditPriorityDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    }
    editPriorityClose(): void {
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
        this.editPriorityForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            business_priority : [this.EditDataGet.business_priority, Validators.required],
            keywords : [this.EditDataGet.keywords, Validators.required],
            business_priority_id : [this.EditDataGet.business_priority_id, Validators.required]
        });
    }
    editPrioritySubmit() {
        this.submitted = true;
        // stop here if editPriorityForm is invalid
        if (this.editPriorityForm.invalid) {
            return;
        }
        this.editPriorityForm.value.company_id = this.company_id;
        this.userService.editBusinessPriority(this.editPriorityForm.value).pipe(first()).subscribe(
            (data:any) => {
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