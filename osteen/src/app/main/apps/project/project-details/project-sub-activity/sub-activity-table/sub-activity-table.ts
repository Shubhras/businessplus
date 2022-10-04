import { Component, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, ElementRef, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { MatDialog, MatTableDataSource, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { SubActivityEdit } from '../../project-sub-activity/sub-activity-edit/sub-activity-edit';
import { SubActivityProjectComponent } from '../sub-activity-popup/sub-activity-popup';
@Component({
    selector: 'sub-activity-table',
    templateUrl: './sub-activity-table.html',
    // encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SubActivityTable implements OnInit {
    direction = 'row';
    sub: any;
    currentUser: any;
    company_id: any;
    unit_id: any;
    project_id: any;
    project_name: any;
    userModulePermission: any;
    proFilesPermission: any;
    minDate = new Date();
    start_date: any;
    end_date: any;
    dummyPicture: any;
    proAllDetails: any = {};
    proCompanyUser: any;
    proExternalUser: any;
    proMilestone: any;
    proKpiData: any;
    proKpiMilestone: any;
    proActivityData: any;
    deleted_at: any;
    // proSubActivityData: any;
    proGoverancesList: any = {};
    proGoverances: any = [];
    proBudget: any;
    dataSourceProActivity: any;
    displayedColumnsSubActivity: string[] = ['sr_no', 'activity_name', 'sub_activity_name', 'sb_actvity_strt_date', 'sb_actvity_end_date', 'action'];
    dataSourceSubActivity: any;
    @ViewChildren(FusePerfectScrollbarDirective)
    fuseScrollbarDirectives: QueryList<FusePerfectScrollbarDirective>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dialog: MatDialog,
        private userService: UserService,
        private alertService: AlertService,
        private _formBuilder: FormBuilder,
        public datepipe: DatePipe,
        private cd: ChangeDetectorRef,
        private loaderService: LoaderService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseConfigService: FuseConfigService,
        private confirmationDialogService: ConfirmationDialogService,
    ) { }

    ngOnInit(): void {
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Projects") {
                this.proFilesPermission = this.userModulePermission[i];
            }
        }
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.sub = this.route.params.subscribe(params => {
            this.project_id = +params['id'] // (+) converts string 'id' to a number
            this.singleViewProjects();
        });
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.unit_id = localStorage.getItem('currentUnitId');
    }

    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;

        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                this.proAllDetails = data.data.projectData[0];
                this.proActivityData = data.data.project_majr_activity_data;
                // sub activity data
                let stoteSubActivity = [];
                for (let i = 0; i < this.proActivityData.length; i++) {
                    const element = this.proActivityData[i].project_sub_activity_data;
                    for (let index = 0; index < this.proActivityData[i].project_sub_activity_data.length; index++) {
                        const element = this.proActivityData[i].project_sub_activity_data[index];
                        stoteSubActivity.push(element);
                    }
                }
                //this.proSubActivityData = data.data.project_sub_activity_data;
                this.dataSourceSubActivity = new MatTableDataSource<PeriodicElementSubActivity>(stoteSubActivity);
            },
            error => {
                this.alertService.error(error);
            });
    }
    openSubDialog() {
        const dialogref = this.dialog.open(SubActivityProjectComponent, {
            width: 'auto',
            data: this.project_id
        });
        dialogref.afterClosed().subscribe(result => {
            if (result == "YesSubmit") {
                this.singleViewProjects();
            }
        });
    }
    editProSingle(data) {
        const dialogref = this.dialog.open(SubActivityEdit, {
            width: 'auto',
            data: data
        });
        dialogref.afterClosed().subscribe(result => {
            if (result == "YesSubmit") {
                this.singleViewProjects();
            }
        });
    }
    deleteMajrActivity(data) {
        let project_sub_actvity_id = data.project_sub_actvity_id;
        if (project_sub_actvity_id) {
            const deleteProData = {
                "login_access_token": this.currentUser.login_access_token,
                "project_id": this.project_id,
                "projectDetails": "projectSubActivity",
                project_sub_actvity_id: project_sub_actvity_id,
                "deleted_at": this.datepipe.transform(new Date(), 'yyyy-MM-dd')
            }
            const confirmResult = this.confirmationDialogService.confirm('activity');
            confirmResult.afterClosed().subscribe((result) => {
                if (result == true) {
                    this.userService.proDeleteSingle(deleteProData).pipe(first()).subscribe(
                        (data: any) => {
                            if (data.status_code == 200) {
                                this.alertService.success(data.message, true);
                                this.singleViewProjects();
                            }
                            else {
                                this.alertService.error(data.message, true);
                            }
                        },
                        error => {
                            this.alertService.error(error);
                        });
                }
            });
        }
    }
}
export interface PeriodicElementSubActivity {
    sr_no: any;
    activity_name: string;
    sub_activity_name: string;
    sb_actvity_strt_date: string;
    sb_actvity_end_date: string;
}