import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject,OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddBusinessDialog} from 'app/main/apps/module-roles/business-change/addbusiness.component';
import { EditBusinessDialog} from 'app/main/apps/module-roles/business-change/editbusiness.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
@Component({
    selector     : 'business',
    templateUrl  : './business-change.component.html',
    styleUrls    : ['./business-change.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class BusinessChangeComponent implements OnInit
{
    currentUser: any;
    businessAllData: any;
    displayedColumns: string[] = [ 'sr_no', 'business_initiative','action'];
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
    )
    {
    }
     /**
     * On init
     */
    ngOnInit(): void
    {
        //this.dataSource.sort = this.sort;
        this.businessGet();
    }
    addBusinessOpen(): void {
        const dialogRef = this.dialog.open(AddBusinessDialog);
        dialogRef.afterClosed().subscribe(result => {
          if(result=="YesSubmit"){
            this.businessGet();
          }
        });
    }
    editBusinessOpen(element): void {
        const dialogRef = this.dialog.open(EditBusinessDialog, {
          width: 'auto',
          data: element
        });
        dialogRef.afterClosed().subscribe(result => {
          if(result=="YesSubmit"){
            this.businessGet();
          }
        });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   businessGet() {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getBusinessChange(login_access_token,company_id).pipe(first()).subscribe(
            (data:any) => {
                this.businessAllData = data.data;
                this.businessAllData.map((CATEGORY: any, index: number) => {
                  CATEGORY.sr_no = index + 1;
                });
                const ELEMENT_DATA: PeriodicElement[] = this.businessAllData;
                this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                },
            error => {
                this.alertService.error(error);
            });
    }
    deleteBusiness(category_id) {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        const confirmResult = this.confirmationDialogService.confirm('business');
        confirmResult.afterClosed().subscribe((result) => {
          if (result == true) {
          this.userService.deleteBusiness(login_access_token,category_id).pipe(first()).subscribe(
            (data:any) => {
                if(data.status_code == 200){
                  this.alertService.success(data.message, true);
                  this.businessGet();
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
  business_initiative: string;
  action: string;
}