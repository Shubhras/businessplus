import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog,MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddUomDialog} from 'app/main/apps/module-roles/uom-change/adduom.component';
import { EditUomDialog} from 'app/main/apps/module-roles/uom-change/edituom.component';
import {FormControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
    selector     : 'uom',
    templateUrl  : './uom-change.component.html',
    styleUrls    : ['./uom-change.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UomChangeComponent implements OnInit
{
    currentUser: any;
    uomAllData: any;
    message:any;
    displayedColumns: string[] = [ 'sr_no', 'uom_name','action'];
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
        this.uomGet();
    }
    addUomOpen(): void {
        const dialogRef = this.dialog.open(AddUomDialog, {
          panelClass: 'adduom-dial'
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
            this.uomGet();
          }
        });
    }
    editUomOpen(element): void {
        const dialogRef = this.dialog.open(EditUomDialog, {
          panelClass: 'adduom-dial',
          // width: 'auto',
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
            this.uomGet();
          }
        });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   uomGet() {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getUnitOfMeasurement(login_access_token,company_id).pipe(first()).subscribe(
            (data:any) => {
                this.uomAllData =  data.data;
                this.uomAllData.map((CATEGORY: any, index: number) => {
                  CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElement[] = this.uomAllData;
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                },
            error => {
                this.alertService.error(error);
            });
    }
    deleteUom(uom_id) {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('uom');
        confirmResult.afterClosed().subscribe((result) => {
          if (result == true) {
          this.userService.deleteUom(login_access_token,uom_id).pipe(first()).subscribe(
            (data:any) => {
                if(data.status_code == 200){
                  this.alertService.success(data.message, true);
                  this.uomGet();
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
  uom_name: string;
  action: string;
}