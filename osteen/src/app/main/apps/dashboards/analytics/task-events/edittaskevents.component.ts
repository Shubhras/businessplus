import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { User } from 'app/main/apps/_models';
@Component({
    selector: 'edit-task-dialog',
    templateUrl: 'edittaskevents.component.html',
})
export class EditTaskEventDialog {
    direction = 'row';
    currentUser: any;
    user_id: number;
    EditTaskEventForm: FormGroup;
    status_code: any;
    EditDataGet: any;
    submitted = false;
    MessageSuccess: any;
    MessageError: any;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
        width: '70rem',
        //width: 'auto',
        placeholder: 'Enter text here...',
        translate: 'no',
        uploadUrl: 'v1/images', // if needed
        customClasses: [ // optional
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ]
    };
    // Private
    private _unsubscribeAll: Subject<any>;
    constructor(
        // public dialogRef: MatDialogRef<EditTaskEventDialog>,
        // @Inject(MAT_DIALOG_DATA) public data: any,
        // private _formBuilder: FormBuilder,
        // private userService: UserService,
        // private alertService: AlertService
        public dialogRef: MatDialogRef<EditTaskEventDialog>,
        @Inject(MAT_DIALOG_DATA) public data: User,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // AddTaskPopupClose(): void {
    //     this.dialogRef.close();
    // }
    EditTaskPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditDataGet = this.data;
        console.log(this.data);
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.EditTaskEventForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            //company_id: [company_id, Validators.required],
            //user_id: [this.user_id, Validators.required],
            events_id: [this.EditDataGet.id, Validators.required],
            event_name: [this.EditDataGet.event_name, Validators.required],
            event_area: [this.EditDataGet.event_area, Validators.required],
            event_objective: [this.EditDataGet.event_objective, Validators.required],
            event_description: [this.EditDataGet.event_description, Validators.required],
        });
    }
    EditTaskEventSubmit() {

        console.log("add::", this.EditTaskEventForm);
        this.submitted = true;
        // stop here if EditUnitForm is invalid
        if (this.EditTaskEventForm.invalid) {
            return;
        }
        console.log('nextedit:::');
        this.userService.editTaskEventChange(this.EditTaskEventForm.value).pipe(first()).subscribe(
            (data: any) => {
                console.log('nextedit2:::');

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

