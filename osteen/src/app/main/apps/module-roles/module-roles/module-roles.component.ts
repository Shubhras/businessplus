import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import {FormBuilder, FormGroup} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
    selector     : 'moduleroles',
    templateUrl  : './module-roles.component.html',
    styleUrls    : ['./module-roles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ModuleAccessRolesComponent implements OnInit
{
    id: number;
    sub: any;
    currentUser: any;
    status_code: any;
    AddRolesForm: FormGroup;
    submitted = false;
    TasksFilesSuccess: any;
    MessageSuccess: any;
    MessageError: any;
    moduleDataRoles:any;
    moduleName:any;
    data: any;
    user_id: number;
   // displayedColumns: string[] = ['tasks_id', 'task_name', 'user_name','updated_at','file_name','action'];
    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    /**
     * Constructor
     *
     *
     */
    constructor(
      private route: ActivatedRoute,
     // private router: RouterModule,
      private router: Router,
      public dialog: MatDialog,
      private _formBuilder: FormBuilder,
      private authenticationService: AuthenticationService,
      private userService: UserService,
      private alertService: AlertService
    )
    {}
    /**
     * On init
     */
    ngOnInit(): void
    {
      this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
      });
       //this.dataSource.paginator = this.paginator;
        //this.dataSource.sort = this.sort;
        this.modulerolesGet();
    }
    roleDataPermissions() {
      let login_access_token = this.currentUser.login_access_token;
      let role_id = this.currentUser.role_id;
      this.userService.permissionsRoleData(this.moduleDataRoles,login_access_token,role_id).pipe(first()).subscribe(
        (data:any) => {
          this.status_code = data;
          if(this.status_code.status_code == 200){
            this.MessageSuccess = data;
            this.modulerolesGet();
            //this.router.navigate(['/apps/modules']);
            this.alertService.success(this.MessageSuccess.message, true);
          }else{
            this.MessageError = data;
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    modulerolesGet() {
      let module_id = this.id;
      this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      this.userService.getModuleroles(login_access_token,module_id).pipe(first()).subscribe(
        (data:any) => {
          this.moduleDataRoles = data.data;
          this.moduleName = this.moduleDataRoles[0].Modules_Name;
            },
        error => {
          this.alertService.error(error);
        });
    }
}
export interface PeriodicElement {
  sr_no: number;
  tasks_id: number;
  task_name: string;
  user_name: string;
  updated_at: string;
  file_name: string;
  action: string;
}
