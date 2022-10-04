import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddCategoryDialog} from 'app/main/apps/module-roles/category-change/addcategory.component';
import { EditCategoryDialog} from 'app/main/apps/module-roles/category-change/editcategory.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
@Component({
    selector     : 'category',
    templateUrl  : './category-change.component.html',
    styleUrls    : ['./category-change.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CategoryChangeComponent implements OnInit
{
    currentUser: any;
    categoryAllData: any;
    displayedColumns: string[] = [ 'sr_no', 'category_name','action'];
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
      this.categoryGet();
    }
    addCategoryOpen(): void {
      const dialogRef = this.dialog.open(AddCategoryDialog);
      dialogRef.afterClosed().subscribe(result => {
        if(result=="YesSubmit"){
          this.categoryGet();
        }
      });
    }
    editCategoryOpen(element): void {
      const dialogRef = this.dialog.open(EditCategoryDialog, {
        width: 'auto',
        data: element
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result=="YesSubmit"){
          this.categoryGet();
        }
      });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   categoryGet() {
      this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      let company_id = this.currentUser.data.company_id;
      this.userService.getCategoryChange(login_access_token,company_id).pipe(first()).subscribe(
          (data:any) => {
              this.categoryAllData = data.data;
              this.categoryAllData.map((CATEGORY: any, index: number) => {
                CATEGORY.sr_no = index + 1;
              });
              const ELEMENT_DATA: PeriodicElement[] = this.categoryAllData;
              this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
              this.dataSource.paginator = this.paginator;
              },
          error => {
              this.alertService.error(error);
          });
    }
    deleteCategory(category_id) {
      this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      const confirmResult = this.confirmationDialogService.confirm('category');
      confirmResult.afterClosed().subscribe((result) => {
        if (result == true) {
        this.userService.deleteCategory(login_access_token,category_id).pipe(first()).subscribe(
          (data:any) => {
              if(data.status_code == 200){
                this.alertService.success(data.message, true);
                this.categoryGet();
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
  category_name: string;
  action: string;
}