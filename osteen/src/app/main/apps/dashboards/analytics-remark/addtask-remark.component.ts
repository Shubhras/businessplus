import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
    selector: 'add-task-remark-dialog',
    templateUrl: 'addtask-remark.component.html',
})
export class AddTaskRemarkDialog {
    direction = 'row';
    selectedFile: File = null;
    AddTaskRemarkGetData: any;
    AddTaskRemarkForm: FormGroup;
    currentUser: any;
    submitted = false;
    status_code: any;
    message: any;
    MessageSuccess: any;
    MessageError: any;
    DataStatus: any;
    //private _unsubscribeAll: Subject<any>;
    constructor(
        public dialogRef: MatDialogRef<AddTaskRemarkDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
       // this._unsubscribeAll = new Subject();
    }
    AddTaskRmarkPopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.AddTaskRemarkGetData = this.data;
        let task_id = this.AddTaskRemarkGetData.tasks_id;
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;

        // Reactive AddTaskRemarkForm
        this.AddTaskRemarkForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            status_id: [],
            task_id: [task_id, Validators.required],
            remark: [],
        });
        this.SelectModuleGet();
    }
    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }
    TasksRmarkAdd() {
        this.submitted = true;
        // stop here if AddTaskRemarkForm is invalid
        /*if (this.AddTaskRemarkForm.invalid) {
            return;
        }*/
        const fd = new FormData();
        if (this.selectedFile == undefined && this.AddTaskRemarkForm.value.status_id == undefined && this.AddTaskRemarkForm.value.remark == undefined) {
            this.AddTaskRmarkPopupClose();
            return;
        }
        if (this.selectedFile != undefined) {
            fd.append('upload_id', this.selectedFile, this.selectedFile.name);
        }
        if (this.AddTaskRemarkForm.value.status_id != undefined) {
            fd.append('status_id', this.AddTaskRemarkForm.value.status_id);
        }
        if (this.AddTaskRemarkForm.value.remark != undefined) {
            fd.append('remark', this.AddTaskRemarkForm.value.remark);
        }
        fd.append('login_access_token', this.AddTaskRemarkForm.value.login_access_token);
        fd.append('task_id', this.AddTaskRemarkForm.value.task_id);
        this.userService.AddTasksrRmark(fd).pipe(first()).subscribe(
            (data: any) => {
                this.status_code = data;
                if (this.status_code.status_code == 200) {
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.dialogRef.close('YesSubmit');
                }
                else {
                    this.MessageError = data;
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data:any) => {
                this.DataStatus = data.data.status;
            },
            error => {
                this.alertService.error(error);
            });
    }
}
