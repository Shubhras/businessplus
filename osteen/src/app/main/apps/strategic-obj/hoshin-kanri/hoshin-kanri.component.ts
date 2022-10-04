import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatBottomSheet, DateAdapter, MAT_DATE_FORMATS} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddHoshin} from 'app/main/apps/strategic-obj/hoshin-kanri/addhoshin.component';
import { EditHoshin} from 'app/main/apps/strategic-obj/hoshin-kanri/edithoshin.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS} from './dateadapter';
import { FuseConfigService } from '@fuse/services/config.service';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
@Component({
    selector     : 'hoshin-kanri',
    templateUrl  : './hoshin-kanri.component.html',
    styleUrls    : ['./hoshin-kanri.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class HoshinKanriComponent implements OnInit
{
    currentUser: any;
    unit_id:any;
    hoshinKanriData:any;
    status_code: any;
    message:any;
    MessageSuccess: any;
    MessageError: any;
    userModulePermission: any;
    hoshinPermission: any;
   displayedColumns: string[] = ['sr_no', 'str_obj_description','initiatives_definition','action_plan_definition','kpi_name','area_manager_value','area_manager_user_name','allocation_matrix'];
   dataSource:any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('TABLE') table: ElementRef;
    @ViewChild('content') content: ElementRef;
    /**
     * Constructor
     *
     *
     */
    constructor(
        public dialog: MatDialog,
        private userService: UserService,
        private alertService: AlertService,
        private confirmationDialogService: ConfirmationDialogService,
        private bottomSheet: MatBottomSheet,
        public datepipe: DatePipe,
        private _fuseConfigService: FuseConfigService
    )
    {
    }
     /**
     * On init
     */
    ngOnInit(): void
    {
      this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      this.unit_id = localStorage.getItem('currentUnitId');
      this.userModulePermission  = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
          if (this.userModulePermission[i].module_name == "Hoshin_kanris") {
              this.hoshinPermission = this.userModulePermission[i];
           }
        }
      this.viewHoshinKanri();
      this._fuseConfigService.config = {
        layout: {
          navbar: {
            hidden: false,
            folded: true
          },
          // toolbar: {
          //   hidden: false
          // },
          sidepanel: {
            hidden: true
          }
        }
      };
    }
    addHoshinOpen(): void {
        const dialogRef = this.dialog.open(AddHoshin,{
          panelClass: 'custom-dial'
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
          if(result=="YesSubmit"){
            this.viewHoshinKanri();
          }
        });
    }
     editHoshinOpen(element): void {
        const dialogRef = this.dialog.open(EditHoshin, {
          width: 'auto',
          data: element
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    viewHoshinKanri() {
      let login_access_token = this.currentUser.login_access_token;
      let unit_id = this.unit_id;
      let role_id = this.currentUser.role_id;
      let dept_id = this.currentUser.dept_id;
      this.userService.hoshinKanriView(login_access_token,unit_id,role_id,dept_id).pipe(first()).subscribe(
          (data:any) => {
              this.hoshinKanriData = data.data;
              /* this.hoshinKanriData.map((task: any, index: number) => {
                task.sr_no = index + 1;
              });
              const ELEMENT_DATA: PeriodicElement[] =  this.hoshinKanriData
              this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
              this.dataSource.paginator = this.paginator; */
              this.processData(this.hoshinKanriData);
              },
          error => {
              this.alertService.error(error);
          });
  }
  processData(hoshinKanri) {
    let HOSHINDATA: PeriodicElement[] = [];
    hoshinKanri.map((Kanri: any,sr_no: any) => {
          const users = [];
          Kanri.hk_dept_heads_user.map((dept) => {
            const temp = {};
            for (const key in dept) {
                temp['dept_' + key] = dept[key];
            }
            users.push(temp);
        });
        Kanri.hk_section_heads_user.map((section, index) => {
            const temp = {};
            for (const key in section) {
                temp['section_' + key] = section[key];
            }
            if(index <= users.length) {
                users[index] = {
                    ...users[index],
                    ...temp
                }
            } else {
                users.push(temp);
            }
        });
        Kanri.hk_supervisor_heads_user.map((supervisor, index) => {
            const temp = {};
            for (const key in supervisor) {
                temp['supervisor_' + key] = supervisor[key];
            }
            if(index <= users.length) {
                users[index] = {
                    ...users[index],
                    ...temp
                }
            } else {
                users.push(temp);
            }
        });
        Kanri['users'] = users;
    // console.log(Kanri['users']);
         /* const allocation_matrix: any = {
          "dept_head_user_name":Kanri.dept_head_user_name,
          "dept_head_value":Kanri.dept_head_value,
          "dept_head_percent":Kanri.dept_head_percent,
          "section_head_user_name":Kanri.section_head_user_name,
          "section_head_value":Kanri.section_head_value,
          "section_head_percent":Kanri.section_head_percent,
          "supervisor_head_user_name":Kanri.supervisor_head_user_name,
          "superv_head_value":Kanri.superv_head_value,
          "superv_head_percent":Kanri.superv_head_percent
        } */
        const  tableData ={
           'sr_no':sr_no + 1,
           'str_obj_description':Kanri.str_obj_description,
           'initiatives_definition':Kanri.initiatives_definition,
           'action_plan_definition':Kanri.action_plan_definition,
           'kpi_name':Kanri.kpi_name,
           'area_manager_value':Kanri.area_manager_value,
           'area_manager_user_name':Kanri.area_manager_user_name,
           'allocation_matrix':Kanri['users']
         }
         //console.log('tableData',tableData);
        HOSHINDATA.push(tableData);
    });
    this.dataSource = new MatTableDataSource<PeriodicElement>(HOSHINDATA);
    this.dataSource.paginator = this.paginator;
  }
}
export interface PeriodicElement {
  sr_no:  string;
  str_obj_description:  string;
  initiatives_definition:  string;
  action_plan_definition:  string;
  kpi_name:string;
  area_manager_value:string;
  area_manager_user_name:string;
  allocation_matrix:any;
}