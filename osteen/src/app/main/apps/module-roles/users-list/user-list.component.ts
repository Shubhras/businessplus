import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { FuseConfigService } from '@fuse/services/config.service';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import * as _ from 'lodash';
import html2canvas from 'html2canvas';
import readXlsxFile from 'read-excel-file';
import { AddUserDialog } from './add-user.component';
import { EditUserDialog } from './edit-user.component';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UserListComponent implements OnInit {
  currentUser: any;
  userListAllData: any;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  selectedFile: File = null;
  login_access_token:any;
  displayedColumns: string[] = ['sr_no', 'name', 'gender', 'email', 'mobile', 'city', 'address', 'multi_unit_ids', 'role_name', 'multi_dept_ids', 'multi_section_ids', 'action'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('myInput')
  myInputVariable: ElementRef;
  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  fileUploadForm: FormGroup;
  fileInputLabel: string;

  /**
   * Constructor
   *
   * @param {ActionPlanService} _initiativeService
   */
  constructor(
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private loaderService: LoaderService,
    private _fuseConfigService: FuseConfigService,
    private formBuilder: FormBuilder,
  ) {
  }
  /**
  * On init
  */
  ngOnInit(): void {
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.login_access_token = this.currentUser.login_access_token;
            this.fileUploadForm = this.formBuilder.group({
              myfile: ['']
            });
    this.userLisetGet();
  }

  // onFileSelect(event) {
  //   let af = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     console.log("filee", file);

  //     if (!_.includes(af, file.type)) {
  //       alert('Only EXCEL Docs Allowed!');
  //     } else {
  //       this.fileInputLabel = file.name;
  //       console.log("fileInputLabel", this.fileInputLabel);
        
  //       this.fileUploadForm.get('myfile').setValue(file);
  //       console.log("fileInputLabel2", this.fileInputLabel);
        
  //     }
  //   }
  //   this.onFormSubmit();
  // }


  // onFormSubmit() {

  //   if (!this.fileUploadForm.get('myfile').value) {
  //     alert('Please fill valid details!');
  //     return false;
  //   }

  //   const formData = new FormData();
  //   formData.append('myfile', this.fileUploadForm.get('myfile').value);
  //   formData.append('login_access_token', this.currentUser.login_access_token);

  //   console.log('aslkndfkjasnd',formData,typeof(formData));
  //   this.userService.signupByFile(formData).subscribe(data => {
  //       console.log("data4", data);
  //       // console.log('aslkndfkjasnd',data,typeof(data));
  //       this.status_code = data;
  //       if (this.status_code.status_code == 200) {
  //         // Reset the file input
  //         this.MessageSuccess = data;
  //         this.userLisetGet();
  //         this.uploadFileInput.nativeElement.value = "";
  //         this.fileInputLabel = undefined;
          
  //       }
  //       else {
  //         this.MessageError = data;
  //         this.alertService.error(this.MessageError.message, true);
  //       }
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  signupByFile(event) {
    this.selectedFile = <File>event.target.files[0];
    let fileName = this.selectedFile.name;
    let extFile = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (extFile.toLowerCase() == 'csv') {
      let csrf_token;
      let csfr = csrf_token;
      const formData: any = new FormData();
      formData.append("submit", this.selectedFile);
      // formData.append('_token', csfr);
      
      this.userService.signupByFile(formData).pipe(first()).subscribe(
        (data: any) => {
          console.log('user', data);
          this.status_code = data;
          if (this.status_code.status_code == 200) {
            this.MessageSuccess = data;
            this.alertService.success(this.MessageSuccess.message, true);
            this.userLisetGet();
            //Reset file value after submit file
            this.myInputVariable.nativeElement.value = "";
          } else {
            this.MessageError = data;
            this.alertService.error(this.MessageError.message, true);
          }
        },
        error => {
          this.alertService.error(error);
        });
    }
    else {
      let message = "Only support csv file";
      this.alertService.error(message, true);
      this.myInputVariable.nativeElement.value = "";
    }
  }
  AddUserOpen(): void {
    const dialogRef = this.dialog.open(AddUserDialog, {
      panelClass: 'adduser-dial'
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
        this.userLisetGet();
      }
    });
  }
  editUserOpen(element): void {
    const dialogRef = this.dialog.open(EditUserDialog, {
      // width: 'auto',
      panelClass: 'adduser-dial',
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
      if (result == "YesSubmit") {
        this.userLisetGet();
      }
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe((data: any) => {
      this.userListAllData = data.data;
      console.log("test-userdetial", this.userListAllData);

      this.userListAllData.map((User: any, index: number) => {
        User.sr_no = index + 1;
      });
      const ELEMENT_DATA: PeriodicElement[] = this.userListAllData;
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    },
      error => {
        this.alertService.error(error);
      });
  }
  userDelete(user_id) {
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('user');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.deleteSingleUser(login_access_token, user_id).pipe(first()).subscribe(
          (data: any) => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.userLisetGet();
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
  KpiTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'SheetJS.xlsx');
  }
  userListPDF() {
    this.loaderService.show();
    var data = document.getElementById('user-list');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('userlist.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  sr_no: number;
  name: string;
  gender: string;
  email: string;
  mobile: string;
  city: string;
  address: string;
  multi_unit_ids: string;
  //role_name: string;
  multi_dept_ids: string;
  multi_section_ids: string;
  action: string;
}