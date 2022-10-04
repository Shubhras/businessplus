import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';

@Component({
    selector: 'edit-project-remark-dialog',
    templateUrl: 'editproject-remark.component.html',
})
export class EditProjectRemarkDialog {
    direction = 'row';
    currentUser: any;
    selectedFile: File = null;
    EditProRemarkGetData: any;
    EditProRmarkForm: FormGroup;
    EditProRemarkModuleData: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataStatus: any;
    status_id: any;
    remark: string;
    private _unsubscribeAll: Subject<any>;
    user_id: any;

    constructor(
        public dialogRef: MatDialogRef<EditProjectRemarkDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    EditProjectRemarkClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditProRemarkGetData = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        let login_access_token = this.currentUser.login_access_token;
        let project_id = this.EditProRemarkGetData.project_id;
        let project_remark_id = this.EditProRemarkGetData.project_remark_id;
        let project_user_id = this.EditProRemarkGetData.user_id;
        // Reactive EditProRmarkForm
        this.EditProRmarkForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            project_id: [project_id, Validators.required],
            project_remark_id: [project_remark_id, Validators.required],
            user_id: [this.user_id, Validators.required],
            project_user_id: [project_user_id, Validators.required],
            status_id: ['', Validators.required],
            remark: [],
        });
        this.SelectModuleGet();
    }
    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }
    ProjectRmarkEdit() {
        this.submitted = true;
        // stop here if EditProRmarkForm is invalid
        /*if (this.EditProRmarkForm.invalid) {
            return;
        }*/
        const fd = new FormData();
        if (this.selectedFile != undefined) {
            fd.append('upload_id', this.selectedFile, this.selectedFile.name);
        }
        if (this.EditProRmarkForm.value.remark != undefined) {
            fd.append('remark', this.EditProRmarkForm.value.remark);
        }
        fd.append('login_access_token', this.EditProRmarkForm.value.login_access_token);
        fd.append('status_id', this.EditProRmarkForm.value.status_id);
        fd.append('project_id', this.EditProRmarkForm.value.project_id);
        fd.append('project_remark_id', this.EditProRmarkForm.value.project_remark_id);
        fd.append('user_id', this.EditProRmarkForm.value.user_id);
        this.userService.EditProjectRmark(fd)
            .pipe(first())
            .subscribe(
                data => {
                    this.status_code = data;
                    if (this.status_code.status_code == 200) {
                        this.MessageSuccess = data;
                        this.alertService.success(this.MessageSuccess.message, true);
                        this.dialogRef.close('YesSubmit');
                    } else {
                        this.MessageError = data;
                        this.alertService.error(this.MessageError.message, true);
                    }
                },
                error => {
                    this.alertService.error(error);
                });
    }
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            data => {
                this.EditProRemarkModuleData = data;
                this.DataStatus = this.EditProRemarkModuleData.data.status;
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