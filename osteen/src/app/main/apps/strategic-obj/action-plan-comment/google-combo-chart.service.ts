import { ComboChartConfig } from './ComboChartConfig';
import { GoogleChartsBaseService } from './google-charts.base.service';
import { Injectable } from '@angular/core';
import { LineChartConfig } from './LineChartConfig';
declare var google: any;
@Injectable()
export class GoogleComboChartService extends GoogleChartsBaseService {
  constructor() { super(); }
  public BuildComboChart(elementId: String, data: any[], config: ComboChartConfig,elementTrend:String,elementCompare:Number) : void {
    var chartFunc = () => { return new google.visualization.ComboChart(document.getElementById(<string>elementId)); };
    var options = {
      title : config.title,
      vAxis: {title: config.vAxis},
      hAxis: {title: config.hAxis},
      seriesType: 'bars'
      };
    this.buildChart(data, chartFunc, options,elementTrend,elementCompare);
  }
}