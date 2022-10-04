import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from 'app/main/apps/dashboards/analytics/dateadapter';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
    selector: 'add-mom',
    templateUrl: './add-mom.html',
    styleUrls: ['./add-mom.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddMomComponent {
    governanceFormGroup: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    currentUser: any;
    unit_id: any;
    proProjectUser: any;
    private _unsubscribeAll: Subject<any>;
    company_id: any;
    project_id: any;
    proCompanyUsers: any;
    project_step_id: any;
    proCompanyUser: any;
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
    selectedSearchUser: any;
    constructor(
        public dialogRef: MatDialogRef<AddMomComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) {
    }
    PopupClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.company_id = this.currentUser.data.company_id;
        this.project_id = this.data;
        // Reactive governanceFormGroup
        this.singleViewProjects();

        this.governanceFormGroup = this._formBuilder.group({
            company_id: [this.company_id, Validators.required],
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            project_id: this.project_id,
            project_gov_id: [''],
            project_gov_memebers_id: [''],
            Mom: ['', Validators.required],
            projectDetails: ['governanceProject'],
        });

    }
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.proCompanyUser = data.data.project_goverances[0];
                this.selectedSearchUser = this.proCompanyUser.meeting_name;
                console.log("meetingname", this.selectedSearchUser);


            },
            error => {
                this.alertService.error(error);
            });
    }

    /*    companyUserSearch(value) {
           this.selectedSearchUser = this.searchCompanyUser(value);
       }
       // Filter the user list and send back to populate the selectedSearchUser**
       searchCompanyUser(value: string) {
           let filter = value.toLowerCase();
           return this.proCompanyUser.filter(option => option.name.toLowerCase().startsWith(filter));
       } */
    addMomSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        console.log('value', this.governanceFormGroup.value);
        if (this.governanceFormGroup.invalid) {
            return;

        }

        else {
            console.log('value');
        }

    }
    // addMomSubmit() {
    //     this.submitted = true;
    //     // stop here if AddtaskForm is invalid
    //     if (this.governanceFormGroup.invalid) {
    //         return;
    //     }
    //     let ProData = {
    //         "login_access_token": this.currentUser.login_access_token,
    //         "project_id": this.project_id,
    //         "govMeting": [{
    //             "project_id": this.governanceFormGroup.value.project_id,
    //             "project_gov_id": this.governanceFormGroup.value.project_gov_id,

    //             "agenda": this.governanceFormGroup.value.agenda,
    //         }
    //         ]
    //     }
    //     this.userService.ProjectAdd(ProData).pipe(first()).subscribe((data: any) => {
    //         if (data.status_code == 200) {
    //             this.alertService.success(data.message, true);
    //             this.dialogRef.close('YesSubmit');
    //         } else {
    //             this.MessageError = data;
    //         }
    //     },
    //         error => {
    //             this.alertService.error(error);
    //         });
    // }
}