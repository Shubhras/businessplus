import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
declare let d3pie: any;
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import { STATUSES_TASK } from '../../_constants';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'tasktracker-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TasktrackerDashboardComponent implements OnInit {
  unit_name: any;
  currentUser: any;
  unit_id: any;
  totalTasksData: any;
  renderTaskData: Array<any>;
  totalTaskDataDashboard: any;
  depDataBarChart: Array<any>;
  messageError: any;
  dataDepartment: any;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  currentYearSubscription: Subscription;
  displayedColumns: string[] = ['position', 'dept_name', 'total', 'closed', 'open', 'delayed', 'closedWithDelay', 'onHold'];
  dataSource: any;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('pieChartTASK') pieChartTASK: ElementRef;
  /**
   * Constructor
   *
   *
   */
  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
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
    // Get the widgets from the service
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.unit_name = localStorage.getItem('currentUnitName');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.totalTaskDataGet();
    });
    this.getDepartment();
    //this.fucnBarChart();
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id,role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  totalTaskDataGet() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.tasksDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.totalTasksData = data;
        this.processData(this.totalTasksData.data.task_data);
        this.fucnBarChart(this.totalTasksData.data_acording_to_dept);
        this.totalTasksData.data_acording_to_dept.map((task: any, index: number) => {
          task.sr_no = index + 1;
        });
        this.totalTaskDataDashboard = this.totalTasksData;
        let TASKDATA = this.totalTaskDataDashboard.data_acording_to_dept;
        const taskTotal = TASKDATA.reduce((sum, item) => sum + item.total, 0);
        const openTotal = TASKDATA.reduce((sum, item) => sum + item.open, 0);
        const delayedTotal = TASKDATA.reduce((sum, item) => sum + item.delayed, 0);
        const closedTotal = TASKDATA.reduce((sum, item) => sum + item.closed, 0);
        const closedWithDelayTotal = TASKDATA.reduce((sum, item) => sum + item.closedWithDelay, 0);
        const onHoldTotal = TASKDATA.reduce((sum, item) => sum + item.onHold, 0);
        const TASK_DATA_TOTAL = {
          position: 0,
          dept_name: 'Total',
          total: taskTotal,
          open: openTotal,
          delayed: delayedTotal,
          closed: closedTotal,
          closedWithDelay: closedWithDelayTotal,
          onHold: onHoldTotal
        };
        const ELEMENT_DATA: PeriodicElement[] = this.totalTaskDataDashboard.data_acording_to_dept;
        ELEMENT_DATA.push(TASK_DATA_TOTAL);
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
  filterRenderedData(deptId: any) {
    let department;
    if (deptId) {
      department = this.totalTasksData.data_acording_to_dept.filter((department) => {
        return department.dept_id === Number(deptId);
      });
      if (department[0] == null) {
        this.messageError = 'No data for this department';
        this.alertService.error(this.messageError, true);
        return true;
      }
      else {
        this.processData(department[0]);
      }
    }
    else {
      department = [this.totalTasksData.data.task_data];
      this.processData(department[0]);
    }
  }
  processData(taskalldata: any): any {
    this.renderTaskData = taskalldata;
    this.prepareDataForChart(this.renderTaskData);
  }
  prepareDataForChart(totalTaskData: any) {
    const totalTask = totalTaskData.total;
    const closedTask = totalTaskData.closed;
    const delayedTask = totalTaskData.delayed;
    const closedWithDelayTask = totalTaskData.closedWithDelay;
    const onHoldTask = totalTaskData.onHold;
    const openTask = totalTaskData.open;
    const graphDataTASK = [
      {
        "label": (closedTask * 100 / totalTask).toFixed(1) + '%',
        "value": closedTask,
        "color": "#4caf50",
        "lesentName": 'Closed',
      }, {
        "label": (openTask * 100 / totalTask).toFixed(1) + '%',
        "value": openTask,
        "color": "#FFD933",
        "lesentName": 'Open',
      }, {
        "label": (delayedTask * 100 / totalTask).toFixed(1) + '%',
        "value": delayedTask,
        "color": "#ef5350",
        "lesentName": 'Delayed',
      }, {
        "label": (closedWithDelayTask * 100 / totalTask).toFixed(1) + '%',
        "value": closedWithDelayTask,
        "color": "#a9b7b6",
        "lesentName": 'Closed With Delay',
      }, {
        "label": (onHoldTask * 100 / totalTask).toFixed(1) + '%',
        "value": onHoldTask,
        "color": "#039cfd",
        "lesentName": 'On Hold',
      }
    ];
    this.fucnPieChart("pieChartTASK", graphDataTASK, totalTask);
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
      },
      callbacks: {
        onClickSegment: function (e) {
          const lesentName = e.data.lesentName;
          const deptName = '';
          this.clickableForPieAndBarChart(redirectPage, lesentName, deptName);
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
  fucnBarChart(barChartdata: any): any {
    const greenDataTASK = {
      lesentName: 'Closed',
      name: 'Green',
      data: [],
      color: '#4caf50'
    };
    const yellowDataTASK = {
      lesentName: 'Open',
      name: 'Yellow',
      data: [],
      color: '#FFD933'
    };
    const redDataTASK = {
      lesentName: 'Delayed',
      name: 'Red',
      data: [],
      color: '#f44336'
    };
    const grayDataTASK = {
      lesentName: 'Closed With Delay',
      name: 'Gray',
      data: [],
      color: '#a9b7b6'
    };
    const blueDataTASK = {
      lesentName: 'On Hold',
      name: 'blue',
      data: [],
      color: '#7dabf5'
    };
    const depts: Array<string> = [];
    this.depDataBarChart = [...barChartdata];
    this.depDataBarChart.map((data) => {
      depts.push(data.dept_name);
      greenDataTASK.data.push(data.closed);
      yellowDataTASK.data.push(data.open);
      redDataTASK.data.push(data.delayed);
      grayDataTASK.data.push(data.closedWithDelay);
      blueDataTASK.data.push(data.onHold);
    });
    const seriesTASK = [greenDataTASK, yellowDataTASK, grayDataTASK, redDataTASK, blueDataTASK];
    const titleTASK = { text: '' };
    this.prepareDataForBarChart("containerTASK", seriesTASK, depts, titleTASK);
  }
  prepareDataForBarChart(element: string, data: any, categories: any, titleText: any) {
    let redirectPage = element;
    Highcharts.chart(element, {
      chart: {
        type: 'bar',
        // plotBorderWidth: 1,
        style: {
          fontFamily: 'Muli, Helvetica Neue, Arial, sans-serif'
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: '#ffffff',
            style: {
              fontSize: '12px'
            }
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (e) {
                const lesentName = e.point.series.userOptions.lesentName;
                const deptName = e.point.category;
                this.clickableForPieAndBarChart(redirectPage, lesentName, deptName);
              }.bind(this)
            }
          },
          dataLabels: {
            enabled: true,
            inside: true
          },
          showInLegend: false,
          stacking: 'normal'
        }
      },
      title: titleText,
      xAxis: {
        categories: categories,
        labels: {
          //rotation:0,
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        // layout: 'vertical',
        // align: 'right',
        //verticalAlign: 'top',
        // x: 0,
        //y: 5,
        //floating: true,
        // borderWidth: 1,
        //borderRadius: 2,
        // backgroundColor: '#FFFFFF',
        //shadow: true,
        //width:100,
        //itemMarginTop: 5,
        //itemMarginBottom: 5
      },
      series: data
    });
  }

  clickableForPieAndBarChart(redirectPage, lesentName, deptName) {
    let statusId;
    for (const key of Object.entries(STATUSES_TASK)) {
      if (key[1] == lesentName) {
        statusId = key[0];
      }
    }
    if (redirectPage == "pieChartTASK" || redirectPage == "containerTASK") {
      if (deptName) {
        this.router.navigate(['/apps/dashboards/analytics-status-dept/' + statusId + '/' + deptName]);
      } else {
        this.router.navigate(['/apps/dashboards/analytics/' + statusId]);
      }
    }
    else {
      this.router.navigate(['/apps/dashboards/dashboard']);
    }
  }
  taskDashboardPDF() {
    this.loaderService.show();
    var data = document.getElementById('dashboard-analytics');
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
      pdf.save('taskdashboard.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }

}
export interface PeriodicElement {
  sr_no?: number;
  position: number;
  dept_name: string;
  total: string;
  open: number;
  delayed: number;
  closed: number;
  closedWithDelay: number;
  onHold: number;
  /* Closed With Delay: number;*/
}
export interface PeriodicElementLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_LESENT: PeriodicElementLesent[] = [
  { lesent_name: 'Green', lesent_description: 'Completed' },
  { lesent_name: 'Yellow', lesent_description: 'Due date not arrived' },
  { lesent_name: 'Red', lesent_description: 'Delayed' },
  { lesent_name: 'Green', lesent_description: 'Completed but delayed' },
  { lesent_name: 'Gray', lesent_description: 'On Hold' }
];
