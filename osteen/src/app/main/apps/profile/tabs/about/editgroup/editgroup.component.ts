import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
// import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';

@Component({
  selector: 'app-editgroup',
  templateUrl: './editgroup.component.html',
  styleUrls: ['./editgroup.component.scss']
})
export class EditgroupComponent implements OnInit {
  LoginUserDetails: any;
  currentUser: any;
  login_access_token: string;
  EditGroupForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  editGroupDetails: any;

  // private _unsubscribeAll: Subject<any>;
  constructor(
    public dialogRef: MatDialogRef<EditgroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService
  
  ) { }
  EditGroupPopupClose(): void {
    this.dialogRef.close();
}
  ngOnInit() {
    this.editGroupDetails = this.data;
    // console.log("editgroup", this.editGroupDetails);
    let group_name = this.editGroupDetails.group_name;
    let group_description = this.editGroupDetails.group_description;
    let group_id = this.editGroupDetails.id;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;

       // Reactive Form
       this.EditGroupForm = this._formBuilder.group({
        login_access_token: [this.login_access_token, Validators.required],
        id: [group_id, Validators.required],
        group_name: [group_name, Validators.required],
        group_description: [group_description, Validators.required],
    });
  }

  // submit edit group data

  EditGroupSubmit() {
    this.submitted = true;
    if (this.EditGroupForm.invalid) {
        return;
    }
    // if (this.EditGroupForm.value.action_plan_id.length != 0
    //     && typeof this.EditKpiForm.value.action_plan_id[0] != 'number') {
    //     let ACTIONValue = [];
    //     this.EditKpiForm.value.action_plan_id.forEach(function (value) {
    //         ACTIONValue.push(value.action_plan_id);
            
    //     });
    //     console.log("ACTIONValue", ACTIONValue);
    //     this.EditKpiForm.value.action_plan_id = ACTIONValue;
    // }
    this.userService.groupEditSubmit(this.EditGroupForm.value).pipe(first()).subscribe(
        (data: any) => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
                this.MessageSuccess = data;
                this.alertService.success(this.MessageSuccess.message, true);
                this.dialogRef.close('YesSubmit');
            }
            else {
                this.MessageError = data;
                this.alertService.error(this.MessageError.message, true);
            }
        },
        error => {
            this.alertService.error(error);
        });
}
}
