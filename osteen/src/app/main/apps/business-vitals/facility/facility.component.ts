import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { AddFacilityDialog} from 'app/main/apps/business-vitals/facility/add-facility.component';
import { EditFacilityDialog} from 'app/main/apps/business-vitals/facility/edit-facility.component';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthenticationService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { User } from '../../_models';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
    selector     : 'facility',
    templateUrl  : './facility.component.html',
    styleUrls    : ['./facility.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FacilityComponent implements OnInit
{
    currentUser: any;
    FacilityAllData: any;
    message:any;
    displayedColumns: string[] = [ 'sr_no', 'name','description','view','action'];
    dataSource: any;
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
        private _fuseConfigService: FuseConfigService,
    )
    {
    }
     /**
     * On init
     */
    ngOnInit(): void
    {
        //this.dataSource.sort = this.sort;
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        this.facilityGet();
    }
    addFacilityOpen(): void {
        const dialogRef = this.dialog.open(AddFacilityDialog, {
          panelClass: 'adding-dial',
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
            this.facilityGet();
          }
        });
    }
    editFacilityOpen(element): void {
      const dialogRef = this.dialog.open(EditFacilityDialog, {
        // width: 'auto',
        panelClass: 'adding-dial',
        data: element
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
          this.facilityGet();
        }
      });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    facilityGet() {
      let login_access_token = this.currentUser.login_access_token;
      let company_id = this.currentUser.data.company_id;
      this.userService.getPriorityChange(login_access_token,company_id).pipe(first()).subscribe(
        (data:any) => {
            /* this.FacilityAllData =  data.data;
            this.FacilityAllData.map((CATEGORY: any, index: number) => {
              CATEGORY.sr_no = index + 1;
            });
            const ELEMENT_DATA: PeriodicElement[] = this.FacilityAllData; */
            const ELEMENT_DATA: PeriodicElement[] = [
              {sr_no: 1, name: 'Test', description: 'Test', view: '',action:''},
              {sr_no: 2, name: 'Test 2', description: 'Test 2', view: '',action:''}
            ];
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            },
        error => {
            this.alertService.error(error);
        });
    }
    deleteFacility(id) {
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('priority');
        confirmResult.afterClosed().subscribe((result) => {
          if (result == true) {
          this.userService.deletePriority(login_access_token,id).pipe(first()).subscribe(
            (data:any) => {
                if(data.status_code == 200){
                  this.alertService.success(data.message, true);
                  this.facilityGet();
               }
               else{
                  this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error);
            });
          }
        });
    }
}
export interface PeriodicElement {
  sr_no: number;
  name: string;
  description: string;
  view:string;
  action: string;
}