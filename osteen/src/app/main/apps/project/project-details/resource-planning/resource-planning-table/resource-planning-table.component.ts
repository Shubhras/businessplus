import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
@Component({
  selector: 'resource-planning-table',
  templateUrl: './resource-planning-table.html',
  styleUrls: ['./resource-planning-table.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResourcePlanningComponent implements OnInit {
  resourceForm: FormGroup;
  submitted = false;
  sub: any;
  project_id: any;
  message: any;
  tasks_id: number;
  task_name: string;
  data: any;
  user_id: number;
  ViewTasksData: any;
  currentUser: any;
  completion: any;
  currentUnitId: any;
  unit_id: any;
  /* displayedColumns: string[] = ['sr_no', 'risk_item', 'time_required', 'risk_level', 'responsibility', 'mitigation_plan', 'action'];
  dataSourceCreated: any; */
  @ViewChild(MatPaginator) paginatorCr: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @Output() DashboardResourceClickEvent = new EventEmitter<number>();
  displayedColumns: string[] = [];
  dataSource: any;
  columns: Array<any> = [];
  paginator: any;
  hideVlue: any;
  singleUserName: any;

  /**
  * Constructor
  *
  *
  */
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private _formBuilder: FormBuilder,
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    this.hideVlue = "showTable"
    this.completion = '0000-00-00';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
    });
    this.resourceForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      project_id: [this.project_id],
      unit_id: [this.unit_id, Validators.required],
      projectDetails: ['ResourcePlanning'],
      user_id: ['', Validators.required],
      data_user: this._formBuilder.array([]),
    });
  }
  sendResourceDashboard(userId) {
    this.DashboardResourceClickEvent.emit(userId)
  }
  editResource(userId, showTab) {
    //this.loaderService.show();
    // filter single user data
    const singlseUser = this.ViewTasksData.recourceData.filter((userDta) => {
      if (userId) {
        return userDta.user_id === Number(userId);
      }
      return true;
    });
    this.singleUserName = singlseUser[0].user;
    const userAllWeek = singlseUser[0].totalweeks;
    this.resourceForm.patchValue({ login_access_token: this.currentUser.login_access_token });
    this.resourceForm.patchValue({ project_id: this.project_id });
    this.resourceForm.patchValue({ unit_id: this.unit_id });
    this.resourceForm.patchValue({ projectDetails: 'ResourcePlanning' });
    this.resourceForm.patchValue({ user_id: singlseUser[0].user_id });
    for (let i = 0; i < userAllWeek.length; i++) {
      this.formArrAllocationDept.push(this.initAllocationDept());
      this.formArrAllocationDept.at(i).patchValue({ id: userAllWeek[i].id });
      this.formArrAllocationDept.at(i).patchValue({ target: userAllWeek[i].target });
      this.formArrAllocationDept.at(i).patchValue({ week: userAllWeek[i].week });
      this.formArrAllocationDept.at(i).patchValue({ actual: userAllWeek[i].actual });
    }
    //this.loaderService.hide();
    this.hideVlue = showTab;
  }
  get formArrAllocationDept() {
    return this.resourceForm.get('data_user') as FormArray;
  }
  initAllocationDept() {
    return this._formBuilder.group({
      id: [],
      target: [],
      week: [],
      actual: [],
    });
  }
  updateResource(userId, showTab) {
    this.resourceForm.reset();
    this.resourceForm.value.data_user = null;
    while (this.formArrAllocationDept.length) {
      this.formArrAllocationDept.removeAt(0);
    }
    this.hideVlue = showTab;
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.ViewTasksData = data.data.ResourcePlanning;
        /* const ELEMENT_DATA: PeriodicElement[] = this.ViewTasksData.recourceData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        //this.dataSource.paginator = this.paginator;
        const headers = [...this.ViewTasksData.totalweek];
        headers.push('Action');
        headers.unshift('Sl.No', 'user_name','TA');
        this.displayedColumns = headers; */
        const headers = [...this.ViewTasksData.totalweek];
        headers.push("Total");
        headers.push("Action");
        headers.unshift("Sl.No", "user", "T/A");
        this.displayedColumns = headers;
        let preData = [];
        let targetData = {};
        let actualData = {};
        let percentageData = {};
        let targetDataTotalColumns = {};
        let actualDataTotalColumns = {};
        targetDataTotalColumns = { "Sl.No": "Total", user_id: "", user: "All", "T/A": "Target", setColor: "", Total: "", };
        actualDataTotalColumns = { "Sl.No": "", user_id: "", user: "", "T/A": "Actual", setColor: "", Total: "", };
        let totalColumnsTarget = 0;
        let totalColumnsActual = 0;
        for (let i = 0; i < this.ViewTasksData.recourceData.length; i++) {
          const element = this.ViewTasksData.recourceData[i];
          targetData = { "Sl.No": i + 1, user_id: element.user_id, user: element.user, "T/A": "Target", setColor: "", Total: "", };
          actualData = { "Sl.No": "", user_id: element.user_id, user: "", "T/A": "Actual", setColor: "", Total: "", };
          percentageData = { "Sl.No": "", user_id: element.user_id, user: "", "T/A": "%", setColor: "percentageColor", Total: "", };
          let totalRowTarget = 0;
          let totalRowActual = 0;
          for (let j = 0; j < element.totalweeks.length; j++) {
            targetData[element.totalweeks[j].week] = element.totalweeks[j].target;
            actualData[element.totalweeks[j].week] = element.totalweeks[j].actual;
            // calculate percentage each week in row
            const percenCalculate =
              (element.totalweeks[j].actual / element.totalweeks[j].target) * 100;
            if (percenCalculate) {
              percentageData[element.totalweeks[j].week] = percenCalculate.toFixed(0);
            } else {
              percentageData[element.totalweeks[j].week] = "0";
            }
            // sum target and actual row
            totalRowTarget += element.totalweeks[j].target;
            totalRowActual += element.totalweeks[j].actual;
            targetData["Total"] = totalRowTarget;
            actualData["Total"] = totalRowActual;
            const totalRowpercen = (totalRowActual / totalRowTarget) * 100;
            if (totalRowpercen) {
              percentageData["Total"] = totalRowpercen.toFixed(0);
            } else {
              percentageData["Total"] = "0";
            }
            // sum target and actual column
            if (targetDataTotalColumns.hasOwnProperty(element.totalweeks[j].week)) {
              targetDataTotalColumns[element.totalweeks[j].week] += element.totalweeks[j].target;
            } else {
              targetDataTotalColumns[element.totalweeks[j].week] = element.totalweeks[j].target;
            }
            if (actualDataTotalColumns.hasOwnProperty(element.totalweeks[j].week)) {
              actualDataTotalColumns[element.totalweeks[j].week] += element.totalweeks[j].actual;
            } else {
              actualDataTotalColumns[element.totalweeks[j].week] = element.totalweeks[j].actual;
            }
          }
          totalColumnsTarget += totalRowTarget;
          totalColumnsActual += totalRowActual;
          preData.push(targetData);
          preData.push(actualData);
          preData.push(percentageData);
        }
        targetDataTotalColumns["Total"] = totalColumnsTarget;
        actualDataTotalColumns["Total"] = totalColumnsActual;
        preData.push(targetDataTotalColumns);
        preData.push(actualDataTotalColumns);
        const ELEMENT_DATA: PeriodicElement[] = preData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  resourceSubmit() {
    this.submitted = true;
   // console.log(this.resourceForm.value);
    // stop here if addRiskAccessmentForm is invalid
    if (this.resourceForm.invalid) {
      return;
    }
    this.userService.ProjectAdd(this.resourceForm.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          this.singleViewProjects();
          this.updateResource(1, 'showTable');
        }
        else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

/*   public isColSticky(colName: string) {
    const stickyCols = ['Sl.No', 'user', 'T/A', 'Total'];
    return stickyCols.includes(colName);
  } */
}
export interface PeriodicElement {
}