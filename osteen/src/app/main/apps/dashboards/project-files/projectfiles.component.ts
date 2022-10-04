import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
@Component({
  selector: 'projectfiles',
  templateUrl: './projectfiles.component.html',
  styleUrls: ['./projectfiles.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectfilesComponent implements OnInit {
  currentUser: any;
  sub: any;
  project_id: number;
  project_name: string;
  data: any;
  user_id: number;
  project_files_id: number;
  ViewProjectFilesData: any;
  userModulePermission: any;
  proFilesPermission: any;
  displayedColumns: string[] = ['project_id', 'project_name', 'user_name', 'updated_at', 'file_name', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  login_access_token: any;
  singleDataPro: any;
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
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id']; // (+) converts string 'id' to a number
      // In a real app: dispatch action to load the details here.
    });
    //this.dataSource.sort = this.sort;
    // this.showfilter=false;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.singleProDetails();
    this.FilesViewProject();
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proFilesPermission = this.userModulePermission[i];
      }
    }
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  singleProDetails() {
    this.userService.proDetailsSingle(this.login_access_token, this.project_id).pipe(first()).subscribe(
      (data: any) => {
        this.singleDataPro = data.data;
        this.project_name = this.singleDataPro.project_name;
      },
      error => {
        this.alertService.error(error);
      });
  }
  FilesViewProject() {
    this.userService.ViewProjectFiles(this.login_access_token, this.project_id).pipe(first()).subscribe(
      (data:any) => {
        this.ViewProjectFilesData = data.data;
        this.ViewProjectFilesData.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.ViewProjectFilesData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  ProjectFilesDelete(projectUserId, project_files_id) {
    this.project_files_id = project_files_id;
    const confirmResult = this.confirmationDialogService.confirm('project file');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.DeleteProjectFiles(this.login_access_token, project_files_id, this.user_id, projectUserId).pipe(first()).subscribe(
          (data:any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.FilesViewProject();
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
  project_id: number;
  project_name: string;
  user_name: string;
  updated_at: string;
  file_name: string;
  action: string;
}
