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
    selector: 'add-governance',
    templateUrl: './add-governance.html',
    styleUrls: ['./add-governance.scss'],
    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }
    ]
})
export class AddGovernanceComponent {
    minDate = new Date();
    direction = 'row';
    governanceFormGroup: FormGroup;
    submitted = false;
    message: any;
    MessageError: any;
    issue_start_date: any;
    issue_end_date: any;
    currentUser: any;
    unit_id: any;
    proProjectUser: any;
    private _unsubscribeAll: Subject<any>;
    company_id: any;
    project_id: any;
    proCompanyUsers: any;
    project_step_id: any;
    proCompanyUser: any;
    selectedProCompanyUser: Array<number> = [];
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
        public dialogRef: MatDialogRef<AddGovernanceComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public datepipe: DatePipe
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
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
        this.governanceFormGroup = this._formBuilder.group({
            company_id: [this.company_id, Validators.required],
            login_access_token: [login_access_token, Validators.required],
            unit_id: [this.unit_id, Validators.required],
            project_id: this.project_id,
            project_gov_id: [''],
            project_gov_memebers_id: [''],
            meeting_name: ['', Validators.required],
            chair_person: ['', Validators.required],
            co_chair_person: ['', Validators.required],
            gov_member: ['', Validators.required],
            gov_frequency: ['', Validators.required],
            meeting_day: [''],
            meeting_shedule: [''],
            gov_venue: ['', Validators.required],
            gov_duration: ['', Validators.required],
            agenda: ['', Validators.required],
            projectDetails: ['governanceProject'],
        });
        this.singleViewProjects();
    }
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.proCompanyUser = data.data.project_member_data;
                this.selectedSearchUser = this.proCompanyUser;
                this.proCompanyUsers = data.data.project_member_data[0];
                this.project_id = this.proCompanyUsers.project_id;
                this.proProjectUser = data.data.projectData[0];
                console.log("stepppp_id", this.proProjectUser);
                this.project_step_id = this.proProjectUser.project_step_id;
                console.log("stepppp_id", this.project_step_id);
            },
            error => {
                this.alertService.error(error);
            });
    }
    proCompanyUserChange(event: any, index: number) {
        this.selectedProCompanyUser[index] = event;
    }
    /*    companyUserSearch(value) {
           this.selectedSearchUser = this.searchCompanyUser(value);
       }
       // Filter the user list and send back to populate the selectedSearchUser**
       searchCompanyUser(value: string) {
           let filter = value.toLowerCase();
           return this.proCompanyUser.filter(option => option.name.toLowerCase().startsWith(filter));
       } */
    addGovernance() {
        this.submitted = true;
        // stop here if AddtaskForm is invalid
        if (this.governanceFormGroup.invalid) {
            return;
        }
        let ProData = {
            "login_access_token": this.currentUser.login_access_token,
            "project_id": this.project_id,
            "projectDetails": "governanceProject",
            "govMeting": [{
                "project_id": this.governanceFormGroup.value.project_id,
                "project_gov_id": this.governanceFormGroup.value.project_gov_id,
                "meeting_name": this.governanceFormGroup.value.meeting_name,
                "chair_person": this.governanceFormGroup.value.chair_person,
                "co_chair_person": this.governanceFormGroup.value.co_chair_person,
                "gov_member": this.governanceFormGroup.value.gov_member.toString(),
                "gov_frequency": this.governanceFormGroup.value.gov_frequency,
                "meeting_day": this.governanceFormGroup.value.meeting_day,
                "meeting_shedule": this.governanceFormGroup.value.meeting_shedule,
                "gov_venue": this.governanceFormGroup.value.gov_venue,
                "gov_duration": this.governanceFormGroup.value.gov_duration,
                "agenda": this.governanceFormGroup.value.agenda,
            }
            ]
        }
        this.userService.ProjectAdd(ProData).pipe(first()).subscribe((data: any) => {
            if (data.status_code == 200) {
                this.alertService.success(data.message, true);
                this.dialogRef.close('YesSubmit');
            } else {
                this.MessageError = data;
            }
        },
            error => {
                this.alertService.error(error);
            });
    }
}