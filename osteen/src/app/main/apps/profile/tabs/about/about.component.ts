import { Component, ElementRef, OnDestroy, OnInit, ViewChild, Inject, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { first } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from '../../profile.service';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { AddparticipantComponent } from './addparticipant/addparticipant.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { CreategroupComponent } from './creategroup/creategroup.component';
import { EditgroupComponent } from './editgroup/editgroup.component';

@Component({
  selector: 'profile-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ProfileAboutComponent implements OnInit, OnDestroy {
  about: any;
  currentUser: any;
  profileForm: FormGroup;
  submitted = false;
  userDataAbout: any = { data: '' };
  hideEditButton: any = true;
  unitsData: any;
  date_birth: any;
  dataDepartment: any;
  dataSections: any;
  userData: any = { data: '' };
  userUnitData: any;
  userSectionsData: any;
  userDepartmentData: any;
  profile: any;
  group_id: number;
  allDetailsCompany: any;
  company_id: any;
  //LoginUserDetails: any;
  // Private
  private _unsubscribeAll: Subject<any>;
  user_id: any;
  profile_groups: any;
  login_access_token: any;
  selectedGroupDetails: any;

  /**
   * Constructor
   *
   * @param {ProfileService} _profileService
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _profileService: ProfileService,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    private _fuseConfigService: FuseConfigService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  /**
   * On init
   */
  ngOnInit(): void {
    //this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.company_id = this.allDetailsCompany.general_data[0].company_id;
    this.login_access_token = this.currentUser.login_access_token;
    let login_access_token = this.login_access_token
    this.user_id = this.currentUser.data.id;
    this.profileForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      user_id: [this.user_id, Validators.required],
      role_id: [this.currentUser.role_id, Validators.required],
      email: ['', Validators.required],
      emp_id: ['', Validators.required],
      date_hire: [''],
      name: ['', Validators.required],
      gender: ['', Validators.required],
      date_birth: [''],
      pan_card_no: [''],
      multi_unit_id: [''],
      multi_dept_id: [''],
      designation: ['', Validators.required],
      multi_section_id: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('[0-9]\\d{9}')]],
      mobile2: ['']
    });
    this._profileService.aboutOnChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(about => {
        this.about = about;
      });
    this.UserProfileGet();
    this.ShowJoinedGroups();
    //this.SelectModuleGet();
  }
  mobileValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }


  editProfile() {
    this.submitted = true;
    if (this.profileForm.invalid) {
      return;
    }
    let latest_date_birth = this.datepipe.transform(this.date_birth, 'yyyy/MM/dd');
    this.profileForm.value.date_birth = latest_date_birth;
    if (this.profileForm.value.multi_unit_id.length != 0
      && typeof this.profileForm.value.multi_unit_id[0] != 'number') {
      let multiUnitId = [];
      this.profileForm.value.multi_unit_id.forEach(function (value) {
        multiUnitId.push(value.id);
      });
      this.profileForm.value.multi_unit_id = multiUnitId;
    }
    if (this.profileForm.value.multi_dept_id.length != 0
      && typeof this.profileForm.value.multi_dept_id[0] != 'number') {
      let multiDeptId = [];
      this.profileForm.value.multi_dept_id.forEach(function (value) {
        multiDeptId.push(value.multi_dept_id);
      });
      this.profileForm.value.multi_dept_id = multiDeptId;
    }
    if (this.profileForm.value.multi_section_id.length != 0
      && typeof this.profileForm.value.multi_section_id[0] != 'number') {
      let multiSectionId = [];
      this.profileForm.value.multi_section_id.forEach(function (value) {
        multiSectionId.push(value.multi_section_id);
      });
      this.profileForm.value.multi_section_id = multiSectionId;
    }
    this.userService.profileEdit(this.profileForm.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.showProfile();
          this.alertService.success(data.message, true);
          this.UserProfileGet();
        }
        else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }
  UserProfileGet() {
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.login_access_token;
    let role_id = this.currentUser.role_id;
    this.userService.GetUserProfile(login_access_token, role_id, this.user_id).pipe(first()).subscribe(
      (data: any) => {
        this.userDataAbout = data.data;
        this.userData = data.data.user_data;
        this.userUnitData = data.data.unit_data;
        this.userSectionsData = data.data.sections;
        this.userDepartmentData = data.data.department_masters;
        this.date_birth = this.userData.date_birth;
        let deptSelect = 'D1';
        let sectionSelect = 'S1';
        //this.SelectModuleGet();
        this.unitsGet();
        let unitData = (this.userData.multi_unit_id).split(',').map(n => parseInt(n));
        this.departmentGet(unitData, deptSelect);
        let deptData = (this.userData.multi_dept_id).split(',').map(n => parseInt(n));
        this.sectionGet(deptData, sectionSelect);
        this.updateLoclStoData();
      },
      error => {
        this.alertService.error(error);
      });
  }
  ShowJoinedGroups() {
    let login_access_token = this.login_access_token;
    let company_id = this.company_id;
    this.userService.ShowJoinedGroups(login_access_token, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.profile_groups = data.data;


      },
      error => {
        this.alertService.error(error);
      });
  }

  AddParticipantWithGroup() {

  }
  // upadte deparment and unit in localStorage
  updateLoclStoData() {
    /* let storeUnitId = [];
    this.userUnitData.forEach(function (value) {
        storeUnitId.push(value.unit_id);
    });
    this.currentUser.unit_id = JSON.stringify(storeUnitId);
    let storeDeptId = [];
    this.userDepartmentData.forEach(function (value) {
        storeDeptId.push(value.dept_id);
    });
    this.currentUser.dept_id = JSON.stringify(storeDeptId); */
    this.currentUser.data.name = this.userData.name;
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }
  unitsGet() {
    let login_access_token = this.login_access_token;
    let company_id = this.currentUser.data.company_id;
    this.userService.getUnitChange(login_access_token, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.unitsData = data.data;
        this.userUnitData.unit_id = this.userUnitData.map((unitIdTo: any) => {
          return unitIdTo.unit_id;
        });
        let multi_unit_id = this.unitsData.filter(Unit => {
          return this.userUnitData.unit_id.indexOf(Unit.id) !== -1;
        });
        this.profileForm.get('multi_unit_id').setValue(multi_unit_id);
      },
      error => {
        this.alertService.error(error);
      });
  }
  compareFn(v1: any, v2: any): boolean {
    return v1 === v2.id;
  }
  departmentGet(event: any, deptSelect: any) {
    let unit_id = event;
    if (deptSelect == 'D1') {
      this.profile = 'profile';
    }
    else {
      this.profile = '';
    }
    this.userService.getDepartmentMultiUnit(unit_id, this.profile).pipe(first()).subscribe(
      (data: any) => {
        //this.userDepartment = data;
        this.dataDepartment = data.data;
        this.userDepartmentData.dept_id = this.userDepartmentData.map((DeptIdTo: any) => {
          return DeptIdTo.dept_id;
        });
        let multi_dept_id = this.dataDepartment.filter(Dept => {
          return this.userDepartmentData.dept_id.indexOf(Dept.multi_dept_id) !== -1;
        });
        this.profileForm.get('multi_dept_id').setValue(multi_dept_id);
      },
      error => {
        this.alertService.error(error);
      });
  }
  compareDept(v1: any, v2: any): boolean {
    return v1 === v2.multi_dept_id;
  }
  sectionGet(event: any, sectionSelect: any) {
    let dept_id = event;
    if (sectionSelect == 'S1') {
      this.profile = 'profile';
    }
    else {
      this.profile = '';
    }
    this.userService.getSectionMultiDept(dept_id, this.profile).pipe(first()).subscribe(
      (data: any) => {
        this.dataSections = data.data;
        this.userSectionsData.section_id = this.userSectionsData.map((SectionIdTo: any) => {
          return SectionIdTo.section_id;
        });
        let multi_section_id = this.dataSections.filter(Section => {
          return this.userSectionsData.section_id.indexOf(Section.multi_section_id) !== -1;
        });
        this.profileForm.get('multi_section_id').setValue(multi_section_id);
      },
      error => {
        this.alertService.error(error);
      });
  }
  compareSection(v1: any, v2: any): boolean {
    return v1 === v2.multi_section_id;
  }
  showProfile() {
    this.hideEditButton = !this.hideEditButton
  }

  //start popup
  AddParticipantPopupOpen(id): void {
    const dialogRef = this.dialog.open(AddparticipantComponent, {
      panelClass: 'addkpi-dial',
      height: '48%',
      width: '50%',
      data: id
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
        this.ShowJoinedGroups();
      }
    });
  }
  //for delete group
  DeleteGroup(id: any) {
    this.group_id = id;
    let login_access_token = this.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('group');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.DeleteGroupById(login_access_token, this.group_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.ShowJoinedGroups();
            }
            else {
              this.alertService.error(data.message, true);
            }
          },
          error => {
            this.alertService.error(error);
          });
      }
    });
  }
  // for edit group

  getGroupDetails(group_id: any) {
    // console.log('gid',this.group_id);
    let login_access_token = this.login_access_token;
    // let group_id  = this.group_id;
    this.userService.getGroupDetails(login_access_token, group_id).pipe(first()).subscribe((data: any) => {
      this.selectedGroupDetails = data.data;
      //    console.log('testing',this.selectedGroupDetails);

      const dialogRef = this.dialog.open(EditgroupComponent, {
        // width: 'auto',
        panelClass: 'addkpi-dial',
        data: this.selectedGroupDetails,
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
          this.ShowJoinedGroups();
        }
      });


    },
      error => {
        this.alertService.error(error);
      });
  }


  ////for create group popup

  CreateGroupPopupOpen(): void {
    const dialogRef = this.dialog.open(CreategroupComponent, {
      panelClass: 'addkpi-dial',
    });
    this._fuseConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
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
        }
      };
      if (result == "YesSubmit") {
        this.ShowJoinedGroups();
      }
    });
  }

}
