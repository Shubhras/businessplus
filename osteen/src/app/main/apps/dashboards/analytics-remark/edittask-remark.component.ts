import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';

@Component({
    selector: 'edit-task-remark-dialog',
    templateUrl: 'edittask-remark.component.html',
})
export class EditTaskRemarkDialog {
    direction = 'row';
    selectedFile: File = null;
    EditTaskRemarkGetData: any;
    EditTaskRemarkForm: FormGroup;
    currentUser: any;
    login_access_token:string;
    user_id:number;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataStatus: any;
    status_id: any;
    remark: string;
    //private _unsubscribeAll: Subject<any>;

    constructor(
        public dialogRef: MatDialogRef<EditTaskRemarkDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        //this._unsubscribeAll = new Subject();
    }
    EditTaskRemarkClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.EditTaskRemarkGetData = this.data;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        this.login_access_token = this.currentUser.login_access_token;
        let tasks_id = this.EditTaskRemarkGetData.tasks_id;
        let task_remark_id = this.EditTaskRemarkGetData.task_remark_id;
        let task_user_id = this.EditTaskRemarkGetData.user_id;
        // Reactive EditTaskRemarkForm
        this.EditTaskRemarkForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            tasks_id: [tasks_id, Validators.required],
            task_remark_id: [task_remark_id, Validators.required],
            task_user_id: [task_user_id, Validators.required],
            user_id: [this.user_id, Validators.required],
            status_id: ['', Validators.required],
            remark: [],
        });
        this.SelectModuleGet();
    }
    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }
    TasksrRmarkEdit() {
        this.submitted = true;
        // stop here if EditTaskRemarkForm is invalid
        /* if (this.EditTaskRemarkForm.invalid) {
             return;
         }*/
        const fd = new FormData();
        if (this.selectedFile != undefined) {
            fd.append('upload_id', this.selectedFile, this.selectedFile.name);
        }
        if (this.EditTaskRemarkForm.value.remark != undefined) {
            fd.append('remark', this.EditTaskRemarkForm.value.remark);
        }
        fd.append('login_access_token', this.EditTaskRemarkForm.value.login_access_token);
        fd.append('tasks_id', this.EditTaskRemarkForm.value.tasks_id);
        fd.append('task_remark_id', this.EditTaskRemarkForm.value.task_remark_id);
        fd.append('task_user_id', this.EditTaskRemarkForm.value.task_user_id);
        fd.append('user_id', this.EditTaskRemarkForm.value.user_id);
        fd.append('status_id', this.EditTaskRemarkForm.value.status_id);
        this.userService.EditTasksrRmark(fd).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                } else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.DataStatus = data.data.status;
            },
            error => {
                this.alertService.error(error);
            });
    }
}