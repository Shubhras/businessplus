import { Component, OnDestroy, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { navigation } from 'app/navigation/navigation';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { Router } from '@angular/router';
//import { first } from 'rxjs/operators';
import { DataService } from "../../../../app/main/apps/event-home/unit-data.service";
import { DataYearService } from './year-select-data.service';
import { LoginUserAllDataService } from './login-user-all-data.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToolbarComponent implements OnInit, OnDestroy {
  horizontalNavbar: boolean;
  rightNavbar: boolean;
  hiddenNavbar: boolean;
  languages: any;
  navigation: any;
  selectedLanguage: any;
  userStatusOptions: any[];
  unit_name: any;
  UserName: string;
  userPicture: any;
  message: string;
  messageYear: string;
  currentUser: any;
  company_details: any;
  showCompanyYearList: any = [];
  private _unsubscribeAll: Subject<any>;
  allDetailsCompany: any;
  companyFinancialYear: any;
  companyCreateData: any;
  /**
   * Constructor
   *
   * @param {FuseConfigService} _fuseConfigService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {TranslateService} _translateService
   */
  constructor(
    private _fuseConfigService: FuseConfigService,
    private _fuseSidebarService: FuseSidebarService,
    private _translateService: TranslateService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
    private dataUnitService: DataService,
    private dataYearService: DataYearService,
    private loginUserAllDataService: LoginUserAllDataService,
    public datepipe: DatePipe,
  ) {
    // Set the defaults
    this.userStatusOptions = [
      {
        'title': 'Online',
        'icon': 'icon-checkbox-marked-circle',
        'color': '#4CAF50'
      },
      {
        'title': 'Away',
        'icon': 'icon-clock',
        'color': '#FFC107'
      },
      {
        'title': 'Do not Disturb',
        'icon': 'icon-minus-circle',
        'color': '#F44336'
      },
      {
        'title': 'Invisible',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#BDBDBD'
      },
      {
        'title': 'Offline',
        'icon': 'icon-checkbox-blank-circle-outline',
        'color': '#616161'
      }
    ];
    this.languages = [
      {
        id: 'en',
        title: 'English',
        flag: 'us'
      },
      {
        id: 'tr',
        title: 'Turkish',
        flag: 'tr'
      }
    ];
    this.navigation = navigation;
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    /* this.loginUserAllDataService.currentMessageUserAll.subscribe((value) => {
      console.log('change value',value);
    }) */
  }
  changeSelectYear = new FormControl();
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the year units
    this.dataUnitService.currentMessage.subscribe(message => {
      this.message = message;
      // sessionStorage.setItem('currentUnitName', this.message);
      localStorage.setItem('currentUnitName', this.message);
      this.unit_name = localStorage.getItem('currentUnitName');
    });
    // Subscribe
    // Subscribe to the config changes
    this._fuseConfigService.config.pipe(takeUntil(this._unsubscribeAll))
      .subscribe((settings) => {
        this.horizontalNavbar = settings.layout.navbar.position === 'top';
        this.rightNavbar = settings.layout.navbar.position === 'right';
        this.hiddenNavbar = settings.layout.navbar.hidden === true;
      });
    // Set the selected language from default languages
    this.selectedLanguage = _.find(this.languages, { 'id': this._translateService.currentLang });
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].financial_year : null;
    this.companyCreateData = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].company_created_date : null;

    this.UserName = this.currentUser ? this.currentUser.data.name : null;
    this.company_details = this.currentUser ? this.currentUser.data.company_details : null;
    this.userPicture = this.currentUser ? this.currentUser.data.profile_picture : null;
    if (this.userPicture != '') {
      this.userPicture = this.userPicture;
    }
    else {
      this.userPicture = "assets/images/avatars/profile.jpg";
    }
    const currentYear = new Date().getFullYear();
    let companyDataCreate = new Date(this.companyCreateData).getFullYear();
    for (let a = companyDataCreate; a <= currentYear + 14; a++) {
      if (this.companyFinancialYear == "april-march") {
        this.showCompanyYearList.push({ "year_key": a, "year_value": `${a}-${(a + 1).toString().substr(2, 2)}` });
        //console.log("year list", this.showCompanyYearList);

      }
      else {
        this.showCompanyYearList.push({ "year_key": a, "year_value": a });
      }
    }
    this.changeSelectYear.setValue(this.currentUser ? this.currentUser.userSelectedYear : null);
    // Use This Code For Strategic Object Component Get Started
    this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.changeSelectYear.setValue(messageYear);
    });
  }
  selectYearByUser(year: any) {
    this.currentUser.userSelectedYear = year;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    this.dataYearService.changeMessageYear(year);
  }
  selectOtherUnit() {
    /*sessionStorage.removeItem('currentUnitId');
    sessionStorage.removeItem('currentUnitName');*/
    this.router.navigate(['/apps/event-home']);
  }
  logout() {
    // clear unit name
    this.dataUnitService.clearMessages();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('LoginUserDetails');
    localStorage.removeItem('currentUnitId');
    localStorage.removeItem('currentUnitName');
    localStorage.removeItem('userModulePermission');
    localStorage.removeItem('modulePermissions');
    localStorage.clear();
    //sessionStorage.clear();
    this.authenticationService.logout();
    // location.reload();
    setTimeout(() => {
      this.router.navigateByUrl('/apps/home');
    }, 100);
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  /**
   * Toggle sidebar open
   *
   * @param key
   */
  toggleSidebarOpen(key): void {
    this._fuseSidebarService.getSidebar(key).toggleOpen();
  }
  /**
   * Search
   *
   * @param value
   */
  search(value): void {
    // Do your search here...
    //console.log(value);
  }

  /**
   * Set the language
   *
   * @param lang
   */
  setLanguage(lang): void {
    // Set the selected language for the toolbar
    this.selectedLanguage = lang;

    // Use the selected language for translations
    this._translateService.use(lang.id);
  }
}
