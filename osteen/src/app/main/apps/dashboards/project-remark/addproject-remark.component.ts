import { Component,  Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {  Subject } from 'rxjs';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
@Component({
  selector: 'add-project-remark-dialog',
  templateUrl: 'addproject-remark.component.html',
})
export class AddProjectRemarkDialog {
    direction = 'row';
    currentUser: any;
    selectedFile: File = null;
    AddProRemarkGetData:any;
    AddProRmarkForm: FormGroup;
    AddProRemarkModuleData: any;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    DataStatus: any;
    private _unsubscribeAll: Subject<any>;

  constructor(
    public dialogRef: MatDialogRef<AddProjectRemarkDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
      )
     {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    }

    AddProjectRemarkClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
        this.AddProRemarkGetData = this.data;
        let project_id = this.AddProRemarkGetData.project_id;
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        // Reactive AddProRmarkForm
        this.AddProRmarkForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            status_id  : [ ],
            project_id : [project_id, Validators.required],
            remark : [ ],

        });

        this.SelectModuleGet();
    }
    onFileSelected(event) {
        this.selectedFile = <File>event.target.files[0];
    }
    ProjectRmarkAdd() {
        this.submitted = true;
        // stop here if AddProRmarkForm is invalid
       /* if (this.AddProRmarkForm.invalid) {
            return;
        }*/
        const fd = new FormData();
        if (this.selectedFile == undefined && this.AddProRmarkForm.value.status_id == undefined && this.AddProRmarkForm.value.remark == undefined) {
           this.AddProjectRemarkClose();
            return ;
        }
        if (this.selectedFile != undefined) {
            fd.append('upload_id', this.selectedFile, this.selectedFile.name);
        }
        if (this.AddProRmarkForm.value.status_id != undefined) {
            fd.append('status_id', this.AddProRmarkForm.value.status_id);
        }
        if (this.AddProRmarkForm.value.remark != undefined) {
            fd.append('remark', this.AddProRmarkForm.value.remark);
        }
        fd.append('login_access_token', this.AddProRmarkForm.value.login_access_token);
        fd.append('project_id', this.AddProRmarkForm.value.project_id);
        this.userService.AddProjectRmark(fd)
            .pipe(first())
            .subscribe(
                data => {
                  this.status_code = data;
                    if(this.status_code.status_code == 200){
                        this.MessageSuccess = data;
                        this.alertService.success(this.MessageSuccess.message, true);
                        this.dialogRef.close('YesSubmit');
                   }else{
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
                 this.AddProRemarkModuleData = data;
                 this.DataStatus = this.AddProRemarkModuleData.data.status;
               // console.log('data',this.AddProRemarkModuleData);
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