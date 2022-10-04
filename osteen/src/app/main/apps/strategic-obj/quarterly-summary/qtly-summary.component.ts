import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { AddQtlySummary } from 'app/main/apps/strategic-obj/quarterly-summary/add-qtly-summary.component';
import { EditQtlySummary } from 'app/main/apps/strategic-obj/quarterly-summary/edit-qtly-summary.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { Subscription } from 'rxjs';
//import { DatePipe } from '@angular/common';
//import { AppDateAdapter, APP_DATE_FORMATS} from './dateadapter';
import { User } from '../../_models';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
@Component({
  selector: 'qtly-summary',
  templateUrl: './qtly-summary.component.html',
  styleUrls: ['./qtly-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  /*  providers: [
     {
         provide: DateAdapter, useClass: AppDateAdapter
     },
     {
         provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
     }
   ] */
})
export class QtlySummaryComponent implements OnInit {
  currentUser: any;
  unit_id: any;
  displayedColumns: string[] = ['sr_no', 'year', 'dept_name', 'quarterly', 'remark', 'view', 'action'];
  dataSource: any;
  quartelyviewdata: any;
  userModulePermission: any;
  qtlyReportPermission: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  buttonDisabled: boolean;
  currentYearSubscription: Subscription;
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
    private bottomSheet: MatBottomSheet,
    private loaderService: LoaderService,
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService
    // public datepipe: DatePipe
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    let login_access_token = this.currentUser.login_access_token;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "QuartUpdatManufacturs") {
        this.qtlyReportPermission = this.userModulePermission[i];
      }
    }
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.quarterlyViewSummary();
      this.disableButton();
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: false,
          folded: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        }
      }
    };
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
  addQtlySummary(): void {
    const dialogRef = this.dialog.open(AddQtlySummary, {
      panelClass: 'size-dial'
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
        this.quarterlyViewSummary();
      }
    });
  }
  editQtlySummary(element): void {
    const dialogRef = this.dialog.open(EditQtlySummary, {
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
        this.quarterlyViewSummary();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  quarterlyViewSummary() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    this.userService.viewQuarterlySummary(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.quartelyviewdata = data.data;
        this.quartelyviewdata.map((qtly: any, index: number) => {
          qtly.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.quartelyviewdata;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  qtlySummaryDelete(quartupdatmanufacturs_id) {
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('department');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteQtlySummary(login_access_token, quartupdatmanufacturs_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.quarterlyViewSummary();
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
  qtlySummaryPDF() {
    this.loaderService.show();
    var data = document.getElementById('quarterly-summary');
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
      pdf.save('quarterly-summary.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  /* highlight: string;
  majorgaps: string;
  challenges: string;
  priorities: string; */
  dept_name: string;
  year: string;
  quarterly: string;
  remark: string;
  view: string;
  action: string;
}