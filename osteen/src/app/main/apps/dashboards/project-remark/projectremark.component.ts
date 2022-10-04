import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddProjectRemarkDialog } from 'app/main/apps/dashboards/project-remark/addproject-remark.component';
import { EditProjectRemarkDialog } from 'app/main/apps/dashboards/project-remark/editproject-remark.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'projectremark',
  templateUrl: './projectremark.component.html',
  styleUrls: ['./projectremark.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectremarkComponent implements OnInit {
  currentUser: any;
  sub: any;
  status_id: number;
  project_id: number;
  project_name: string;
  user_id: number;
  project_remark_id: number;
  ProRemarkDataStatus: any;
  singleDataPro: any = { data: '' };
  userModulePermission: any;
  proRemarkPermission: any;
  displayedColumnsProject: string[] = ['project_name', 'dept_name', 'category_name', 'start_date', 'end_date', 'business_initiative', 'status_name'];
  dataSourceProject: any;
  displayedColumns: string[] = ['project_id', 'name', 'status_name', 'remark', 'file_name', 'updated_at', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
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
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService,
    private _fuseConfigService: FuseConfigService,
  ) {
  }
  status_nameFilter = new FormControl();
  filteredValues = { project_id: '', name: '', status_name: '', remark: '', file_name: '', updated_at: '', action: '', topFilter: false };
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id']; // (+) converts string 'id' to a number
    });
    //this.dataSource.sort = this.sort;
    this.singleProDetails();
    this.RmarkViewProject();
    this.SelectModuleGet();
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.proRemarkPermission = this.userModulePermission[i];
      }
    }
  }
  applyFilter(filterValue: string) {
    let filter = {
      status_name: filterValue.trim().toLowerCase(),
      remark: filterValue.trim().toLowerCase(),
      name: filterValue.trim().toLowerCase(),
      updated_at: filterValue.trim(),
      //file_name: filterValue.trim(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let statusFound = data.status_name.toString().trim().toLowerCase().indexOf(searchString.status_name.toLowerCase()) !== -1
      let RemarkFound = data.remark.toString().trim().toLowerCase().indexOf(searchString.remark.toLowerCase()) !== -1
      let NameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let UpdateFound = data.updated_at.toString().trim().toLowerCase().indexOf(searchString.updated_at) !== -1
      //let FileFound = data.file_name.toString().trim().toLowerCase().indexOf(searchString.file_name) !== -1
      if (searchString.topFilter) {
        return statusFound || RemarkFound || NameFound || UpdateFound
      } else {
        return statusFound && RemarkFound && NameFound && UpdateFound
      }
    }
    return myFilterPredicate;
  }
  PriorityGetColor(element) {
    switch (element) {
      case 'low':
        return '#6c757d';
      case 'high':
        return '#ef5350';
      case 'medium':
        return '#f1b53d';
    }
  }
  StatusGetColor(element) {
    switch (element) {
      case 'Closed':
        return 'green';
      case 'Open':
        return '#6c757d';
      case 'Delayed':
        return 'red';
      case 'Closed with Delay':
        return 'green';
      case 'On Hold':
        return 'blue';
    }
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.ProRemarkDataStatus = data.data.status;
      },
      error => {
        this.alertService.error(error);
      });
  }
  AddProjectRemarkOpen(project_name): void {
    this.project_name = project_name;
    const dialogRef = this.dialog.open(AddProjectRemarkDialog, {
      width: 'auto',
      data: { project_id: this.project_id, project_name: this.project_name }
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        }
      }
    };
    dialogRef.afterClosed().subscribe(result => {
      this._fuseConfigService.config = {
        layout: {
          navbar: {
            hidden: false
          },
          // toolbar: {
          //   hidden: true
          // },
        }
      };
      if (result == "YesSubmit") {
        this.RmarkViewProject();
        this.singleProDetails();
      }
    });
  }
  EditProjectRemarkOpen(element): void {
    const dialogRef = this.dialog.open(EditProjectRemarkDialog, {
      width: 'auto',
      data: element
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        }
      }
    };
    dialogRef.afterClosed().subscribe(result => {
      this._fuseConfigService.config = {
        layout: {
          navbar: {
            hidden: false
          },
          // toolbar: {
          //   hidden: true
          // },
        }
      };
      if (result == "YesSubmit") {
        this.RmarkViewProject();
        this.singleProDetails();
      }
    });
  }
  singleProDetails() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.proDetailsSingle(login_access_token, this.project_id).pipe(first()).subscribe(
      (data: any) => {
        this.singleDataPro = data.data;
        this.project_name = this.singleDataPro.project_name;
        // this.project_id = this.singleDataPro.project_id;
        const ELEMENT_DATA: PeriodicElementProject[] = [data.data];
        this.dataSourceProject = new MatTableDataSource<PeriodicElementProject>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  /*   changeStatusPro(event) {
      this.status_id = event.target.value;
      let login_access_token = this.currentUser.login_access_token;
      let project_id = this.singleDataPro.project_id;
      let user_id = this.singleDataPro.user_id;
      let statusid = this.status_id;
      this.userService.proStatusSingle(login_access_token, project_id, statusid, user_id).pipe(first()).subscribe(
        (data: any) => {
          this.singleProDetails();
          this.RmarkViewProject();
        },
        error => {
          this.alertService.error(error);
        });
    } */
  RmarkViewProject() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.ViewProjectRmark(login_access_token, this.project_id).pipe(first()).subscribe(
      (data: any) => {
        data.data.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = data.data;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.filterPredicate = this.customFilterPredicate();
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  ProjectRmarkDelete(projectUserId, project_remark_id) {
    let login_access_token = this.currentUser.login_access_token;
    let project_user_id = projectUserId;
    this.project_remark_id = project_remark_id;
    const confirmResult = this.confirmationDialogService.confirm('project remark');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.DeleteProjectRmark(login_access_token, project_remark_id, this.user_id, project_user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.RmarkViewProject();
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
  ProjectRemarkExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  ProjectRemarkPDF() {
    this.loaderService.show();
    var data = document.getElementById('project-remark');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('projectRemark.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }

}
export interface PeriodicElementProject {
  project_name: string;
  dept_name: string;
  category_name: string;
  start_date: string;
  end_date: string;
  business_initiative: string;
  status_name: string;
}
export interface PeriodicElement {
  sr_no: number;
  project_id: number;
  project_name: string;
  name: string;
  status_name: string;
  remark: string;
  updated_at: string;
  action: string;
  //file_name: string;

}
