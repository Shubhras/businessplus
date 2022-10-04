import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
@Component({
    selector: 'kpi-definition',
    templateUrl: 'kpi-definition.component.html',
  })
  export class KpiDefinition  {
    kpiDef: any;
    constructor(
      public dialogRef: MatDialogRef<KpiDefinition>,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
    }
    ngOnInit(): void {
      this.kpiDef = this.data;
    }
    definitionClose(): void {
      this.dialogRef.close();
    }
  }