import { Component, OnInit,Inject } from '@angular/core';
import {MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-kpidetails',
  templateUrl: './kpidetails.component.html',
  styleUrls: ['./kpidetails.component.scss']
})
export class KpidetailsComponent implements OnInit {
  getKpiData: any;
  definition: any;
  description: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit() {
    this.getKpiData = this.data;
    this.definition = this.getKpiData.definition;
    this.description = this.getKpiData.description;
  }

}
