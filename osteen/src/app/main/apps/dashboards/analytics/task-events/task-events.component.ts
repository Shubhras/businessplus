import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AddTaskEventDialog } from 'app/main/apps/dashboards/analytics/task-events/addtaskevents.component';
import { EditTaskEventDialog } from 'app/main/apps/dashboards/analytics/task-events/edittaskevents.component';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
  selector: 'app-task-events',
  templateUrl: './task-events.component.html',
  styleUrls: ['./task-events.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})

export class TaskEventsComponent implements OnInit {
  currentUser: any;
  company_id: any;
  viewTaskEventsChangeData: any;
  taskChangeAllData: any;
  status_code: any;
  MessageSuccess: any;
  MessageError: any;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['sr_no', 'event_name', 'event_area', 'event_objective', 'action'];
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private _fuseConfigService: FuseConfigService,
  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.company_id = this.currentUser.data.company_id;
    this.TaskeventGet();
  }

  AddTaskPopupOpen(): void {
    const dialogRef = this.dialog.open(AddTaskEventDialog, {
      panelClass: 'addtask-dial'
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        },
        footer:{
          hidden: false
        }
      }
    };
    dialogRef.afterClosed().subscribe(result => {
this._fuseConfigService.config = {
  layout: {
    navbar: {
      hidden: false
    },
    // toolbar: {
    //   hidden: true
    // },
  }
};
      if (result == "YesSubmit") {
        this.TaskeventGet();
      }
    });
  }
  EditTaskPopupOpen(user): void {
    console.log(user);
    const dialogRef = this.dialog.open(EditTaskEventDialog, {
      // width: 'auto',
      panelClass: 'addtask-dial',
      data: user
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        // toolbar: {
        //   hidden: false
        // },
        sidepanel: {
          hidden: true
        }
      }
    };
    dialogRef.afterClosed().subscribe(result => {
      this._fuseConfigService.config = {
        layout: {
          navbar: {
            hidden: false
          },
          // toolbar: {
          //   hidden: true
          // },
        }
      };

      if (result == "YesSubmit") {
        this.TaskeventGet();
      }
    });
  }
  DeleteTaskEvents(id) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    // let user_id = this.currentUser.data.id;

    const confirmResult = this.confirmationDialogService.confirm('Event');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.removeTaskEventChange(login_access_token, id).pipe(first()).subscribe(
          data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.TaskeventGet();
            }
            else {
              this.MessageError = data;
              this.alertService.error(this.MessageError.message, true);
            }
          },
          error => {
            this.alertService.error(error);
          });
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  TaskeventGet() {
    let login_access_token = this.currentUser.login_access_token;

    this.userService.viewTaskEventChange(login_access_token, this.company_id).pipe(first()).subscribe(
      (data: any) => {
        this.viewTaskEventsChangeData = data;
        this.taskChangeAllData = this.viewTaskEventsChangeData.data;
        this.taskChangeAllData.map((UNIT: any, index: number) => {
          UNIT.sr_no = index + 1;
        });
        const ELEMENT_DATA: PeriodicElement[] = this.taskChangeAllData;
        this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      },
      error => {
        this.alertService.error(error);
      });

  }
  // DeleteStrategicData(unit_id) {
  //   this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  //   let login_access_token = this.currentUser.login_access_token;
  //   let user_id = this.currentUser.data.id;
  //   const confirmResult = this.confirmationDialogService.confirm('unit');
  //   confirmResult.afterClosed().subscribe((result) => {
  //     if (result == true) {
  //       this.userService.removeTaskEventChange(login_access_token, unit_id, user_id).pipe(first()).subscribe(
  //         data => {
  //           this.status_code = data;
  //           if (this.status_code.status_code == 200) {
  //             this.MessageSuccess = data;
  //             this.alertService.success(this.MessageSuccess.message, true);
  //             this.TaskeventGet();
  //           }
  //           else {
  //             this.MessageError = data;
  //             this.alertService.error(this.MessageError.message, true);
  //           }
  //         },
  //         error => {
  //           this.alertService.error(error);
  //         });
  //     }
  //   });
  // }


}
export interface PeriodicElement {
  event_name: string;
  sr_no: number;
  // test: string;
  event_area: number;
  event_objective: string;
}
