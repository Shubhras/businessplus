import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
//import { AuthenticationService } from '../_services';
import { FuseConfigService } from '@fuse/services/config.service';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    //_fuseConfigService: any;
    config: any;
    constructor(
        private router: Router,
        // private authenticationService: AuthenticationService
        private _fuseConfigService: FuseConfigService
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // const currentUser = this.authenticationService.currentUserValue;
        this._fuseConfigService.config
        .subscribe((config) => {
            this.config = config;
           // console.log('hi', this.config);
        });
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            // authorised so return true
            // change url of perent Module  by Permission
            const userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
            const modulePermissions = JSON.parse(localStorage.getItem('modulePermissions'))
            let stateUrl = state.url.replace('/apps/', "");
            const publicUrls = ['main-dashboard', 'event-home', 'prima-navigation', 'finance-operations', 'password', 'profile', 'company-setup'];
            if(stateUrl == 'project/project-details'){
                this.config.layout.navbar.folded = true;
            }else{
                this.config.layout.navbar.folded = true;
            }
            if (publicUrls.indexOf(stateUrl) !== -1) {
                return true;
            }
            let moduleObj = userModulePermission.filter((Module) => {
                return Module.display_url === stateUrl;
            })[0];
            if (moduleObj && moduleObj.acc_view === 1 && moduleObj.parent !== 0) {
                return true;
            } else if (moduleObj) {
                let findInModules;
                let routeToModule;
                if (moduleObj.parent === 0) {
                    findInModules = modulePermissions[moduleObj.id];
                    console.log('HHHHHHHHHHHHH'+findInModules);
                    
                } else {
                    findInModules = modulePermissions[moduleObj.parent];
                }
                for (let i = 0; i < findInModules.length; i++) {
                    if (findInModules[i].acc_view === 1) {
                        routeToModule = '/apps/' + findInModules[i].display_url;
                        break;
                    }
                }
                if (routeToModule) {
                    this.router.navigate([routeToModule]);
                    return false;
                } else {
                    this.router.navigate(['/apps/main-dashboard']);
                    return false;
                }
            } else {
                return true;
            }
        }
        // not logged in so redirect to home page with the return url
        //this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        else {
           this.router.navigate(['/apps/home']);
            return false;
        }
    }
}