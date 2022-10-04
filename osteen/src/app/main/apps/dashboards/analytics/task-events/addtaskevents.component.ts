import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
    selector: 'add-task-dialog',
    templateUrl: 'addtaskevents.component.html',
})
export class AddTaskEventDialog {
    direction = 'row';
    currentUser: any;
    user_id: number;
    AddTaskForm: FormGroup;
    submitted = false;
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
        public dialogRef: MatDialogRef<AddTaskEventDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    AddTaskPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.AddTaskForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id, Validators.required],
            event_name: [''],
            event_area: [''],
            event_objective: [''],
            event_description: [''],
            company_id: [company_id, Validators.required],
        });
    }
    AddTaskSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddTaskForm.invalid) {
            return;
        }
        else {
            console.log('not true', this.AddTaskForm.value);
        }
        this.userService.addTaskEventChange(this.AddTaskForm.value).pipe(first()).subscribe(
            (data: any) => {

                if (data.status_code == 200) {
                    const storeUnitIdOld = this.currentUser.unit_id;
                    //let newUnitId = data.data.unit_id;
                    // const storeAllUnit = storeUnitIdOld.concat(',', newUnitId);
                    // this.currentUser.unit_id = storeAllUnit;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
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

