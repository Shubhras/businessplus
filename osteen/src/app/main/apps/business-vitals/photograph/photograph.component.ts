import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { AddPhotographDialog} from 'app/main/apps/business-vitals/photograph/add-photograph.component';
import { EditPhotographDialog} from 'app/main/apps/business-vitals/photograph/edit-photograph.component';
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
    selector     : 'photograph',
    templateUrl  : './photograph.component.html',
    styleUrls    : ['./photograph.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PhotographComponent implements OnInit
{
    currentUser: any;
    PhotographAllData: any;
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
        private _fuseConfigService: FuseConfigService
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
        this.photographGet();
    }
    addPhotographOpen(): void {
        const dialogRef = this.dialog.open(AddPhotographDialog, {
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
            this.photographGet();
          }
        });
    }
    editPhotographOpen(element): void {
      const dialogRef = this.dialog.open(EditPhotographDialog, {
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
          this.photographGet();
        }
      });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
    photographGet() {
      let login_access_token = this.currentUser.login_access_token;
      let company_id = this.currentUser.data.company_id;
      this.userService.getPriorityChange(login_access_token,company_id).pipe(first()).subscribe(
        (data:any) => {
            /* this.PhotographAllData =  data.data;
            this.PhotographAllData.map((CATEGORY: any, index: number) => {
              CATEGORY.sr_no = index + 1;
            });
            const ELEMENT_DATA: PeriodicElement[] = this.PhotographAllData; */
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
    deletePhotograph(id) {
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('priority');
        confirmResult.afterClosed().subscribe((result) => {
          if (result == true) {
          this.userService.deletePriority(login_access_token,id).pipe(first()).subscribe(
            (data:any) => {
                if(data.status_code == 200){
                  this.alertService.success(data.message, true);
                  this.photographGet();
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