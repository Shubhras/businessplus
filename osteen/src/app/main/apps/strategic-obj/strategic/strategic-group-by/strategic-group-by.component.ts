import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA,MatTableDataSource } from '@angular/material';
import { AlertService, UserService } from 'app/main/apps/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-strategic-group-by',
  templateUrl: './strategic-group-by.component.html',
  styleUrls: ['./strategic-group-by.component.scss']
})
export class StrategicGroupByComponent implements OnInit {
  unit_id: any;
  currentUser: any;
  dataSource: any;
  overall_status: any;
  displayedColumns: string[] = ['sr_no', 'description', 'dept_name','status_name'];
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.unit_id = localStorage.getItem('currentUnitId');
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.viewStrategicPerformanceGroupBy(this.data);
  }
  viewStrategicPerformanceGroupBy(element: any) {
    let login_access_token = this.currentUser.login_access_token;
      
    this.userService.StrategicGroupStatusView(login_access_token, element).pipe(first()).subscribe(
      (data: any) => {
       console.log('data', data.data.overall_status);
       this.overall_status =  data.data.overall_status;
       const ELEMENT_DATA: PeriodicElement[] = data.data.strategic_data;
       this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      },
      error => {
        this.alertService.error(error);
      });
  }
}
export interface PeriodicElement {
  sr_no: number;
  description: string;
  dept_name: string;
  status_name: string;
  // overall_status: string;
}
