import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild, Inject } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FuseMatchMediaService } from '@fuse/services/match-media.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { first } from 'rxjs/operators';
import { Location } from '@angular/common'

@Component({
    selector: 'fuse-shortcuts',
    templateUrl: './shortcuts.component.html',
    styleUrls: ['./shortcuts.component.scss']
})
export class FuseShortcutsComponent implements OnInit, OnDestroy {
    shortcutItems: any[];
    navigationItems: any[];
    filteredNavigationItems: any[];
    searching: boolean;
    mobileShortcutsPanelActive: boolean;
    /*  animal: string;
     name: string; */
    @Input()
    navigation: any;

    @ViewChild('searchInput')
    searchInputField;

    @ViewChild('shortcuts')
    shortcutsEl: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {Renderer2} _renderer
     * @param {CookieService} _cookieService
     * @param {FuseMatchMediaService} _fuseMatchMediaService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {ObservableMedia} _observableMedia
     */
    constructor(
        private Location: Location,
        private _cookieService: CookieService,
        private _fuseMatchMediaService: FuseMatchMediaService,
        private _fuseNavigationService: FuseNavigationService,
        private _observableMedia: ObservableMedia,
        private _renderer: Renderer2,
        public dialog: MatDialog,
    ) {
        // Set the defaults
        this.shortcutItems = [];
        this.searching = false;
        this.mobileShortcutsPanelActive = false;

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
        // Get the navigation items and flatten them
        this.filteredNavigationItems = this.navigationItems = this._fuseNavigationService.getFlatNavigation(this.navigation);

        if (this._cookieService.check('FUSE2.shortcuts')) {
            this.shortcutItems = JSON.parse(this._cookieService.get('FUSE2.shortcuts'));
        }
        else {
            // User's shortcut items
            this.shortcutItems = [
                {
                    'title': 'Vision',
                    'type': 'item',
                    'icon': 'center_focus_strong',
                    'click': 'visionMissionOpen'

                },
                {
                    'title': 'Mission',
                    'type': 'item',
                    'icon': 'trending_up',
                    'click': 'visionMissionOpen'

                },
                {
                    'title': 'Values',
                    'type': 'item',
                    'icon': 'local_library',
                    'click': 'visionMissionOpen'
                },
                {
                    'title': 'CEO`S msg',
                    'type': 'item',
                    'icon': 'speaker_notes',
                    'click': 'visionMissionOpen'

                },
                // {
                //     'title': 'Calendar',
                //     'type': 'item',
                //     'icon': 'today',
                //     'url': '/apps/calendar'

                // },

                // {
                //     'title': 'Mail',
                //     'type': 'item',
                //     'icon': 'email',
                //     'url': '/apps/mail'
                // },
                {
                    'title': 'Contacts',
                    'type': 'item',
                    'icon': 'account_box',
                    'url': '/apps/contacts'
                },
                // {
                //     'title': 'To-Do',
                //     'type': 'item',
                //     'icon': 'check_box',
                //     'url': '/apps/todo'

                // },
                {
                    'title': 'News',
                    'type': 'item',
                    'icon': 'event_note'
                },
            ];
        }

        // Subscribe to media changes
        this._fuseMatchMediaService.onMediaChange
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                if (this._observableMedia.isActive('gt-sm')) {
                    this.hideMobileShortcutsPanel();
                }
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
    goback() {
        this.Location.back();
    }
    gonext() {
        this.Location.forward();
    }
    visionMissionOpen(str: string): void {
        const dialogRef = this.dialog.open(VisionMissionDialog, {
            width: '959px',
            height: '335px',
            data: str
        });
        dialogRef.afterClosed().subscribe(result => {
            //this.animal = result;
        });
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Search
     *
     * @param event
     */
    search(event): void {
        const value = event.target.value.toLowerCase();
        if (value === '') {
            this.searching = false;
            this.filteredNavigationItems = this.navigationItems;

            return;
        }
        this.searching = true;
        this.filteredNavigationItems = this.navigationItems.filter((navigationItem) => {
            return navigationItem.title.toLowerCase().includes(value);
        });
    }
    /**
     * Toggle shortcut
     *
     * @param event
     * @param itemToToggle
     */
    toggleShortcut(event, itemToToggle): void {
        event.stopPropagation();
        for (let i = 0; i < this.shortcutItems.length; i++) {
            if (this.shortcutItems[i].url === itemToToggle.url) {
                this.shortcutItems.splice(i, 1);
                // Save to the cookies
                this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
                return;
            }
        }
        this.shortcutItems.push(itemToToggle);
        // Save to the cookies
        this._cookieService.set('FUSE2.shortcuts', JSON.stringify(this.shortcutItems));
    }
    /**
     * Is in shortcuts?
     *
     * @param navigationItem
     * @returns {any}
     */
    isInShortcuts(navigationItem): any {
        return this.shortcutItems.find(item => {
            return item.url === navigationItem.url;
        });
    }
    /**
     * On menu open
     */
    onMenuOpen(): void {
        setTimeout(() => {
            this.searchInputField.nativeElement.focus();
        });
    }
    /**
     * Show mobile shortcuts
     */
    showMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = true;
        this._renderer.addClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }
    /**
     * Hide mobile shortcuts
     */
    hideMobileShortcutsPanel(): void {
        this.mobileShortcutsPanelActive = false;
        this._renderer.removeClass(this.shortcutsEl.nativeElement, 'show-mobile-panel');
    }
}
/* export interface DialogData {
      animal: string;
      name: string;
    } */
@Component({
    selector: 'visionmission-dialog',
    templateUrl: 'visionmission.component.html',
})
export class VisionMissionDialog implements OnInit {
    currentUser: any;
    titleDataGet: any;
    message_of_ceo: string;
    constructor(
        public dialogRef: MatDialogRef<VisionMissionDialog>,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

    }
    ngOnInit(): void {
        this.titleDataGet = this.data;
        this.viewVisionData();
    }
    definitionClose(): void {
        this.dialogRef.close();
    }
    viewVisionData() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.VisionDataView(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                if (this.titleDataGet == 'Vision') {
                    this.message_of_ceo = data.data.vision;
                }
                else if (this.titleDataGet == 'Mission') {
                    this.message_of_ceo = data.data.mission;
                }
                else if (this.titleDataGet == 'Values') {
                    this.message_of_ceo = data.data.values;
                }
                else {
                    this.message_of_ceo = data.data.message_of_ceo;
                }
            },
            error => {
                this.alertService.error(error);
            });
    }
}