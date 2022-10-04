import { Component, Input, OnInit } from '@angular/core';
import { ComboChartConfig } from './../ComboChartConfig';
import { GoogleComboChartService } from './../google-combo-chart.service';
declare var google: any;
@Component({
  selector: 'combo-chart',
  templateUrl: './combochart.component.html'
})
export class ComboChartComponent implements OnInit {
    @Input() data: any[];
    @Input() config: ComboChartConfig;
    @Input() elementId: String;
    @Input() elementTrend: String;
    @Input() elementCompare:Number;
    constructor(private _comboChartService: GoogleComboChartService) {}
    ngOnInit(): void {
        this._comboChartService.BuildComboChart(this.elementId, this.data, this.config,this.elementTrend,this.elementCompare); 
    }
}