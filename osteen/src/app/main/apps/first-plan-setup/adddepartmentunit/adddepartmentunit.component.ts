import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, DateAdapter, MAT_DATE_FORMATS  } from '@angular/material';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { log } from 'console';

@Component({
  selector: 'app-adddepartmentunit',
  templateUrl: './adddepartmentunit.component.html',
  styleUrls: ['./adddepartmentunit.component.scss']
})
export class AdddepartmentunitComponent implements OnInit {

    direction = 'row';
    currentUser: any;
    AddDeptForm: FormGroup;
    submitted = false;
    message: any;
    userrole: any = { data: '' };
    userListAllData: any;
    unitsData: any;
    // Private
    private _unsubscribeAll: Subject<any>;
    allDetailsCompany: any;
    company_id: any;
  currentUnitId: any;
    LoginUserDetails: any;
    SprUsr: any;

    constructor(
        public dialogRef: MatDialogRef<AdddepartmentunitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private _formBuilder: FormBuilder,
        private userService: UserService,
        private alertService: AlertService,
        public dialog: MatDialog,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    AddDeptClose(): void {
        this.dialogRef.close();
    }
    ngOnInit(): void {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let login_access_token = this.currentUser.login_access_token;
        this.currentUnitId = JSON.parse(localStorage.getItem('currentUnitId'));
        this.LoginUserDetails =JSON.parse(localStorage.getItem('LoginUserDetails'))
        this.SprUsr = this.LoginUserDetails.id;
        this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
        this.company_id = this.allDetailsCompany.general_data[0].company_id;
        this.AddDeptForm = this._formBuilder.group({
            login_access_token: [login_access_token, Validators.required],
            SprUsr:[this.SprUsr, Validators.required],
            unit_id: [this.currentUnitId, Validators.required],
            company_id: [this.company_id, Validators.required],
            dept_name: ['', Validators.required],
            role_id: ['4', Validators.required],
            user_id: ['', Validators.required],
        });
        this.SelectModuleGet();
        this.userLisetGet();
        this.unitsGet();
        // this.AddDeptForm.patchValue({ unit_id: this.currentUnitId });
    }
    AddDeptSubmit() {
        this.submitted = true;
        // stop here if AddUnitForm is invalid
        if (this.AddDeptForm.invalid) {
            return;
        }
        this.userService.addDepartmentChange(this.AddDeptForm.value).pipe(first()).subscribe(
            (data: any) => {
                if (data.status_code == 200) {
                    const storeDeptIdOld = this.currentUser.dept_id;
                    let newDeptId = data.data.dept_id;
                    const storeAllDept = storeDeptIdOld.concat(',', newDeptId);
                    console.log('Hellol', storeAllDept);
                    this.currentUser.dept_id = storeAllDept;
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.alertService.success(data.message, true);
                    this.dialogRef.close('YesSubmit');
                }
                else {
                    this.alertService.error(data.message, true);
                }
            },
            error => {
                this.alertService.error(error); 
        });
    }
    unitsGet() {
        let login_access_token = this.currentUser.login_access_token;
        let company_id = this.currentUser.data.company_id;
        this.userService.getUnitChange(login_access_token, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.unitsData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    SelectModuleGet() {
        this.userService.GetSelectModule().pipe(first()).subscribe(
            (data: any) => {
                this.userrole = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
    userLisetGet() {
        let login_access_token = this.currentUser.login_access_token;
        let role_id = this.currentUser.role_id;
        let company_id = this.currentUser.data.company_id;
        this.userService.getAllUserList(login_access_token, role_id, company_id).pipe(first()).subscribe(
            (data: any) => {
                this.userListAllData = data.data;
            },
            error => {
                this.alertService.error(error);
            });
    }
}
export interface DialogData {
    animal: string;
    name: string;
}

