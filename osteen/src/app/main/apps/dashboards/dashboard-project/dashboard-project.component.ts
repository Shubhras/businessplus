import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare let d3pie: any;
import * as _ from 'lodash';
import { STATUSES_TASK } from '../../_constants';
@Component({
  selector: 'dashboard-project',
  templateUrl: './dashboard-project.component.html',
  styleUrls: ['./dashboard-project.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DashboardProjectComponent implements OnInit {
  unit_name: any;
  currentUser: any;
  unit_id: any;
  allProDashData: any;
  dataDepartment: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  currentYearSubscription: Subscription;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  displayedColumnsByDept: string[] = ['sr_no', 'dept_name', 'total', 'closed', 'open', 'delayed', 'closedWithDelay', 'onHold'];
  dataSourceByDept: any;
  displayedColumnsStatusTotal: string[] = ['status_name', 'total_status'];
  dataSourceStatusTotal: any;
  displayedColumnsYearWiseDept: string[] = ['sr_no', 'year', 'total', 'closed', 'open', 'delayed', 'closedWithDelay', 'onHold'];
  dataSourceYearWiseDept: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pieChartPROJECT') pieChartPROJECT: ElementRef;
  /**
   * Constructor
   *
   *
   */
  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {

  }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.unit_name = localStorage.getItem('currentUnitName');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.pojectDashboardData();
    });
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  pojectDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let company_id = this.currentUser.data.company_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.pojectDashboardDataGet(login_access_token, unit_id, company_id, selectedYear,financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.allProDashData = data.data;
        const dataByDept = this.allProDashData.project_Dept_Data;
        const dataYearWise = this.allProDashData.project_Dept_Year_Data
        const allStatusTotal = dataByDept.reduce((sum, item) => sum + item.total, 0);
        const closeTotal = dataByDept.reduce((sum, item) => sum + item.closed, 0);
        const openTotal = dataByDept.reduce((sum, item) => sum + item.open, 0);
        const delayedTotal = dataByDept.reduce((sum, item) => sum + item.delayed, 0);
        const closedWithDelayTotal = dataByDept.reduce((sum, item) => sum + item.closedWithDelay, 0);
        const onHoldTotal = dataByDept.reduce((sum, item) => sum + item.onHold, 0);
        this.prepareDataForChart(allStatusTotal, closeTotal, openTotal, delayedTotal, closedWithDelayTotal, onHoldTotal);
        // overall status total table
        const OPEN_TOTAL = { status_name: 'Open', total_status: openTotal };
        const CLOSE_TOTAL = { status_name: 'Closed', total_status: closeTotal };
        const DELAYED_TOTAL = { status_name: 'Delayed', total_status: delayedTotal };
        const CWD_TOTAL = { status_name: 'Closed_With_Delay', total_status: closedWithDelayTotal };
        const ONHOLD_TOTAL = { status_name: 'On_Hold', total_status: onHoldTotal };
        const STATUS_TOTAL = { status_name: 'Total', total_status: allStatusTotal };

        const ELEMENT_DATA_StatusTotal: PeriodicElementStatusTotal[] = [];
        ELEMENT_DATA_StatusTotal.push(CLOSE_TOTAL);
        ELEMENT_DATA_StatusTotal.push(OPEN_TOTAL);
        ELEMENT_DATA_StatusTotal.push(DELAYED_TOTAL);
        ELEMENT_DATA_StatusTotal.push(CWD_TOTAL);
        ELEMENT_DATA_StatusTotal.push(ONHOLD_TOTAL);
        ELEMENT_DATA_StatusTotal.push(STATUS_TOTAL);
        this.dataSourceStatusTotal = new MatTableDataSource<PeriodicElementStatusTotal>(ELEMENT_DATA_StatusTotal);
        // department wise table
        dataByDept.map((dashPro: any, index: number) => {
          dashPro.sr_no = index + 1;
        });
        const DATA_TOTAL = {
          //sr_no: ,
          dept_name: 'Total',
          total: allStatusTotal,
          closed: closeTotal,
          open: openTotal,
          delayed: delayedTotal,
          closedWithDelay: closedWithDelayTotal,
          onHold: onHoldTotal
        };
        const ELEMENT_DATA: PeriodicElementByDept[] = dataByDept;
        ELEMENT_DATA.push(DATA_TOTAL);
        this.dataSourceByDept = new MatTableDataSource<PeriodicElementByDept>(ELEMENT_DATA);
        // year wise tabale data
        dataYearWise.map((dashPro: any, index: number) => {
          dashPro.sr_no = index + 1;
        });
        const ELEMENT_DATA_YearWise: PeriodicElementYearWiseDept[] = dataYearWise;
        this.dataSourceYearWiseDept = new MatTableDataSource<PeriodicElementYearWiseDept>(ELEMENT_DATA_YearWise);
      },
      error => {
        this.alertService.error(error);
      });
  }
  prepareDataForChart(allStatusTotal, closeTotal, openTotal, delayedTotal, closedWithDelayTotal, onHoldTotal) {
    const graphDataTASK = [
      {
        "label": (closeTotal * 100 / allStatusTotal).toFixed(1) + '%',
        "value": closeTotal,
        "color": "#4caf50",
        "lesentName": 'Closed',
      }, {
        "label": (openTotal * 100 / allStatusTotal).toFixed(1) + '%',
        "value": openTotal,
        "color": "#FFD933",
        "lesentName": 'Open',
      }, {
        "label": (delayedTotal * 100 / allStatusTotal).toFixed(1) + '%',
        "value": delayedTotal,
        "color": "#ef5350",
        "lesentName": 'Delayed',
      }, {
        "label": (closedWithDelayTotal * 100 / allStatusTotal).toFixed(1) + '%',
        "value": closedWithDelayTotal,
        "color": "#a9b7b6",
        "lesentName": 'Closed With Delay',
      }, {
        "label": (onHoldTotal * 100 / allStatusTotal).toFixed(1) + '%',
        "value": onHoldTotal,
        "color": "#039cfd",
        "lesentName": 'On Hold',
      }
    ];
    this.fucnPieChart("pieChartPROJECT", graphDataTASK, allStatusTotal);
  }
  fucnPieChart(element: string, data: Array<any>, totalText: any) {
    this[element].nativeElement.innerHTML = '';
    let redirectPage = element;
    let pie = new d3pie(element, {
      "header": {
        "title": {
          "text": totalText,
          "fontSize": 24,
          //"font": "courier",
          "fontWeight": 600,
        },
        "location": "pie-center",
        "titleSubtitlePadding": 10
      },
      "footer": {
        "color": "#999999",
        "fontSize": 10,
        "font": "open sans",
        "location": "bottom-left"
      },
      "size": {
        "canvasHeight": 220,
        "canvasWidth": 265,
        "pieInnerRadius": "50%",
        "pieOuterRadius": "83%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": data
      }, callbacks: {
        onClickSegment: function (e) {
          const lesentName = e.data.lesentName;
          this.clickableForPieChart(redirectPage, lesentName);
        }.bind(this)
      },
      "labels": {
        "outer": {
          "pieDistance": 5
        },
        "inner": {
          "format": "value",
          "hideWhenLessThanPercentage": 2
        },
        "mainLabel": {
          "fontSize": 12
        },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 1
        },
        "value": {
          "color": "#333333",
          "fontSize": 12
        },
        "lines": {
          "enabled": true
        },
        "truncation": {
          "enabled": true
        }
      },
      "tooltips": {
        "enabled": true,
        "type": "placeholder",
        // "string": "{label}: {value},{percentage}%"
        "string": "{percentage}%"
      },
      "effects": {
        "pullOutSegmentOnClick": {
          "effect": "linear",
          "speed": 400,
          "size": 8
        }
      }/*,
        "misc": {
          "gradient": {
            "enabled": true,
            "percentage": 100
          }
        }*/
    });
  }
  clickableForPieChart(redirectPage, lesentName) {
    let statusColorId;
    for (const key of Object.entries(STATUSES_TASK)) {
      if (key[1] == lesentName) {
        statusColorId = key[0];
      }
    }
    if (redirectPage == "pieChartPROJECT") {
      this.router.navigate(['/apps/dashboards/project-status/' + statusColorId]);
    }
    else {
      this.router.navigate(['/apps/dashboards/dashboard-project']);
    }
  }
  mainProDashboardPDF() {
    this.loaderService.show();
    var data = document.getElementById('dashboard-project');
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
      pdf.save('mainProjectDashboard.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElementByDept {
  sr_no?: number;
  dept_name: string;
  total: string;
  open: string;
  delayed: string;
  closed: string;
  closedWithDelay: string;
  onHold: string;
}
export interface PeriodicElementStatusTotal {
  status_name: string;
  total_status: string;
}
export interface PeriodicElementYearWiseDept {
  sr_no?: number;
  year: string; y
  total: string;
  open: string;
  delayed: string;
  closed: string;
  closedWithDelay: string;
  onHold: string;
}
export interface PeriodicElementLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_LESENT: PeriodicElementLesent[] = [
  { lesent_name: 'Green', lesent_description: 'Closed' },
  { lesent_name: 'Yellow', lesent_description: 'Open' },
  { lesent_name: 'Red', lesent_description: 'Delayed' },
  { lesent_name: 'Gray', lesent_description: 'Closed With Delay' },
  { lesent_name: 'Blue', lesent_description: 'On Hold' }
];