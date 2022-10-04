import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AlertService, UserService } from 'app/main/apps/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-addparticipant',
  templateUrl: './addparticipant.component.html',
  styleUrls: ['./addparticipant.component.scss']
})
export class AddparticipantComponent implements OnInit {
  name = 'Angular';
  dropdownList = [];  
  dropdownSettings = {};

  // toppingList = [];
  selectedItems = [];
  LoginUserDetails: any;
  currentUser: any;
  login_access_token: string;
  AddParticipantForm: FormGroup;
  submitted = false;
  status_code: any;
  message: any;
  MessageSuccess: any;
  MessageError: any;
  group_id: any;
  allDetailsCompany: any;
  company_id: any;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    public dialogRef: MatDialogRef<AddparticipantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    this.login_access_token = this.currentUser.login_access_token;
  }
  AddParticipantPopupClose(): void {
    this.dialogRef.close();
  }
  ngOnInit(): void {
    this.group_id = this.data;
    // Reactive Form
    this.AddParticipantForm = this._formBuilder.group({
      login_access_token: [this.login_access_token, Validators.required],
      admin_id: [this.currentUser.data.id, Validators.required],
      user_id: [this.dropdownList, Validators.required],
      group_id: [this.group_id, Validators.required],
    });
   
   // this.userListByProfileGroupIdGet();
    this.userLisetGet(this.login_access_token, this.currentUser.role_id, this.company_id);
  }

  //create group
  AddParticipantSubmit() {
    this.submitted = true;
    // stop here if AddKpiForm is invalid
    if (this.AddParticipantForm.invalid) {
      return;
    }
    this.userService.ParticipantAddSubmit(this.AddParticipantForm.value).pipe(first()).subscribe(
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
  userLisetGet(login_access_token, role_id, company_id) {
    this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe((data: any) => {
      this.dropdownList = data.data;
      console.log('alluserlist', this.dropdownList);
      // if(this.toppingList.length > 0){
      //   for(let i = 0; i < this.toppingList.length; i++){
      //     this.dropdownList.push({"item_id": this.toppingList[i].user_id, "item_text": this.toppingList[i].name})
      //   }
      this.userListByProfileGroupIdGet();
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'user_id',
          textField: 'name',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
         
          allowSearchFilter: true
        };
     // }
      
    },
      error => {
        this.alertService.error(error);
      });
  }

  onItemSelect(item: any) {
    // console.log(item);
  }
  onSelectAll(items: any) {
    // console.log(items);
  }
  onItemDeSelect(item: any) {
    // console.log(item);
  }
  userListByProfileGroupIdGet() {
    let login_access_token = this.currentUser.login_access_token;
    let role_id = this.currentUser.role_id;
    this.userService.getAllUserByProfileGroupId(login_access_token, role_id, this.group_id).pipe(first()).subscribe((data: any) => {
      this.selectedItems = data.data;
       console.log('selectedItems', this.selectedItems);
       


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
