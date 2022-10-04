import { Component, OnDestroy, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { first } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { AlertService, UserService } from 'app/main/apps/_services';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CreategroupComponent implements OnInit {
  // toppings = new FormControl();
  toppingList = [];
  userListAllData: any;
  currentUser: any;
  user_id: any;
  //userAbout: any;
  userPicture: any;
  userDataAbout: any = { data: '' };
  selectedFile: File = null;
  LoginUserDetails: any;
  CreateGroupForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  login_access_token: string;
  allDetailsCompany: any;
  company_id: any;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<CreategroupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) { }

  CreateGropPopupClose(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'))
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    this.login_access_token = this.currentUser.login_access_token;
    // Reactive Form
    this.CreateGroupForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],
      admin_id: [this.currentUser.data.id, Validators.required],
      company_id: [this.company_id, Validators.required],
      group_name: ['', Validators.required],
      group_description: ['', Validators.required],
      user_id: [this.toppingList, Validators.required],
    });
    this.userLisetGet();
  }

  //create group

  CreateGroupSubmit() {
    this.submitted = true;
    // stop here if CreateGroupForm is invalid
    if (this.CreateGroupForm.invalid) {
      return;
    }
    this.userService.GroupCreateSubmit(this.CreateGroupForm.value).pipe(first()).subscribe(
      (data: any) => {

        this.status_code = data;
        if (this.status_code.status_code == 200) {
          this.MessageSuccess = data;
          this.alertService.success(this.MessageSuccess.message, true);
          this.dialogRef.close('YesSubmit');
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
  userLisetGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    let company_id = this.currentUser.data.company_id;
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe((data: any) => {
      this.toppingList = data.data;
      //   this.userListAllData.map((User: any, index: number) => {
      //     User.sr_no = index + 1;
      //   });
      //   const ELEMENT_DATA: PeriodicElement[] = this.userListAllData;
      //   this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
      //   this.dataSource.paginator = this.paginator;
    },
      error => {
        this.alertService.error(error);
      });
  }
}
