import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddObjective } from 'app/main/apps/strategic-obj/business-objective/addobjective.component';
import { EditObjective } from 'app/main/apps/strategic-obj/business-objective/editobjective.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
/* import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas'; */
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'objective',
  templateUrl: './objective.component.html',
  styleUrls: ['./objective.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BusinessObjectiveComponent implements OnInit {
  currentUser: any;
  viewObjData: any;
  objAllData: any;
  userModulePermission: any;
  emergingPermission: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  company_id: any;
  buttonDisabled: boolean;
  displayedColumns: string[] = ['sr_no', 'business_objective', 'keywords', 'action'];
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
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Business_objectives") {
        this.emergingPermission = this.userModulePermission[i];
      }
    }

    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.objectiveGet();
      this.disableButton();
    });
  }
  addObjOpen(): void {
    const dialogRef = this.dialog.open(AddObjective);
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
        this.objectiveGet();
      }
    });
  }
  editObjOpen(element): void {
    const dialogRef = this.dialog.open(EditObjective, {
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
        this.objectiveGet();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
  // disableButton() {
  //   let currentDate = new Date();
  //   let getCyear = currentDate.getFullYear();
  //   let tempDate = new Date(getCyear + '/03/31')
  //   if (this.companyFinancialYear == 'april-march') {
  //     if (this.userSelectedYear == currentDate.getFullYear() && currentDate > tempDate) {
  //       this.buttonDisabled = true;
  //     } else {
  //       this.buttonDisabled = false;
  //     }
  //   } else {
  //     if (this.userSelectedYear == currentDate.getFullYear()) {
  //       this.buttonDisabled = true;
  //     } else {
  //       this.buttonDisabled = false;
  //     }
  //   }
  // }
  objectiveGet() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    this.userService.getBusinessObj(login_access_token, selectedYear, financialYear, company_id).pipe(first()).subscribe(
      data => {
        this.viewObjData = data;
        this.objAllData = this.viewObjData.data;
        this.objAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.objAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteObj(objective_id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('business objective');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteBusinessObj(login_access_token, objective_id).pipe(first()).subscribe(
          data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.objectiveGet();
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
}
export interface PeriodicElement {
  sr_no: number;
  business_objective: string;
  keywords: string;
  action: string;
}