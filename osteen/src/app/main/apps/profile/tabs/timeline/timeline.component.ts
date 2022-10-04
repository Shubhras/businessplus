import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, UserService } from 'app/main/apps/_services';

import { ProfileService } from '../../profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { first } from 'rxjs/operators';

@Component({
    selector: 'profile-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileTimelineComponent implements OnInit, OnDestroy {
    timeline: any;
    addpostForm: FormGroup;
    // Private
    private _unsubscribeAll: Subject<any>;
    status_code: any;
    MessageSuccess: any;
    MessageError: any;
    currentUser: any;
    userPicture: any;
    selectedFile: File = null;
    login_access_token: any;
    user_id: any;
    role_id: any;
    company_id: any;
    post_data: any;
    content: any;
    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     * 
     */

    constructor(
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.login_access_token = this.currentUser.login_access_token;
        this.user_id = this.currentUser.data.id;
        this.role_id = this.currentUser.role_id;
        this.company_id = this.currentUser.data.company_id;
        this._profileService.timelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timeline => {
                this.timeline = timeline;
                console.log('kkk', this.timeline);

            });

        this.addpostForm = this._formBuilder.group({
            login_access_token: [this.login_access_token, Validators.required],
            // user_id: [this.user_id, Validators.required],
            // company_id: [this.company_id, Validators.required],
            content: ['', Validators.required],
        });
        this.getAllPost();
    }
    profileSelected(event: any) {
        this.selectedFile = <File>event.target.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
            this.userPicture = event.target.result;
        }
        // this.pictureUpload();
    }
    getAllPost() {
        this.userService.getAllPost(this.login_access_token, this.user_id, 12, this.company_id).pipe(first()).subscribe(
            (data: any) => {
            
              let temp = data.data;
              this.post_data = temp[0];
              this.content = this.post_data.content;
              console.log('post_data',this.post_data);
              
            },
            error => {
                this.alertService.error(error);
            });

    }
    addPost() {
        const fd = new FormData();
        fd.append('login_access_token', this.currentUser.login_access_token);
        fd.append('user_id', this.user_id);
        fd.append('group_id', '12');
        fd.append('company_id', this.company_id);
        fd.append('photo', this.selectedFile, this.selectedFile.name);
        fd.append('content', this.addpostForm.value.content);

        console.log("formdata222", this.addpostForm.value);
        // console.log('addpost', this.addpostForm.value);
        this.userService.createPost(fd).pipe(first()).subscribe(
            (data: any) => {
                this.status_code = data;
                if (this.status_code.status_code == 200) {
                    this.MessageSuccess = data;
                    this.alertService.success(this.MessageSuccess.message, true);
                    this.addpostForm.reset();
                    this.userPicture ="";
                    this.getAllPost();
                }
                else {
                    this.MessageError = data;
                    this.alertService.error(this.MessageError.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
