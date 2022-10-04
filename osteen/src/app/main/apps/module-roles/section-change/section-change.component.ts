import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddSectionDialog } from 'app/main/apps/module-roles/section-change/addsection.component';
import { EditSectionDialog } from 'app/main/apps/module-roles/section-change/editsection.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FormControl } from '@angular/forms';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'section',
  templateUrl: './section-change.component.html',
  styleUrls: ['./section-change.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SectionChangeComponent implements OnInit {
  currentUser: any;
  company_id: number;
  login_access_token: string;
  user_id: number;
  sectionAllData: any;
  unitsData: Array<any> = [];
  dataDepartment: Array<any> = [];
  displayedColumns: string[] = ['sr_no', 'section_name', 'dept_name', 'unit_name', 'name', 'email', 'action'];
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
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private _fuseConfigService: FuseConfigService,
  ) {
  }
  unit_nameFilter = new FormControl();
  dept_nameFilter = new FormControl();
  inputSearchFilter = new FormControl();
  filteredValues = { section_id: '', section_name: '', dept_name: '', unit_name: '', name: '', email: '', action: '', topFilter: false };
  /**
  * On init
  */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.user_id = this.currentUser.data.id;
    this.sectionChangeGet();
    this.unitsGet();
    this.unit_nameFilter.valueChanges.subscribe((unit_nameFilterValue) => {
      this.filteredValues['unit_name'] = unit_nameFilterValue.unit_name;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
  }
  resetOptions() {
    this.unit_nameFilter.reset('');
    this.dept_nameFilter.reset('');
    this.inputSearchFilter.reset('');
    this.sectionChangeGet();
  }
  applyFilter(filterValue: string) {
    let filter = {
      section_name: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      unit_name: filterValue.trim().toLowerCase(),
      name: filterValue.trim().toLowerCase(),
      email: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
  }
  sectionChangeGet() {
    this.userService.getSectionChange(this.login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.sectionAllData = data.data;
        this.sectionAllData.map((Dept: any, index: number) => {
          Dept.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.sectionAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
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
      let sectionNameFound = data.section_name.toString().trim().toLowerCase().indexOf(searchString.section_name.toLowerCase()) !== -1
      let unitFound;
      if (searchString.unit_name) {
        unitFound = data.unit_name.toString().trim().toLowerCase().indexOf(searchString.unit_name.toLowerCase()) !== -1
      } else {
        unitFound = ""
      }
      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let nameFound = data.name.toString().trim().toLowerCase().indexOf(searchString.name.toLowerCase()) !== -1
      let emailFound = data.email.toString().trim().toLowerCase().indexOf(searchString.email.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return sectionNameFound || unitFound || departmentFound || nameFound || emailFound
      } else {
        return sectionNameFound && unitFound && departmentFound && nameFound && emailFound
      }
    }
    return myFilterPredicate;
  }
  sectionDelete(section_id) {
    const confirmResult = this.confirmationDialogService.confirm('section');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteSection(this.login_access_token, section_id, this.user_id, this.company_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.sectionChangeGet();
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
  departmentGet(event: any) {
    let unit_id = event.id;
    let profile = 'section';
    if (unit_id) {
      this.userService.getDepartmentMultiUnit(unit_id, profile).pipe(first()).subscribe(
        (data: any) => {
          this.dataDepartment = data.data;
        },
        error => {
          this.alertService.error(error);
        });
    }
    else
      this.sectionChangeGet();

  }
  AddSectionOpen(): void {
    const dialogRef = this.dialog.open(AddSectionDialog, {
      panelClass: 'sections-dial'
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
        this.sectionChangeGet();
      }
    });
  }
  EditSectionOpen(element): void {
    const dialogRef = this.dialog.open(EditSectionDialog, {
      panelClass: 'sections-dial',
      // width: 'auto',
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
        this.sectionChangeGet();
      }
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  section_name: string;
  dept_name: string;
  unit_name: string;
  name: string;
  email: string;
  action: string;
}