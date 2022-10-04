import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddPriorityDialog } from 'app/main/apps/strategic-obj/business-priority/addpriority.component';
import { EditPriorityDialog } from 'app/main/apps/strategic-obj/business-priority/editpriority.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
/* import { User } from '../../_models';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas'; */
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'priority',
  templateUrl: './priority.component.html',
  styleUrls: ['./priority.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BusinessPriorityComponent implements OnInit {
  currentUser: any;
  priorityAllData: any;
  userModulePermission: any;
  priorityPermission: any;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  company_id: any;
  buttonDisabled: boolean;
  //module:any;
  message: any;
  displayedColumns: string[] = ['sr_no', 'business_priority', 'keywords', 'action'];
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
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Business_priorities") {
        this.priorityPermission = this.userModulePermission[i];
      }
    }
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.priorityGet();
      this.disableButton();
    });
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  disableButton() {
    //let selectedYear = this.userSelectedYear;

    let currentDate = new Date(); //2021, 2, 1
    // console.log(currentDate);

    let getCyear = this.userSelectedYear;


    let fromDate = new Date(getCyear, 3, 1);

    let toDate = new Date(getCyear + 1, 2, 31);



    // let selectYearDate = new Date(selectedYear + '/04/01');

    if (this.companyFinancialYear == 'april-march') {

      if (currentDate.getTime() >= fromDate.getTime() && currentDate.getTime() <= toDate.getTime()) {

        this.buttonDisabled = true;
      } else {

        this.buttonDisabled = false;
      }
    } else {
      if (this.userSelectedYear == currentDate.getFullYear()) {
        this.buttonDisabled = true;
      } else {
        this.buttonDisabled = false;
      }
    }
  }
  addPriorityOpen(): void {
    const dialogRef = this.dialog.open(AddPriorityDialog);
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
        this.priorityGet();
      }
    });
  }
  editPriorityOpen(element): void {
    const dialogRef = this.dialog.open(EditPriorityDialog, {
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
        this.priorityGet();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  priorityGet() {
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    this.userService.getBusinessPriority(login_access_token, selectedYear, financialYear, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.priorityAllData = data.data;
        this.priorityAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.priorityAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deletePriority(priority_id) {
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('priority');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteBusinessPriority(login_access_token, priority_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.priorityGet();
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
export interface PeriodicElement {
  sr_no: number;
  business_priority: string;
  keywords: string;
  action: string;
}