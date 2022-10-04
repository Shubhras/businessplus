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
  selector: 'resource-dashboard',
  templateUrl: './resource-dashboard.html',
  styleUrls: ['./resource-dashboard.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ResourceDashboardComponent implements OnInit {
  project_id: any;
  data: any;
  user_id: number;
  currentUser: any;
  currentUnitId: any;
  unit_id: any;
  @ViewChild('chartsTASK') public chartEl: ElementRef;
  @Input() sendDataResourceDash: number;
  @Output() arrowclickResourceDashEvent = new EventEmitter<string>();
  project_name: any;
  viewDeliverableData: any;
  dataChart: { name: string; marker: { symbol: string; }; data: (number | { marker: { symbol: string; }; })[]; }[];
  displayedColumnsTotal: string[] = ['name', 'total'];
  dataSourceTotal: any;
  userListAllData: any;
  sub: any;
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
    //this.user_id = this.currentUser.data.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.singleViewProjects();
      // this.sendDataResourceDash == userSelectId
      this.viewDeliverables(this.sendDataResourceDash);
    });
  }
  arrowclick() {
    this.arrowclickResourceDashEvent.emit();
  }
  userAccorData(event: any) {
    let userSelectId = event;
    this.viewDeliverables(userSelectId)
  }
  singleViewProjects() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let project_id = this.project_id;
    this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.project_name = data.data.projectData[0].project_name;
        this.userListAllData = data.data.project_member_data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewDeliverables(userSelectId) {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let company_id = this.currentUser.data.company_id;
    let project_id = this.project_id;
    // if userSelectId == '' than get all user data otherwise according userSelectId
    let user_id = userSelectId;
    this.userService.allProDashboardData(company_id, login_access_token, unit_id, project_id, user_id).pipe(first()).subscribe((data: any) => {
      this.viewDeliverableData = data.data.ResourceGraphData;
      const totalTarget = this.viewDeliverableData.target;
      const totalActual = this.viewDeliverableData.actual;
      const totalPercent = this.viewDeliverableData.percent;
      // for table data
      let sumTotalTarget = totalTarget.reduce((acc, cur) => acc + Number(cur), 0);
      let sumTotalActual = totalActual.reduce((acc, cur) => acc + Number(cur), 0);
      const sumPercentageActual = (sumTotalActual / sumTotalTarget) * 100;
      const ELEMENT_DATA_Total: PeriodicElementTotal[] = [];
      const targetTotalHours = { name: 'Total Planned Hours', total: sumTotalTarget };
      const actualTotalHours = { name: 'Actual Hours', total: sumTotalActual };
      const percentageTotalHours = { name: '% Complianced', total: sumPercentageActual.toFixed(2) + ' ' + '%' };
      ELEMENT_DATA_Total.push(targetTotalHours);
      ELEMENT_DATA_Total.push(actualTotalHours);
      ELEMENT_DATA_Total.push(percentageTotalHours);
      this.dataSourceTotal = new MatTableDataSource<PeriodicElementTotal>(ELEMENT_DATA_Total);
      // for graph data
      totalTarget.push({
        marker: {
          symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
        }
      });
      totalActual.push({
        marker: {
          symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
        }
      });
      totalPercent.push({
        marker: {
          symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
        }
      });
      const categories = this.viewDeliverableData.week;
      this.dataChart = [{
        name: 'Trget',
        marker: {
          symbol: 'square'
        },
        data: totalTarget
      }, {
        name: 'Actual',
        marker: {
          symbol: 'square'
        },
        data: totalActual
      }, {
        name: '%',
        marker: {
          symbol: 'diamond'
        },
        data: totalPercent
      }];
      this.prepareDataForBarChart(this.chartEl.nativeElement, this.dataChart, categories);
    },
      error => {
        this.alertService.error(error);
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
  projectKpiDashboardPDF() {
    this.loaderService.show();
    setTimeout(() => {
      var data = document.getElementById('resource-dashboard');
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
        pdf.save('resource-dashboard.pdf');
        this.loaderService.hide();
      });
    }, 50);
  }
}
export interface PeriodicElementTotal {
  name: string;
  total: any;
}
/* const ELEMENT_DATA_Total: PeriodicElementTotal[] = [
  { name: 'Total Planned Hours', total: '20' },
  { name: 'Actual Hours', total: '10' },
  { name: '% Complianced', total: '50%' },
]; */