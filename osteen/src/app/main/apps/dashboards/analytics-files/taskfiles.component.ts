import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
@Component({
    selector: 'taskfiles',
    templateUrl: './taskfiles.component.html',
    styleUrls: ['./taskfiles.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class TaskfilesComponent implements OnInit {
    // id: number;
    sub: any;
    currentUser: any;
    singleDataTask: any = { data: '' };
    tasks_id: number;
    task_name: string;
    data: any;
    user_id: number;
    tasks_files_id: number;
    ViewTasksFilesData: any;
    userModulePermission: any;
    taskFilesPermission: any;
    displayedColumns: string[] = ['tasks_id', 'task_name', 'user_name', 'updated_at', 'file_name', 'action'];
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
        private router: RouterModule,
        public dialog: MatDialog,
        private userService: UserService,
        private alertService: AlertService,
        private confirmationDialogService: ConfirmationDialogService
    ) { }
    /**
     * On init
     */
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.user_id = this.currentUser.data.id;
        this.sub = this.route.params.subscribe(params => {
            this.tasks_id = +params['id']; // (+) converts string 'id' to a number
            // In a real app: dispatch action to load the details here.
        });
        this.singleTasksDetails();
        this.FilesViewTasks();
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Tasks") {
                this.taskFilesPermission = this.userModulePermission[i];
            }
        }
    }
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    singleTasksDetails() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.tasksDetailsSingle(login_access_token, this.tasks_id).pipe(first()).subscribe(
            (data: any) => {
                this.singleDataTask = data.data;
                this.task_name = this.singleDataTask.task_name;
                // this.tasks_id = this.singleDataTask.tasks_id;
            },
            error => {
                this.alertService.error(error);
            });
    }
    FilesViewTasks() {
        let login_access_token = this.currentUser.login_access_token;
        this.userService.ViewTasksFiles(login_access_token, this.tasks_id).pipe(first()).subscribe(
            (data: any) => {
                this.ViewTasksFilesData = data.data;
                this.ViewTasksFilesData.map((task: any, index: number) => {
                    task.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElement[] = this.ViewTasksFilesData;
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
            },
            error => {
                this.alertService.error(error);
            });
    }
    TasksFilesDelete(taskUserId, tasks_files_id) {
        let login_access_token = this.currentUser.login_access_token;
        this.tasks_files_id = tasks_files_id;
        const confirmResult = this.confirmationDialogService.confirm('task file');
        confirmResult.afterClosed().subscribe((result) => {
            if (result == true) {
                this.userService.DeleteTasksFiles(login_access_token, tasks_files_id, taskUserId, this.user_id).pipe(first()).subscribe(
                    (data: any) => {
                        if (data.status_code == 200) {
                            this.alertService.success(data.message, true);
                            this.FilesViewTasks();
                        } else {
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

export interface PeriodicElement {
    sr_no: number;
    tasks_id: number;
    task_name: string;
    user_name: string;
    updated_at: string;
    file_name: string;
    action: string;
}
