import { GoogleChartsBaseService } from './google-charts.base.service';
import { Injectable } from '@angular/core';
import { LineChartConfig } from './LineChartConfig';
declare var google: any;
@Injectable()
export class GoogleLineChartService extends GoogleChartsBaseService {
  constructor() { super(); }
  public BuildPieChart(elementId: String, data: any[], config: LineChartConfig,elementTrend:String,elementCompare:Number,compareKpiStore:any) : void {
    var chartFunc = () => { return new google.visualization.LineChart(document.getElementById(<string>elementId)); };

    var options = {
            title: '',
            titleTextStyle: {
              //color: '#FF0000',
            },
           // title: "config.title",
          // pieHole: config.pieHole,
            pointsVisible: true,
            "legend": { "position": 'top' },
            colors: ['blue', '#4caf50'],
            'chartArea': {'width': '90%'},
            annotations: {1: {style: 'line'},
                          3: {style: 'line'}
                        }
      };
    this.buildChart(data, chartFunc, options,elementTrend,elementCompare,compareKpiStore);
  }
}