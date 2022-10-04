import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS  } from '@angular/material';
import { AlertService, UserService } from 'app/main/apps/_services';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
@Component({
  selector: 'app-add-issue-reamrk',
  templateUrl: './add-issue-reamrk.component.html',
  styleUrls: ['./add-issue-reamrk.component.scss'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
]
})
export class AddIssueReamrkComponent implements OnInit {
  minDate = new Date();
  AddIssueRemarkGetData: any;
  currentUser: any;
  selectedFile: File = null;
  submitted = false;
  login_access_token: any;
  AddIssueRemarkForm: FormGroup;
  DataStatus: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  user_id: any;

  constructor(
    public dialogRef: MatDialogRef<AddIssueReamrkComponent>,
    private userService: UserService,
    private alertService: AlertService,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datepipe: DatePipe
  ) { }

  AddIssueRmarkPopupClose(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.AddIssueRemarkGetData = this.data;
    this.user_id = this.currentUser.data.id;
    let issue_Id = this.AddIssueRemarkGetData.issue_id;
    this.AddIssueRemarkForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      user_id: [this.user_id],
      status_id: [],
      issue_revised_date: [],
      issueId: [issue_Id, Validators.required],
      remark: [],
    });
    this.SelectModuleGet();
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
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
  IssueRmarkAdd() {
    this.submitted = true;
    // stop here if AddTaskRemarkForm is invalid
    console.log(this.AddIssueRemarkForm.value)
    if (this.AddIssueRemarkForm.invalid) {
      console.log('hhii')
      return;
    }

    const fd = new FormData();
    if(this.AddIssueRemarkForm.value.issue_revised_date != ""){
      let latest_issue_revised_date = this.datepipe.transform(this.AddIssueRemarkForm.value.issue_revised_date, 'yyyy-MM-dd');
      this.AddIssueRemarkForm.value.issue_revised_date = latest_issue_revised_date;
      fd.append('issue_revised_date', this.AddIssueRemarkForm.value.issue_revised_date);
    }
    if (this.selectedFile != undefined) {
      fd.append('upload_id', this.selectedFile, this.selectedFile.name);
    }
    fd.append('status_id', this.AddIssueRemarkForm.value.status_id);
    fd.append('remark', this.AddIssueRemarkForm.value.remark);
    fd.append('login_access_token', this.AddIssueRemarkForm.value.login_access_token);
    fd.append('issue_id', this.AddIssueRemarkForm.value.issueId);
    this.userService.AddEditDeleteIssueRmark(fd).pipe(first()).subscribe(
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
}
