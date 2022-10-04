import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService, UserService } from 'app/main/apps/_services';

import { ProfileService } from 'app/main/apps/profile/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'feed-timeline',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FeedTimelineComponent implements OnInit, OnDestroy {
    timeline: any;
    AddPostForm: FormGroup;
    submitted = false;
    currentUser: any;
    user_id: number;
    user_name: any;

    posts: Array<any> = [
        {
            'user': {
                'name': 'Garry Newman',
                'avatar': 'assets/images/avatars/garry.jpg'
            },
            'message': 'Remember the place we were talking about the other night? Found it!',
            'time': '32 minutes ago',
            'type': 'post',
            'like': 5,
            'share': 21,
            'media': {
                'type': 'image',
                'preview': 'assets/images/profile/morain-lake.jpg'
            },
            'comments': [
                {
                    'user': {
                        'name': 'Alice Freeman',
                        'avatar': 'assets/images/avatars/alice.jpg'
                    },
                    'time': 'June 10, 2018',
                    'message': 'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.'
                }
            ]
        },
        //{
        //     'user': {
        //         'name': 'Andrew Green',
        //         'avatar': 'assets/images/avatars/andrew.jpg'
        //     },
        //     'message': 'Hey, man! Check this, it’s pretty awesome!',
        //     'time': 'June 12, 2018',
        //     'type': 'article',
        //     'like': 98,
        //     'share': 6,
        //     'article': {
        //         'title': 'Never stop changing!',
        //         'subtitle': 'John Westrock',
        //         'excerpt': 'John Westrock\'s new photo album called \'Never stop changing\' is published! It features more than 200 photos that will take you right in.',
        //         'media': {
        //             'type': 'image',
        //             'preview': 'assets/images/profile/never-stop-changing.jpg'
        //         }
        //     },
        //     'comments': [
        //         {
        //             'user': {
        //                 'name': 'Alice Freeman',
        //                 'avatar': 'assets/images/avatars/alice.jpg'
        //             },
        //             'time': 'June 10, 2018',
        //             'message': 'That’s a wonderful place. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat.'
        //         }
        //     ]
        // },
        // {
        //     'user': {
        //         'name': 'Carl Henderson',
        //         'avatar': 'assets/images/avatars/carl.jpg'
        //     },
        //     'message': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce et eleifend ligula. Fusce posuere in sapien ac facilisis. Etiam sit amet justo non felis ornare feugiat. Aenean lorem ex, ultrices sit amet ligula sed...',
        //     'time': 'June 10, 2018',
        //     'type': 'something',
        //     'like': 4,
        //     'share': 1
        // }

    ];

    // Private
    private _unsubscribeAll: Subject<any>;

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
        this._profileService.timelineOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(timeline => {
                this.timeline = timeline;
                console.log('kkk', this.timeline);

            });
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        this.user_name = this.currentUser.data.name;
        console.log(this.user_name);

        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.AddPostForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            user_id: [this.user_id, Validators.required],
            post_objkective: [''],

        });

    }

    AddPostSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddPostForm.invalid) {
            return;
        }
        else {
            console.log('value', this.AddPostForm.value);
        }

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
