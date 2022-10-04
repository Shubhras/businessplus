import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import * as d3v4 from 'd3v4';
declare let d3: any;
declare let d3pie: any;
import { legendColor } from 'd3-svg-legend';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import * as moment from 'moment';
// import { ComboChartConfig } from './ComboChartConfig';
// import { LineChartConfig } from './LineChartConfig';
import { targetActualDialod } from '../../common-dialog/kpi-actual/target-actual.component';
import { KpiDefinition } from '../../common-dialog/kpi-definition/kpi-definition.component';
import { Subscription } from 'rxjs';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'strategic-help',
  templateUrl: './strategic-help.component.html',
  styleUrls: ['./strategic-help.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StrategicHelpComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }
}
  /**
* On init
*/
