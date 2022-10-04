import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddDepartmentDialog } from 'app/main/apps/module-roles/department-change/adddepartment.component';
import { EditDepartmentDialog } from 'app/main/apps/module-roles/department-change/editdepartment.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'department',
  templateUrl: './department-change.component.html',
  styleUrls: ['./department-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DepartmentChangeComponent implements OnInit {
  isedit =false;
  currentUser: any;
  unitDeptAllData: any;
  unitsData: Array<any> = [];
  company_id: number;
  login_access_token: string;
  user_id: number;
  displayedColumns: string[] = ['sr_no', 'dept_name', 'unit_name', 'name', 'email', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  unit_id: any;
  unitDeptAllData3: any;
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
    private _fuseConfigService: FuseConfigService,
  ) {
  }
  unit_nameFilter = new FormControl();
  inputSearchFilter = new FormControl();
  filteredValues = { dept_id: '', dept_name: '', unit_name: '', name: '', email: '', action: '', topFilter: false };
  /**
  * On init
  */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    console.log("zxzxzxx", this.unit_id);
    console.log(this.unit_id);
    
    this.user_id = this.currentUser.data.id;
    // this. getall();
    this.departmentChangeGet();
    this.unitsGet();
    this.unit_nameFilter.valueChanges.subscribe((unit_nameFilterValue) => {
      this.filteredValues['unit_name'] = unit_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
  }
  resetOptions() {
    this.unit_nameFilter.reset('');
    this.inputSearchFilter.reset('');
  }
  applyFilter(filterValue: string) {
    let filter = {
      dept_name: filterValue.trim().toLowerCase(),
      unit_name: filterValue.trim().toLowerCase(),
      name: filterValue.trim().toLowerCase(),
      email: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  // getall(){
  //   this.userService.getAllDepartment(this.login_access_token, this.unit_id).pipe(first()).subscribe( (data: any) => {
  //     this.unitDeptAllData3 = data.data;
  //     console.log("ele", this.unitDeptAllData3);
  //     this.unitDeptAllData3.map((Dept: any, index: number) => {
  //       Dept.sr_no = index + 1;
  //     });
  //     const ELEMENT_DATA: PeriodicElement[] = this.unitDeptAllData3;
  //     console.log("ele", ELEMENT_DATA);
      
  //     this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //     console.log("ele", this.dataSource);
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.filterPredicate = this.customFilterPredicate();
  //   },
  //   error => {
  //     this.alertService.error(error);
  //   });
  // }
  departmentChangeGet() {
    this.userService.getDepartmentChange(this.login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.unitDeptAllData = data.data;
        this.unitDeptAllData.map((Dept: any, index: number) => {
          Dept.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.unitDeptAllData;
        console.log("ele", ELEMENT_DATA);
        
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        console.log("ele", this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
      },
      error => {
        this.alertService.error(error);
      });
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let deptNameFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let unitFound = data.unit_name.toString().trim().toLowerCase().indexOf(searchString.unit_name.toLowerCase()) !== -1
      let nameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let emailFound = data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return deptNameFound || unitFound || nameFound || emailFound
      } else {
        return deptNameFound && unitFound && nameFound && emailFound
      }
    }
    return myFilterPredicate;
  }
  departmentDelete(dept_id) {
    const confirmResult = this.confirmationDialogService.confirm('department');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteDepartment(this.login_access_token, dept_id, this.user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.departmentChangeGet();
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
  unitsGet() {
    this.userService.getUnitChange(this.login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.unitsData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  AddDeptOpen(): void {
    const dialogRef = this.dialog.open(AddDepartmentDialog, {
      panelClass: 'department-dial'
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
        this.departmentChangeGet();
      }
    });
  }
  EditDeptOpen(element): void {
    const dialogRef = this.dialog.open(EditDepartmentDialog, {
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
        this.departmentChangeGet();
      }
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  dept_name: string;
  unit_name: string;
  name: string;
  email: string;
  action: string;
}