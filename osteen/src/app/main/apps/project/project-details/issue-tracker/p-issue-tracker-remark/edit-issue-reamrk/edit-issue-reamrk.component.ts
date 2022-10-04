import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
@Component({
  selector: 'app-edit-issue-reamrk',
  templateUrl: './edit-issue-reamrk.component.html',
  styleUrls: ['./edit-issue-reamrk.component.scss']
})
export class EditIssueReamrkComponent implements OnInit {

  EditIssurRemarkGetData: any;
  EditIssueRemarkForm: any;
  currentUser: any;
  DataStatus: any;
  selectedFile: File = null;
  submitted = false;
  user_id: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditIssueReamrkComponent>,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.EditIssurRemarkGetData = this.data;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.EditIssueRemarkForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      user_id: [this.user_id],
      issue_id: [this.EditIssurRemarkGetData.issue_id, Validators.required],
      issue_remark_id: [this.EditIssurRemarkGetData.id, Validators.required],
      status_id: [this.EditIssurRemarkGetData.status_id, Validators.required],
      remark: [this.EditIssurRemarkGetData.remark, Validators.required],
    });
    this.SelectModuleGet();
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  editIssueRmark() {
    this.submitted = true;
    // stop here if EditIssueRemarkForm is invalid
    if (this.EditIssueRemarkForm.invalid) {
      return;
    }
    const fd = new FormData();
    fd.append('login_access_token', this.EditIssueRemarkForm.value.login_access_token);
    fd.append('issue_id', this.EditIssueRemarkForm.value.issue_id);
    fd.append('issue_remark_id', this.EditIssueRemarkForm.value.issue_remark_id);
    if (this.selectedFile != undefined) {
      fd.append('upload_id', this.selectedFile, this.selectedFile.name);
    }
    fd.append('status_id', this.EditIssueRemarkForm.value.status_id);
    fd.append('remark', this.EditIssueRemarkForm.value.remark);
    this.userService.AddEditDeleteIssueRmark(fd).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.dialogRef.close('YesSubmit');
        }
        else {
          this.alertService.error(data.message);
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
  EditIssueRemarkClose(): void {
    this.dialogRef.close();
  }
}
