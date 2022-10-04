import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import { MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from '../../_services';
@Component({
    selector     : 'faq',
    templateUrl  : './business-faq.component.html',
    styleUrls    : ['./business-faq.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FaqBusinessComponent implements OnInit, OnDestroy
{
    currentUser: any;
    faqs: any;
    faqsFiltered: any;
    step: number;
    searchInput: any;
    faqAllData:any;
    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     *
     */
    constructor(
        private userService: UserService,
        private alertService: AlertService,
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');
        this.step = 0;
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    /**
     * On init
     */
    ngOnInit(): void
    {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.businessFaqGet(login_access_token,company_id).pipe(first()).subscribe((data:any) => {
                this.faqs = data.data;
                this.faqsFiltered = data.data;
                },
            error => {
                this.alertService.error(error);
        });
        this.searchInput.valueChanges.pipe(takeUntil(this._unsubscribeAll),debounceTime(300),distinctUntilChanged()).subscribe(searchText => {
            this.faqsFiltered = FuseUtils.filterArrayByString(this.faqs, searchText);
        });
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    /**
     * Set step
     *
     * @param {number} index
     */
    setStep(index: number): void
    {
        this.step = index;
    }
    /**
     * Next step
     */
    nextStep(): void
    {
        this.step++;
    }
    /**
     * Previous step
     */
    prevStep(): void
    {
        this.step--;
    }
}
