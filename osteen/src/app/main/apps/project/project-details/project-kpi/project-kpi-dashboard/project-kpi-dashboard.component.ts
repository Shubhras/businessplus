import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
declare let d3pie: any;
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'project-kpi-dashboard',
  templateUrl: './project-kpi-dashboard.html',
  styleUrls: ['./project-kpi-dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ProKpiDashboardComponent implements OnInit {
  project_id: any;
  data: any;
  user_id: number;
  currentUser: any;
  currentUnitId: any;
  unit_id: any;
  @ViewChild('pieChartTASK') pieChartTASK: ElementRef;
  // @ViewChild('chartsTASK') public chartEl: ElementRef;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @Input() sendDataKpiDash: number;
  @Output() arrowclickKpiDashEvent = new EventEmitter<string>();
  project_name: any;
  viewDeliverableData: any;
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
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.project_id = this.sendDataKpiDash;
    this.singleViewProjects();
    this.viewDeliverables();
  }
  arrowclick() {
    this.arrowclickKpiDashEvent.emit();
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
  viewDeliverables() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let company_id = this.currentUser.data.company_id;
    let project_id = this.project_id;
    let user_id = '';
    this.userService.allProDashboardData(company_id, login_access_token, unit_id, project_id, user_id).pipe(first()).subscribe((data: any) => {
      this.viewDeliverableData = data.data.projectDeliverable;
      const KpiTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.total, 0);
      const greenTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Green, 0);
      const redTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Red, 0);
      const yellowTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Yellow, 0);
      this.prepareDataForCharts(KpiTotal, greenTotal, yellowTotal, redTotal);
    },
      error => {
        this.alertService.error(error);
      });
  }
  prepareDataForCharts(KpiTotal, greenTotal, yellowTotal, redTotal) {
    const totalStr = KpiTotal;
    const graphDataStr = [
      {
        "label": (greenTotal * 100 / totalStr).toFixed(1) + '%',
        "value": greenTotal,
        "color": "#4caf50"
      }, {
        "label": (yellowTotal * 100 / totalStr).toFixed(1) + '%',
        "value": yellowTotal,
        "color": "#FFD933"
      }, {
        "label": (redTotal * 100 / totalStr).toFixed(1) + '%',
        "value": redTotal,
        "color": "#f44336"
      }
    ];
    this.fucnPieChart("pieChartTASK", graphDataStr, totalStr);
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
  projectKpiDashboardPDF() {
    this.loaderService.show();
    setTimeout(() => {
      var data = document.getElementById('project-kpi-dashboard');
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
        pdf.save('project-kpi-dashboard.pdf');
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
  { lesent_name: 'Green', lesent_description: 'Activity completed on time' },
  { lesent_name: 'Yellow', lesent_description: 'Some delay / Action plan in place' },
  { lesent_name: 'Red', lesent_description: 'Delayed / No recovery action plan' },
  /* { lesent_name: 'Gray', lesent_description: 'Activity ongoing / On track' }, */
];