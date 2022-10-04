import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource ,MatDialog} from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AddFaqDialog} from 'app/main/apps/module-roles/faq-change/addfaq-change.component';
import { EditFaqDialog} from 'app/main/apps/module-roles/faq-change/editfaq-change.component';
import { first } from 'rxjs/operators';
import { AlertService, UserService} from 'app/main/apps/_services';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
@Component({
    selector     : 'faq-change',
    templateUrl  : './faq-change.component.html',
    styleUrls    : ['./faq-change.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FaqChangeComponent implements OnInit
{
    currentUser: any;
    uomAllData: any;
    displayedColumns: string[] = [ 'sr_no', 'question','answer','action'];
    dataSource: any;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('TABLE') table: ElementRef;
    @ViewChild('content') content: ElementRef;
    /**
     * Constructor
     *
     * @param {UomChangeService} _uomChangeService
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
        this.faqGet();
    }
    addFaqOpen(): void {
        const dialogRef = this.dialog.open(AddFaqDialog, {
          panelClass: 'addfaq-dial',
          // width: '450px'
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
            this.faqGet();
          }
        });
    }
    editFaqOpen(element): void {
        const dialogRef = this.dialog.open(EditFaqDialog, {
          // width: '450px',
          panelClass: 'addfaq-dial',
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
            this.faqGet();
          }
        });
    }
    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
   faqGet() {
        this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.businessFaqGet(login_access_token,company_id).pipe(first()).subscribe(
            (data:any) => {
                this.uomAllData =data.data;
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
    deleteFaq(faq_id) {
      this.currentUser  = JSON.parse(localStorage.getItem('currentUser'));
      let login_access_token = this.currentUser.login_access_token;
      const confirmResult = this.confirmationDialogService.confirm('faq');
      confirmResult.afterClosed().subscribe((result) => {
        if (result == true) {
        this.userService.deleteFaq(login_access_token,faq_id).pipe(first()).subscribe(
          (data:any) => {
              if(data.status_code == 200){
                this.alertService.success(data.message, true);
                this.faqGet();
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
  question: string;
  answer: string;
  action: string;
}