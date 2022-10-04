import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
  styleUrls: ['./invite-user.component.scss']
})
export class InviteUserComponent implements OnInit {

  registerForm: FormGroup;
  loading = false;
  submitted = false;
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
  role_id: number;
  dept_master_id: number;
  unit_id: number;
  section_id: number;
  status_code: any;
  LoginUserDetails: any;
  currentUser: any;
  company_id: any;
  // userrole: any = {data:''};
  // userDepartment: any = {data:''};
  //dataDepartment: any;
  // userSections: any = {data:''};
  //dataSections: any;
  // Private

  constructor(
    private _formBuilder: FormBuilder,
    // private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) { }
  /**
  * On init
  */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.company_id = this.currentUser.data.company_id;
    this.unit_id = this.currentUser.data.unit_id;
    console.log("unittt", this.unit_id);
    
    this.registerForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      passwordConfirm: [''],
      role_id: [2, Validators.required],
      company_id: [this.company_id],
      user_id: [''],
      multi_dept_id: [[]],
      multi_unit_id: [[this.unit_id]],
      multi_section_id: [[]]
    });
  }
  onSubmit() {
    this.submitted = true;
    this.registerForm.value.password = 'Prima@123';
    this.registerForm.value.passwordConfirm = 'Prima@123';
    
    // if (this.registerForm.valid) {
    //   console.log("valid",this.registerForm.value);
    //   return;
    // }
    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    this.userService.register(this.registerForm.value).pipe(first()).subscribe(
      (data: any) => {
        if (data.status_code == 200) {
          this.alertService.success(data.message, true);
          setTimeout(() => {
            localStorage.setItem('signupUserDetails', JSON.stringify(this.registerForm.value));
            this.router.navigate(['/apps/company-setup']);
            this.registerForm.reset();
          }, 3000);
        } else {
          this.alertService.error(data.message, true);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }




}
