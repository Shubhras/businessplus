import { Component, Input, OnInit } from '@angular/core';
import { GoogleLineChartService } from './../google-line-chart.service';
import { LineChartConfig } from './../LineChartConfig';
declare var google: any;
@Component({
  selector: 'line-chart',
  templateUrl: './linechart.component.html'
})
export class LineChartComponent implements OnInit {
    @Input() data: any[];
    @Input() config: LineChartConfig;
    @Input() elementId: String;
    @Input() elementTrend: String;
    @Input() elementCompare:Number;
    @Input() compareKpiStore:any[];
    constructor(private _lineChartService: GoogleLineChartService) {}
    ngOnInit(): void {
        this._lineChartService.BuildPieChart(this.elementId, this.data, this.config,this.elementTrend,this.elementCompare,this.compareKpiStore);
    }
}