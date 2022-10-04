import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddPriorityDialog} from 'app/main/apps/module-roles/priority-change/add-priority.component';
import { EditPriorityDialog} from 'app/main/apps/module-roles/priority-change/edit-priority.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';

@Component({
    selector     : 'priority',
    templateUrl  : './priority.component.html',
    styleUrls    : ['./priority.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class PriorityChangeComponent implements OnInit
{
    currentUser: any;
    PriorityAllData: any;
    displayedColumns: string[] = [ 'sr_no', 'name','action'];
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
        this.PriorityGet();
    }
    addPriorityOpen(): void {
        const dialogRef = this.dialog.open(AddPriorityDialog, {
          panelClass: 'addpriority-dial'
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
            this.PriorityGet();
          }
        });
    }
    editPriorityOpen(element): void {
      const dialogRef = this.dialog.open(EditPriorityDialog, {
        // width: 'auto',
        panelClass: 'addpriority-dial',
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
          this.PriorityGet();
        }
      });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   PriorityGet() {
      let login_access_token = this.currentUser.login_access_token;
      let company_id = this.currentUser.data.company_id;
      this.userService.getPriorityChange(login_access_token,company_id).pipe(first()).subscribe(
        (data:any) => {
            this.PriorityAllData =  data.data;
            this.PriorityAllData.map((CATEGORY: any, index: number) => {
              CATEGORY.sr_no = index + 1;
            });
            const ELEMENT_DATA: PeriodicElement[] = this.PriorityAllData;
            this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
            this.dataSource.paginator = this.paginator;
            },
        error => {
            this.alertService.error(error);
        });
    }
    deletePriority(id) {
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('priority');
        confirmResult.afterClosed().subscribe((result) => {
          if (result == true) {
          this.userService.deletePriority(login_access_token,id).pipe(first()).subscribe(
            (data:any) => {
                if(data.status_code == 200){
                  this.alertService.success(data.message, true);
                  this.PriorityGet();
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
  action: string;
}