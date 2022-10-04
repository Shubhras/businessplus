import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddKpiDialog } from './addkpi.component';
import { EditKpiDialog } from './editkpi.component';
import { AddKpiForNextYearDialog } from './addkpi-for-next-year/addkpi-next-year.component';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { DialogOverviewExampleDialog } from '../dashboard/kpidashboard.component';
@Component({
  selector: 'keyperformance',
  templateUrl: './keyperformance.component.html',
  styleUrls: ['./keyperformance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class KeyperformanceComponent implements OnInit {
  sub: any;
  currentUser: any;
  login_access_token: string;
  unit_id: any;
  deptNameByParams: string;
  ViewKpiAllData: any;
  kpi_owner: string;
  message: any;
  kpi_id: number;
  user_id: number;
  userModulePermission: any;
  deptAccorPermission: any;
  kpiPermission: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  AddbuttonDisabled: any;
  currentYearSubscription: Subscription;
  //compareKpiList:any;
  dataDepartment: any;
  displayedColumns: string[] = ['position', 'kpi_name', 'kpi_definition', 'user_name', 'dept_name', 'lead_kpi', 'kpi_performance', 'ideal_trend', 'u_o_m_name', 'target_range_min', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  currentYearFull: number;
  total_objectives: any;
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
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService
  ) {
  }
  dept_nameFilter = new FormControl();
  lead_kpiFilter = new FormControl();
  filteredValues = { sr_no: '', kpi_name: '', kpi_definition: '', user_name: '', dept_name: '', lead_kpi: '', kpi_performance: '', ideal_trend: '', u_o_m_name: '', target_range_min: '', action: '', topFilter: false };
  /**
  * On init
  */
  ngOnInit(): void {
    // Get the widgets from the service
    // this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearFull = new Date().getFullYear();
    for (let i = 0; i < this.userModulePermission.length; i++) {
      if (this.userModulePermission[i].module_name == "Add_kpis") {
        this.kpiPermission = this.userModulePermission[i];
      }
    }
    this.sub = this.route.params.subscribe(params => {
      if (params['deptName']) {
        this.deptNameByParams = params['deptName'];
      }
      //this.ViewKpiData();
    });
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.ViewKpiData();
      this.selecteYearButton();
    });
    this.getDepartment();
    this.dept_nameFilter.valueChanges.subscribe((dept_nameFilterValue) => {
      this.filteredValues['dept_name'] = dept_nameFilterValue;
      this.dataSource.filter = JSON.stringify(this.filteredValues);
      this.filteredValues['topFilter'] = false;
    });
    this.lead_kpiFilter.valueChanges.subscribe((lead_kpiFilterValue) => {
      if (lead_kpiFilterValue == "lead_kpi") {
        this.filteredValues['lead_kpi'] = '1';
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
      else if (lead_kpiFilterValue == "performance_kpi") {
        this.filteredValues['kpi_performance'] = '1';
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
      else {
        this.filteredValues['lead_kpi'] = '';
        this.filteredValues['kpi_performance'] = '';
        this.dataSource.filter = JSON.stringify(this.filteredValues);
        this.filteredValues['topFilter'] = false;
      }
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
        },
        footer: {
          hidden: false
        }
      }
    };
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    // 112
    // this.currentUser.dept_id
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
  
    // this.userService.strategicDashboardView( this.login_access_token, this.unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
    //   (data: any) => {
    //    this.total_objectives = data.data;
    //    console.log("thisss", this.total_objectives);
    //    if(this.total_objectives.action_plans.total == 0){
    //      this.openWelcomeDialog();
    //     console.log("Action Plans");
        
    //     }
    //   });
  }

      // startpopup
      openWelcomeDialog() {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
          disableClose: true ,
          // width:'400px',
         
          data: {
            animal: 'panda',
          },
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // this.animal = result;
        });
      } 
  
  selecteYearButton() {
    let currentYear = this.userSelectedYear;
    if (this.companyFinancialYear == 'april-march') {
      let currentFullDate = new Date(); //Year, Month, Date
      let dateOne = new Date(currentYear, 3, 1); //Year, Month, Date
      let dateTwo = new Date(currentYear + 1, 2, 31); //Year, Month, Date
      if (currentFullDate.getTime() >= dateOne.getTime() && currentFullDate.getTime() <= dateTwo.getTime()) {
        this.AddbuttonDisabled = false;
      } else {
        this.AddbuttonDisabled = true;
      }
    } else {
      if (this.userSelectedYear == currentYear) {
        this.AddbuttonDisabled = false;
      } else {
        this.AddbuttonDisabled = true;
      }
    }
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.lead_kpiFilter.reset('');
  }
  applyFilter(filterValue: string) {
    let filter = {
      kpi_name: filterValue.trim().toLowerCase(),
      user_name: filterValue.trim().toLowerCase(),
      dept_name: filterValue.trim().toLowerCase(),
      lead_kpi: filterValue.trim().toLowerCase(),
      kpi_performance: filterValue.trim().toLowerCase(),
      u_o_m_name: filterValue.trim().toLowerCase(),
      target_range_min: filterValue.trim().toLowerCase(),
      topFilter: true
    }
    this.dataSource.filter = JSON.stringify(filter);
    //this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  customFilterPredicate() {
    const myFilterPredicate = function (data: PeriodicElement, filter: string): boolean {
      let searchString = JSON.parse(filter);
      let kpi_nameFound = data.kpi_name.toString().trim().toLowerCase().indexOf(searchString.kpi_name.toLowerCase()) !== -1
      let kpi_ownerFound = data.user_name.toString().trim().toLowerCase().indexOf(searchString.user_name.toLowerCase()) !== -1
      let departmentFound = data.dept_name.toString().trim().toLowerCase().indexOf(searchString.dept_name.toLowerCase()) !== -1
      let lead_kpiFound = data.lead_kpi.toString().trim().toLowerCase().indexOf(searchString.lead_kpi.toLowerCase()) !== -1
      // let performance_kpiFound = data.kpi_performance.toString().trim().toLowerCase().indexOf(searchString.kpi_performance.toLowerCase()) !== -1
      let performance_kpiFound = data.kpi_performance.toString().trim().toLowerCase().indexOf(searchString.kpi_performance) !== -1
      let u_o_m_nameFound = data.u_o_m_name.toString().trim().toLowerCase().indexOf(searchString.u_o_m_name.toLowerCase()) !== -1
      let target_range_minFound = data.target_range_min.toString().trim().toLowerCase().indexOf(searchString.target_range_min.toLowerCase()) !== -1
      if (searchString.topFilter) {
        return kpi_nameFound || kpi_ownerFound || departmentFound || lead_kpiFound || performance_kpiFound || u_o_m_nameFound || target_range_minFound
      } else {
        return kpi_nameFound && kpi_ownerFound && departmentFound && lead_kpiFound && performance_kpiFound && u_o_m_nameFound && target_range_minFound
      }
    }
    return myFilterPredicate;
  }
  /* compareKpiFun(event: any){
    if(event.length == 2){
      let id = event[0];
      let kpiid =event[1];
      let comparekpi = 1;
      this.router.navigate(['/apps/kpitrackers/kpigraph/'+id+'/'+kpiid+'/'+comparekpi]);
    }
  } */
  AddKpiPopupOpen(): void {
    const dialogRef = this.dialog.open(AddKpiDialog, {
      panelClass: 'addkpi-dial',
      data: ''
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
        this.ViewKpiData();
      }
    });
  }
  addKpiForNextYearOpen(element): void {
    const dialogRef = this.dialog.open(AddKpiForNextYearDialog, {
      // width: 'auto',
      panelClass: 'addkpi-dial',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.ViewKpiData();
      }
    });
  }
  EditKpiPopupOpen(element): void {
    console.log('open popup data', element);
    
    const dialogRef = this.dialog.open(EditKpiDialog, {
      // width: 'auto',
      panelClass: 'addkpi-dial',
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
        this.ViewKpiData();
      }
    });
  }
  kpiDefinitionOpen(element): void {
    const dialogRef = this.dialog.open(KpiDefinition, {
      panelClass: 'def-dial',
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getDepartment() {
    this.userService.getDepartmentUnit(this.login_access_token, this.unit_id, this.currentUser.role_id, this.currentUser.dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  ViewKpiData() {
    this.userService.KpiDataView(this.login_access_token, this.unit_id, this.currentUser.role_id, this.currentUser.dept_id, this.userSelectedYear, this.companyFinancialYear).pipe(first()).subscribe(
      (data: any) => {
        //this.compareKpiList = data.data;
        this.ViewKpiAllData = data.data;
        this.ViewKpiAllData.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.ViewKpiAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate = this.customFilterPredicate();
        if (this.deptNameByParams) {
          this.dept_nameFilter.setValue(this.deptNameByParams);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  DeleteKpiData(kpi_id, user_id) {
    this.kpi_id = kpi_id;
    this.user_id = user_id;
    const confirmResult = this.confirmationDialogService.confirm('kpi');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.KpiDataDelete(this.login_access_token, kpi_id, user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.ViewKpiData();
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
  KpiTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  KpiDownloadPDF() {
    this.loaderService.show();
    var data = document.getElementById('keyperformance');
    html2canvas(data).then(canvas => {
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4');
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save('keyperformance.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  kpi_name: string;
  position: number;
  //unit_id: number;
  dept_name: string;
  ideal_trend: string;
  u_o_m_name: string;
  target_range_min: string;
  //target_range_max: string;
  kpi_definition: string;
  user_name: string;
  lead_kpi: string;
  kpi_performance: string;
  action: string;
}