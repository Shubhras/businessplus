import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { AngularEditorConfig } from '@kolkov/angular-editor';
@Component({
    selector: 'visionmission',
    templateUrl: './visionmission.component.html',
    styleUrls: ['./visionmission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class VisionmissionComponent implements OnInit {
    currentUser: any;
    viewVisionAllData: any;
    vision_id: any;
    vision: string;
    mission: string;
    values: string;
    message_of_ceo: string;
    highlights: string;
    visionForm: FormGroup;

    submitted = false;
    message: any;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        maxHeight: '20rem',
        minHeight: '8rem',
        width: '125rem',
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
    constructor(
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {

    }
    /**
     * On init
     */
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.ViewVisionData();
        this.visionForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            company_id: [company_id, Validators.required],
            id: new FormControl(''),
            vision: new FormControl('', Validators.required),
            mission: new FormControl('', Validators.required),
            values: new FormControl('', Validators.required),
            message_of_ceo: new FormControl('', Validators.required),
            highlights: new FormControl('', Validators.required),

        });
    }
    addeditVisionSubmit() {
        this.submitted = true;
        // stop here if visionForm is invalid
        if (this.visionForm.invalid) {
            return;
        }
        if (this.visionForm.value.id == '') {
            this.userService.VisionDataAdd(this.visionForm.value).pipe(first()).subscribe(
                (data: any) => {
                    if (data.status_code == 200) {
                        this.alertService.success(data.message, true);
                        this.ViewVisionData();
                    }
                    else {
                        this.alertService.error(data.message, true);
                    }
                },
                error => {
                    this.alertService.error(error);
                });
        }
        else {
            this.userService.VisionDataEdit(this.visionForm.value).pipe(first()).subscribe(
                (data: any) => {
                    if (data.status_code == 200) {
                        this.alertService.success(data.message, true);
                        this.ViewVisionData();
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
    ViewVisionData() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.VisionDataView(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                if (data.data) {
                    this.viewVisionAllData = data.data;
                    this.vision_id = this.viewVisionAllData.id;
                    this.mission = this.viewVisionAllData.mission;
                    this.vision = this.viewVisionAllData.vision;
                    this.values = this.viewVisionAllData.values;
                    this.message_of_ceo = this.viewVisionAllData.message_of_ceo;
                    this.highlights = this.viewVisionAllData.highlights;
                    this.visionForm.patchValue({ id: this.vision_id });
                    this.visionForm.patchValue({ vision: this.vision });
                    this.visionForm.patchValue({ mission: this.mission });
                    this.visionForm.patchValue({ values: this.values });
                    this.visionForm.patchValue({ message_of_ceo: this.message_of_ceo });
                    this.visionForm.patchValue({ highlights: this.highlights });

                }
            },
            error => {
                this.alertService.error(error);
            });
    }
}
