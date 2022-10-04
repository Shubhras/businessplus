import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { ModulesPermissionService } from 'app/main/apps/modules-permission/modules-permission.service';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
@Component({
    selector     : 'modules',
    templateUrl  : './modules-permission.component.html',
    styleUrls    : ['./modules-permission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModulesPermissionComponent implements OnInit
{
    currentUser: any;
    modulesAllData: any;
    module:any;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    displayedColumns: string[] = [ 'sr_no', 'display_name','action'];
    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('TABLE') table: ElementRef;
    @ViewChild('content') content: ElementRef;
    /**
     * Constructor
     *
     * @param {ActionPlanService} _initiativeService
     */
    constructor(
        private _modulesPermissionService: ModulesPermissionService,
        public dialog: MatDialog,
        private userService: UserService,
        private alertService: AlertService
    )
    {
    }
     /**
     * On init
     */
    ngOnInit(): void
    {
        //this.dataSource.sort = this.sort;
        this.modulesPermissionGet();
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    modulesPermissionGet() {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        this.userService.getModulesPermission(login_access_token,role_id).pipe(first()).subscribe(
            (data:any) => {
                this.modulesAllData = data.data;
                this.modulesAllData.module.map((Modules: any, index: number) => {
                  Modules.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElement[] = this.modulesAllData.module;
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
               this.dataSource.paginator = this.paginator;
                },
            error => {
                this.alertService.error(error);
            });
    }
}
export interface PeriodicElement {
  sr_no: number;
  display_name: string;
  action: string;
}