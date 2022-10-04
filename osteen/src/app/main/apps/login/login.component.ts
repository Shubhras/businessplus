import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../_services';
import { Router } from '@angular/router';
import { DataService } from "../../../../app/main/apps/event-home/unit-data.service";
import { LoginUserAllDataService } from 'app/layout/components/toolbar/login-user-all-data.service';
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    email: string;
    password: string;
    login_access_token: any;
    CurrentUserDetails: any;
    LoginUserDetails: any;
    currentUser: any;
    company_details: any;
    userModulePermission: any;
    signupUserDetails: any;
    test: any;
    unit: any;
    message: any;
    unit_name: any;
    allUnitsGet: any;
    /**
    * Constructor
    *
    * @param {FuseConfigService} _fuseConfigService
    * @param {FormBuilder} _formBuilder
    */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        // private route: ActivatedRoute,
        private router: Router,
        private data: DataService,
        private userService: UserService,
        private alertService: AlertService,
        private loginUserAllDataService: LoginUserAllDataService,
    ) {
        // redirect to dashboards if already logged in
        const currentUser = localStorage.getItem('currentUser');
        console.log("cureent-user", currentUser);

        // this.unit = this.currentUser.unit_id;
        // console.log("unit id", this.unit);

        /* if (currentUser && this.company_details == "true") { */
        if (currentUser) {
            this.router.navigate(['/apps/event-home']);
        }
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }
    /**
    * On init
    */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
        // this.data.currentMessage.subscribe(message => {
        // this.message = message;
        // console.log("yzyzyyzzyw", this.data);

        // // sessionStorage.setItem('currentUnitName', this.message);
        // localStorage.setItem('currentUnitName', this.message);
        // this.unit_name = localStorage.getItem('currentUnitName');
        // console.log("dfdffdfd", this.unit_name);

        // });
        // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // let unitr = this.currentUser.unit_id;
        // console.log(unitr);

        // console.log("unit-idd", unitr.split(','));
        // // console.log("unit-iwww", unitr.slice(0, 1).join(""));
        // let unitCount = unitr.split(',');
        // console.log("unit_array", unitCount[0]);

        // let unitLength = unitr.split(',').length;
        // if (unitLength == 1) {
        // // this.multiUnitsGet();
        // // this.data.changeMessage(un);
        // localStorage.setItem('currentUnitId', unitCount[0]);
        // //this.router.navigate(['/apps/main-dashboard']);
        // this.router.navigate(['/apps/prima-welcome']);
        // }

        if (localStorage.getItem('signupUserDetails')) {
            let signupUser = JSON.parse(localStorage.getItem('signupUserDetails'));
            this.loginForm = this._formBuilder.group({
                email: [signupUser.email, [Validators.required, Validators.email]],
                password: [signupUser.password, Validators.required]
            });
            this.userLogin();
        }
    }
    userLogin() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        this.userService.login(this.loginForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    const userSelectedYear = new Date().getFullYear();
                    data.userSelectedYear = userSelectedYear;
                    this.test = data.data.designation;
                    console.log("hello", this.test);

                    localStorage.setItem('currentUser', JSON.stringify(data));
                    localStorage.setItem('LoginUserDetails', JSON.stringify(data.data));
                    this.company_details = data.data.company_details;
                    if (this.company_details == "false") {
                        this.router.navigate(['/apps/company-setup']);
                    }
                    else {
                        this.modulesPermissionGet();
                    }
                } else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
    modulesPermissionGet() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getMenuPermission(login_access_token, role_id).pipe(first()).subscribe(
            (data: any) => {
                localStorage.setItem('userModulePermission', JSON.stringify(data.la_menu));
                // get Company Details
                this.userService.viewCompanySetting(login_access_token, company_id).pipe(first()).subscribe((data: any) => {
                    localStorage.setItem('allDetailsCompany', JSON.stringify(data.data));
                    this.router.navigate(['/apps/event-home']);
                    location.reload();
                },
                    error => {
                        this.alertService.error(error);
                    });
            },
            error => {
                this.alertService.error(error);
            });
    }
    // multiUnitsGet() {
    // let login_access_token = this.currentUser.login_access_token;
    // let unit_ids = this.currentUser.unit_id;
    // this.userService.getMultiUnits(login_access_token, unit_ids).pipe(first()).subscribe(
    // (data: any) => {
    // if (data) {
    // this.allUnitsGet = data.data[0].unit_name;
    // console.log("unit_name", this.allUnitsGet);

    // localStorage.setItem('currentUnitName', this.allUnitsGet);

    // // this.unitNAME = this.allUnitsGet.unit_name;

    // }
    // },
    // error => {
    // this.alertService.error(error);
    // });
    // }
}
