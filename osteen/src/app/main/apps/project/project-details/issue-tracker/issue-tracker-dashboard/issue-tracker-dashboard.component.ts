import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
//import { HighchartsService } from 'app/main/apps/_services/highcharts.service';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
declare let d3pie: any;
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'issue-tracker-dashboard',
  templateUrl: './issue-tracker-dashboard.html',
  styleUrls: ['./issue-tracker-dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IssueTrackerDashboardComponent implements OnInit {
  project_id: any;
  data: any;
  user_id: number;
  currentUser: any;
  currentUnitId: any;
  unit_id: any;
  displayedColumns: string[] = ['name_priority', 'total', 'green', 'yellow', 'red', 'gray', 'blue'];
  dataSourcePriority: any;
  @ViewChild('pieChartTASK') pieChartTASK: ElementRef;
  @ViewChild('chartsTASK') public chartEl: ElementRef;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @Input() sendDataTrackerDash: number;
  @Output() arrowclickDashboardEvent = new EventEmitter<string>();
  dataChart: { name: string; marker: { symbol: string; }; data: (number | { marker: { symbol: string; }; })[]; }[];
  project_name: any;
  //dataChart: { name: string; marker: { symbol: string; }; data: (number | { y: number; marker: { symbol: string; }; })[]; }[];
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
    //private highcharts: HighchartsService
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.project_id = this.sendDataTrackerDash;
    this.singleViewProjects();
    this.taskChart();
  }
  arrowclickDashboard() {
    this.arrowclickDashboardEvent.emit();
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.project_name = data.data.projectData[0].project_name;
      },
      error => {
        this.alertService.error(error);
      });
  }
  taskChart() {
    let company_id = this.currentUser.data.company_id;
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    let user_id = '';
    //let project_start_date = proStartDate;
    this.userService.allProDashboardData(company_id, login_access_token, unit_id, project_id, user_id).pipe(first()).subscribe(
      (data: any) => {
        let getAllDataGraph = data.data.issueRemarkGraph;
        this.preparePriorityData(getAllDataGraph);
        this.prepareDataForChart(getAllDataGraph);
        const totalIssue = getAllDataGraph.total_issue;
        totalIssue.push({
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          }
        });
        const Closed = getAllDataGraph.Closed;
        Closed.push({
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
          }
        });
        const Delayed = getAllDataGraph.Delayed;
        Delayed.push({
          marker: {
            symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
          }
        });
        /* const categories = ['W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06', 'W1 2020-05-06'];
        this.dataChart = [{
          name: 'Issue Cumulative',
          marker: {
            symbol: 'square'
          },
          data: [10, 12, 14, 15, 8, 20, 35, 26, 23, 18, {
            marker: {
              symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
            }
          }]
        }, {
          name: 'Closed issues',
          marker: {
            symbol: 'square'
          },
          data: [7, 8, 9, 7, 5, 10, 25, 20, 7, 10,{
            marker: {
              symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
            }
          }]
        }, {
          name: 'Delayed or Open issues',
          marker: {
            symbol: 'diamond'
          },
          data: [3, 4, 5, 8, 3, 10, 10, 6, 8, 8,{
            marker: {
              symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
            }
          }]
        }]; */
        const categories = getAllDataGraph.week;
        this.dataChart = [{
          name: 'Issue Cumulative',
          marker: {
            symbol: 'square'
          },
          data: totalIssue
        }, {
          name: 'Closed issues',
          marker: {
            symbol: 'square'
          },
          data: Closed
        }, {
          name: 'Delayed or Open issues',
          marker: {
            symbol: 'diamond'
          },
          data: Delayed
        }];
        this.prepareDataForBarChart(this.chartEl.nativeElement, this.dataChart, categories);
      },
      error => {
        this.alertService.error(error);
      });
  }
  preparePriorityData(getAllDataGraph) {
    const ELEMENT_DATA: PeriodicElement[] = [];
    const highData = {
      "name_priority": 'High',
      "total": getAllDataGraph.high.phtotal,
      "green": getAllDataGraph.high.phclosed,
      "yellow": getAllDataGraph.high.phopen,
      "red": getAllDataGraph.high.phdelayed,
      "gray": getAllDataGraph.high.phcwd,
      "blue": getAllDataGraph.high.phhold
    }
    const mediumData = {
      "name_priority": 'Medium',
      "total": getAllDataGraph.medium.pmtotal,
      "green": getAllDataGraph.medium.pmclosed,
      "yellow": getAllDataGraph.medium.pmopen,
      "red": getAllDataGraph.medium.pmdelayed,
      "gray": getAllDataGraph.medium.pmcwd,
      "blue": getAllDataGraph.medium.pmhold
    }
    const lowData = {
      "name_priority": 'Low',
      "total": getAllDataGraph.low.pltotal,
      "green": getAllDataGraph.low.plclosed,
      "yellow": getAllDataGraph.low.plopen,
      "red": getAllDataGraph.low.pldelayed,
      "gray": getAllDataGraph.low.plcwd,
      "blue": getAllDataGraph.low.plhold
    }
    ELEMENT_DATA.push(highData);
    ELEMENT_DATA.push(mediumData);
    ELEMENT_DATA.push(lowData);
    this.dataSourcePriority = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  }
  prepareDataForChart(totalTaskData: any) {
    const totalTask = (totalTaskData.total_issue).slice(-1)[0];
    const closedTask = (totalTaskData.Closed).slice(-1)[0];
    const delayedTask = (totalTaskData.Delayed).slice(-1)[0];
    const closedWithDelayTask = (totalTaskData.Closed_With_Delay).slice(-1)[0];
    const onHoldTask = (totalTaskData.On_Hold).slice(-1)[0];
    const openTask = (totalTaskData.Open).slice(-1)[0];
    const graphDataTASK = [
      {
        "label": (closedTask * 100 / totalTask).toFixed(1) + '%',
        "value": closedTask,
        "color": "#4caf50"
      }, {
        "label": (openTask * 100 / totalTask).toFixed(1) + '%',
        "value": openTask,
        "color": "#FFD933"
      }, {
        "label": (delayedTask * 100 / totalTask).toFixed(1) + '%',
        "value": delayedTask,
        "color": "#ef5350"
      }, {
        "label": (closedWithDelayTask * 100 / totalTask).toFixed(1) + '%',
        "value": closedWithDelayTask,
        "color": "#a9b7b6"
      }, {
        "label": (onHoldTask * 100 / totalTask).toFixed(1) + '%',
        "value": onHoldTask,
        "color": "#039cfd"
      }
    ];
    this.fucnPieChart("pieChartTASK", graphDataTASK, totalTask);
  }
  fucnPieChart(element: string, data: Array<any>, totalText: any) {
    this[element].nativeElement.innerHTML = '';
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
  prepareDataForBarChart(el, dataChart, categories) {
    Highcharts.chart(el, {
      chart: {
        type: 'spline'
      },
      title: {
        text: 'Weekly Average'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: categories
      },
      yAxis: {
        title: {
          text: ''
          //text: 'Temperature'
        },
        labels: {
          /* formatter: function () {
            return this.value + '°';
          } */
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          marker: {
            radius: 4,
            lineColor: '#666666',
            lineWidth: 1
          }
        }
      },
      series: dataChart
    })
  }
  issueTrackerDashboardPDF() {
    this.loaderService.show();
    setTimeout(() => {
      var data = document.getElementById('issue-tracker-dashboard');
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
        pdf.save('issue-tracker-dashboard.pdf');
        this.loaderService.hide();
      });
    }, 50);
  }
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

export interface PeriodicElement {
  name_priority: string;
  green: string;
  yellow: string;
  red: string;
  gray: string;
  blue: string;
  total: string;
}
