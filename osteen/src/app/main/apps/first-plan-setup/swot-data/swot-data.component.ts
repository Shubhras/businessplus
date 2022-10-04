import { Component,ElementRef, OnInit,Output, EventEmitter,ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { AddStrengths } from 'app/main/apps/strategic-obj/swot-analysis/addstrengths.component';
import { EditStrengths } from 'app/main/apps/strategic-obj/swot-analysis/editstrengths.component';
import { AddWeakness } from 'app/main/apps/strategic-obj/swot-analysis/addweaknesses.component';
import { EditWeakness } from 'app/main/apps/strategic-obj/swot-analysis/editweaknesses.component';
import { AddOpportunities } from 'app/main/apps/strategic-obj/swot-analysis/addopportunities.component';
import { EditOpportunities } from 'app/main/apps/strategic-obj/swot-analysis/editopportunities.component';
import { AddThreats } from 'app/main/apps/strategic-obj/swot-analysis/addthreats.component';
import { EditThreats } from 'app/main/apps/strategic-obj/swot-analysis/editthreats.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
  selector: 'app-swot-data',
  templateUrl: './swot-data.component.html',
  styleUrls: ['./swot-data.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SwotDataComponent implements OnInit {
  data:string = "Message from child to parent";

  @Output() dataEvent = new EventEmitter<any>();
  currentUser: any;
  userModulePermission: any;
  swotPermission: any;
  viewStrengthData: any;
  strengthAllData: any;
  viewWeaknesData: any;
  weaknesAllData: any;
  viewUomData: any;
  uomAllData: any;
  viewThreatData: any;
  threatAllData: any;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  company_id: any;
  buttonDisabled: boolean;
  displayedColumnsStrength: string[] = ['sr_no', 'strength', 'keywords', 'action'];
  dataSourceStrength: any;
  displayedColumns: string[] = ['sr_no', 'weaknesses', 'keywords', 'action'];
  dataSource: any;
  displayedColumnsOpportunity: string[] = ['sr_no', 'opportunities', 'keywords', 'action'];
  dataSourceOpportunity: any;
  displayedColumnsThreats: string[] = ['sr_no', 'threats', 'keywords', 'action'];
  dataSourceThreats: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  unit_id: string;
  constructor(  public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService) { }

  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    this.unit_id = localStorage.getItem('currentUnitId');
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Swot_analyses") {
        this.swotPermission = this.userModulePermission[i];
      }
    }

    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.strengthsGet();
      this.weaknessGet();
      this.opportunityGet();
      this.threatsGet();
      this.disableButton();

    });
  }
  emitData(){
    this.dataEvent.emit(this.data);
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  // disableButton() {
  //   let currentYear = new Date().getFullYear();
  //   let currentMonth = new Date().getMonth() + 1;
  //   let currentDate = new Date().getDate();
  //   if (this.companyFinancialYear == 'april-march') {
  //     let currentFullDate = new Date(this.userSelectedYear, currentMonth, currentDate); //Year, Month, Date
  //     let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
  //     let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
  //     if (currentFullDate >= dateOne && currentFullDate <= dateTwo) {
  //       this.buttonDisabled = false;
  //     } else {
  //       this.buttonDisabled = true;
  //     }
  //   } else {
  //     if (this.userSelectedYear >= currentYear) {
  //       this.buttonDisabled = false;
  //     } else {
  //       this.buttonDisabled = true;
  //     }
  //   }
  // }
  disableButton() {
    let currentYear = this.userSelectedYear;
    if (this.companyFinancialYear == 'april-march') {
      let currentFullDate = new Date(); //Year, Month, Date
      let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
      let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
      if (currentFullDate.getTime() >= dateOne.getTime() && currentFullDate.getTime() <= dateTwo.getTime()) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
    } else {
      if (this.userSelectedYear == currentYear) {
        this.buttonDisabled = false;
      } else {
        this.buttonDisabled = true;
      }
    }
  }
  applyFilterStrength(filterValue: string) {
    this.dataSourceStrength.filter = filterValue.trim().toLowerCase();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilterOpportunity(filterValue: string) {
    this.dataSourceOpportunity.filter = filterValue.trim().toLowerCase();
  }
  applyFilterThreats(filterValue: string) {
    this.dataSourceThreats.filter = filterValue.trim().toLowerCase();
  }
  addStrengthsOpen(): void {
    const dialogRef = this.dialog.open(AddStrengths);
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.strengthsGet();
      }
    });
  }
  editStrengthsOpen(element): void {
    const dialogRef = this.dialog.open(EditStrengths, {
      width: 'auto',
      data: element
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.strengthsGet();
      }
    });
  }
  strengthsGet() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    let unit_id = this.unit_id;
    this.userService.getStrengths(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
      data => {
        this.viewStrengthData = data;
        this.strengthAllData = this.viewStrengthData.data;
        this.strengthAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElementStrength[] = this.strengthAllData;        
        this.dataSourceStrength = new MatTableDataSource<PeriodicElementStrength>(ELEMENT_DATA);
        // console.log(this.dataSourceStrength);
        //this.dataSourceStrength.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteStrengths(strength_id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('strength');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteStrengths(login_access_token, strength_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.strengthsGet();
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
  addWeaknessOpen(): void {
    const dialogRef = this.dialog.open(AddWeakness);
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.weaknessGet();
      }
    });
  }
  editWeaknessOpen(element): void {
    const dialogRef = this.dialog.open(EditWeakness, {
      width: 'auto',
      data: element
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.weaknessGet();
      }
    });
  }
  weaknessGet() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    let unit_id = this.unit_id;
    this.userService.getWeakness(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
      data => {
        this.viewWeaknesData = data;
        this.weaknesAllData = this.viewWeaknesData.data;
        this.weaknesAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.weaknesAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        //this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteWeakness(weaknesses_id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('weaknesses');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteWeakness(login_access_token, weaknesses_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.weaknessGet();
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
  addOpportunity(): void {
    const dialogRef = this.dialog.open(AddOpportunities);
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.opportunityGet();
      }
    });
  }
  editOpportunity(element): void {
    const dialogRef = this.dialog.open(EditOpportunities, {
      width: 'auto',
      data: element
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.opportunityGet();
      }
    });
  }
  opportunityGet() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    let unit_id = this.unit_id;
    this.userService.getOpportunity(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
      data => {
        this.viewUomData = data;
        this.uomAllData = this.viewUomData.data;
        this.uomAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElementOpportunity[] = this.uomAllData;
        this.dataSourceOpportunity = new MatTableDataSource<PeriodicElementOpportunity>(ELEMENT_DATA);
        //this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteOpportunity(opportunities_id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('opportunities');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteOpportunity(login_access_token, opportunities_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.opportunityGet();
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
  addThreatsOpen(): void {
    const dialogRef = this.dialog.open(AddThreats);
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
        this.threatsGet();
      }
    });
  }
  editThreatsOpen(element): void {
    const dialogRef = this.dialog.open(EditThreats, {
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
        this.threatsGet();
      }
    });
  }
  threatsGet() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    let company_id = this.company_id;
    let unit_id = this.unit_id;
    this.userService.getThreats(login_access_token, selectedYear, financialYear, unit_id, company_id).pipe(first()).subscribe(
      data => {
        this.viewThreatData = data;
        this.threatAllData = this.viewThreatData.data;
        this.threatAllData.map((CATEGORY: any, index: number) => {
          CATEGORY.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElementThreats[] = this.threatAllData;
        this.dataSourceThreats = new MatTableDataSource<PeriodicElementThreats>(ELEMENT_DATA);
        //this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });
  }
  deleteThreats(threats_id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('threats');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteThreats(login_access_token, threats_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.threatsGet();
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
export interface PeriodicElementStrength {
  sr_no: number;
  strength: string;
  keywords: string;
  action: string;
}
export interface PeriodicElement {
  sr_no: number;
  weaknesses: string;
  keywords: string;
  action: string;
}
export interface PeriodicElementOpportunity {
  sr_no: number;
  opportunities: string;
  keywords: string;
  action: string;
}
export interface PeriodicElementThreats {
  sr_no: number;
  threats: string;
  keywords: string;
  action: string;
}

