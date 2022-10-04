import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
import { User } from '../../_models';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
  selector: 'edit-faq-dialog',
  templateUrl: 'editfaq-change.component.html',
})
export class EditFaqDialog {
    direction = 'row';
    currentUser: any;
    EditDataGet:any;
    editFaqForm: FormGroup;
    submitted = false;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '15rem',
        minHeight: '5rem',
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
        public dialogRef: MatDialogRef<EditFaqDialog>,
        @Inject(MAT_DIALOG_DATA) public data: User,
        private _formBuilder: FormBuilder,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    }
    editFaqClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void
    {
        this.EditDataGet = this.data;
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        // Reactive Form
        this.editFaqForm = this._formBuilder.group({
            login_access_token : [login_access_token, Validators.required],
            company_id : [company_id, Validators.required],
            question : [this.EditDataGet.question, Validators.required],
            answer : [this.EditDataGet.answer, Validators.required],
            faq_id : [this.EditDataGet.faq_id, Validators.required]
        });
    }
    editFaqSubmit() {
        this.submitted = true;
        // stop here if editFaqForm is invalid
        if (this.editFaqForm.invalid) {
            return;
        }
        this.userService.editFaqChange(this.editFaqForm.value)
            .pipe(first())
            .subscribe(
                data => {
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