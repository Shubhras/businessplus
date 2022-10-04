import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Input, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService, } from '../../../_services';
import { User } from '../../../_models';
import { Lightbox } from 'ngx-lightbox';
import { Chart } from 'angular-highcharts';
import { HighchartsService } from '../../../_services/highcharts.service'




@Component({
  selector: 'app-root',
  templateUrl: './procedure-hr.component.html',
  styleUrls: ['./procedure-hr.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class ProcedureHrComponent implements OnInit {
  currentUser: any;


  //private _albums: Array<any>;

  /**
   * On init
   */
  @ViewChild("gantt_here") ganttContainer: ElementRef;
  @ViewChild('charts') public chartEl: ElementRef;

  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private _lightbox: Lightbox,
    public dialog: MatDialog,
    private highcharts: HighchartsService
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.highcharts.createChart(this.chartEl.nativeElement, this.myOptions);
  }
  myOptions = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Monthly Average Temperature'
    },
    subtitle: {
      text: 'Source: WorldClimate.com'
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      title: {
        text: 'Temperature'
      },
      labels: {
        formatter: function () {
          return this.value + '°';
        }
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
    series: [{
      name: 'Tokyo',
      marker: {
        symbol: 'square'
      },
      data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, {
        y: 26.5,
        marker: {
          symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
        }
      }, 23.3, 18.3, 13.9, 9.6]

    }, {
      name: 'London',
      marker: {
        symbol: 'diamond'
      },
      data: [{
        y: 3.9,
        marker: {
          symbol: 'url(https://www.highcharts.com/samples/graphics/snow.png)'
        }
      }, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
  };


}


