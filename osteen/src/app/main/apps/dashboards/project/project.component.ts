import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as moment from 'moment';
import * as _ from 'lodash';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr, 'fr');

import html2canvas from 'html2canvas';
import { ActivatedRoute } from '@angular/router';
import { STATUSES_TASK } from '../../_constants';
@Component({
  selector: 'project-dashboard',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProjectDashboardComponent implements OnInit {
  sub: any;
  statusColorId: any;
  statusId: any;
  deptNameByParams: string;
  currentUser: any;
  name: string;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  selectedProject: any;
  ViewProjectData: any;
  project_id: number;
  project_name: string;
  unit_id: any;
  department_id: number;
  category_id: number;
  start_date: string;
  end_date: any;
  status_id: number;
  business_init_id: number;
  user_id: number;
  data: any;
  dateNow = Date.now();
  dataCategory: any;
  dataStatus: any;
  userModulePermission: any;
  projectPermission: any;
  dataDepartment: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  selectedCurrency: any;
  currentYearSubscription: Subscription;
  displayedColumns: string[] = ['project_id', 'project_name', 'dept_name', 'leader_name', 'start_date', 'end_date', 'project_duration', 'project_cost', 'status_name', 'action'];
  dataSource: any;
  filteredValues = { project_id: '', project_name: '', dept_name: '', leader_name: '', start_date: '', end_date: '', project_duration: '', project_cost: '', status_name: '', pro_details: '', action: '', topFilter: false };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  userListAllData: any;
  selectedSearchUser: any;
  /**
   * Constructor
   *
   * @param {FuseSidebarService} _fuseSidebarService
   *
   */
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private dataYearService: DataYearService
  ) {
  }
  inputSearchFilter = new FormControl();
  dept_nameFilter = new FormControl();
  start_dateFilter = new FormControl();
  end_dateFilter = new FormControl();
  leader_nameFilter = new FormControl();
  status_nameFilter = new FormControl();
  /**
   * On init
   */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.selectedCurrency = 'USD';
    //this.viewProjects();
    this.SelectModuleGet();
    this.getDepartment();
    this.userLisetGet();
    this.sub = this.route.params.subscribe(params => {
      if (params['deptId']) {
        console.log('deptId', params)
      }
      if (params['statusColorId']) {
        this.statusId = params['statusColorId'];
      }
      if (params['deptName']) {
        this.deptNameByParams = params['deptName'];
      }
      this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
        this.userSelectedYear = messageYear;
        this.viewProjects();
      });
    });
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.start_dateFilter.valueChanges.subscribe((start_dateFilterValue) => {
      if (start_dateFilterValue != undefined || start_dateFilterValue == '') {
        const d = start_dateFilterValue ? start_dateFilterValue : '';
        this.filteredValues['start_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.end_dateFilter.valueChanges.subscribe((end_dateFilterValue) => {
      if (end_dateFilterValue != undefined || end_dateFilterValue == '') {
        const d = end_dateFilterValue ? end_dateFilterValue : '';
        this.filteredValues['end_date'] = d;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
    });
    this.leader_nameFilter.valueChanges.subscribe((leader_nameFilterValue) => {
      this.filteredValues['leader_name'] = leader_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.status_nameFilter.valueChanges.subscribe((status_nameFilterValue) => {
      this.filteredValues['status_name'] = status_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Projects") {
        this.projectPermission = this.userModulePermission[i];
      }
    }
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  resetOptions() {
    this.inputSearchFilter.reset('');
    this.dept_nameFilter.reset('');
    this.start_dateFilter.reset('');
    this.end_dateFilter.reset('');
    this.leader_nameFilter.reset('');
    this.status_nameFilter.reset('');
  }
  applyFilter(filterValue: string) {
    let filter = {
      project_name: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      start_date: filterValue.trim().toLowerCase(),
      end_date: filterValue.trim().toLowerCase(),
      leader_name: filterValue.trim().toLowerCase(),
      project_duration: filterValue.trim().toLowerCase(),
      project_cost: filterValue.trim().toLowerCase(),
      status_name: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let project_nameFound = data.project_name.toString().trim().toLowerCase().indexOf(searchString.project_name.toLowerCase()) !== -1

      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let startDateFound = searchString.start_date ? moment(data.start_date).diff(moment(searchString.start_date), 'days') >= 0 : true;
      let endDateFound = searchString.end_date ? moment(data.end_date).diff(moment(searchString.end_date), 'days') <= 0 : true;
      let leaderFound = data.leader_name.toString().trim().toLowerCase().indexOf(searchString.leader_name.toLowerCase()) !== -1
      let project_durationFound = data.project_duration.toString().trim().toLowerCase().indexOf(searchString.project_duration.toLowerCase()) !== -1
      let project_costFound = data.project_cost.toString().trim().toLowerCase().indexOf(searchString.project_cost.toLowerCase()) !== -1
      let statusFound = data.status_name.toString().trim().toLowerCase().indexOf(searchString.status_name.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return project_nameFound || statusFound || departmentFound || startDateFound || endDateFound || leaderFound || project_durationFound || project_costFound
      } else {
        return project_nameFound && statusFound && departmentFound && startDateFound && endDateFound && leaderFound && project_durationFound && project_costFound
      }
    }
    return myFilterPredicate;
  }
  DepartmentGetColor(element) {
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
        return '#4caf50';
      case 'Open':
        return '#FFD933';
      case 'Delayed':
        return '#f44336';
      case 'Closed with Delay':
        return '#a9b7b6';
      case 'On Hold':
        return '#7dabf5';
    }
  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.userListAllData = data.data;
        this.selectedSearchUser = this.userListAllData;
      },
      error => {
        this.alertService.error(error);
      });
  }
  /*   companyUserSearch(value) {
      this.selectedSearchUser = this.searchCompanyUser(value);
    }
    // Filter the user list and send back to populate the selectedSearchUser**
    searchCompanyUser(value: string) {
      let filter = value.toLowerCase();
      return this.userListAllData.filter(option => option.name.toLowerCase().startsWith(filter));
    } */
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.dataStatus = data.data.status;
        this.dataCategory = data.data.categories;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.ProjectsView(login_access_token, unit_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.ViewProjectData = data.data;
        console.log("example", this.ViewProjectData);


        this.ViewProjectData.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.ViewProjectData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
        if (this.statusId) {
          this.status_nameFilter.setValue(STATUSES_TASK[this.statusId]);
        }
        if (this.deptNameByParams) {
          this.dept_nameFilter.setValue(this.deptNameByParams);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteProject(project_id, projectUserId) {
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('project');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.ProjectDelete(login_access_token, project_id, this.user_id, projectUserId).pipe(first()).subscribe(
          (data: any) => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.viewProjects();
            }
            else {
              this.MessageError = data;
              this.alertService.error(this.MessageError.message, true);
            }
          },
          error => {
            this.alertService.error(error);
          });
      }
    });
  }
  ProjectExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  ProjectPDF() {
    this.loaderService.show();
    var data = document.getElementById('project-data');
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
      pdf.save('project.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
  StatusPopupOpen(element): void {
    const dialogRef = this.dialog.open(ChangeStatusDialog, {
      width: 'auto',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewProjects();
      }
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  project_id: number;
  project_name: string;
  dept_name: string;
  leader_name: string;
  project_duration: string;
  start_date: string;
  end_date: string;
  status_name: string;
  project_cost: string;
  action: string;
  comment: string;
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'change_status.component.html',
})
export class ChangeStatusDialog implements OnInit {
  currentUser: any;
  selectedFile: File = null;
  dataStatus: any;
  StatusProjectForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  dataStatusTask: any;
  //fileToUpload: File = null;
  constructor(
    public dialogRef: MatDialogRef<ChangeStatusDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {
  }
  ngOnInit(): void {
    this.dataStatusTask = this.data;

    let project_id = this.dataStatusTask.project_id;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    // Reactive StatusProjectForm
    this.StatusProjectForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      project_id: [project_id, Validators.required],
      status_id: ['', Validators.required],
      remark: [],
    });
    this.SelectModuleGet();
  }
  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
  }
  StatusProjectSumit() {
    this.submitted = true;
    // stop here if StatusProjectForm is invalid
    /* if (this.StatusProjectForm.invalid) {
         return;
     }*/
    const fd = new FormData();
    if (this.selectedFile != undefined) {
      fd.append('upload_id', this.selectedFile, this.selectedFile.name);
    }
    if (this.StatusProjectForm.value.remark != undefined) {
      fd.append('remark', this.StatusProjectForm.value.remark);
    }
    fd.append('login_access_token', this.StatusProjectForm.value.login_access_token);
    fd.append('status_id', this.StatusProjectForm.value.status_id);
    fd.append('project_id', this.StatusProjectForm.value.project_id);
    this.userService.ProjectStatusSumit(fd).pipe(first()).subscribe(
      (data: any) => {
        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.dialogRef.close('YesSubmit');
        } else {
          this.MessageError = data;
          this.alertService.error(this.MessageError.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  StatusPopupClose(): void {
    this.dialogRef.close();
  }
  SelectModuleGet() {
    this.userService.GetSelectModule().pipe(first()).subscribe(
      (data: any) => {
        this.dataStatus = data.data.status;
      },
      error => {
        this.alertService.error(error);
      });
  }
}