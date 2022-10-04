import { Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { performanceKpiDialog } from 'app/main/apps/module-roles/business-setting/performance-kpi.component';
import { FuseConfigService } from '@fuse/services/config.service';
//import { CalendarEvent } from 'angular-calendar';
import { MatColors } from '@fuse/mat-colors';
@Component({
  selector: 'setting',
  templateUrl: './business-setting.component.html',
  styleUrls: ['./business-setting.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BusinessSettingComponent implements OnInit {
  //event: CalendarEvent;
  presetColors = MatColors.presets;
  currentUser: any;
  unit_id: any;
  company_id: any;
  performanceKpi: any;
  tabByVlue: any;
  strObjData: any;
  companyForm: FormGroup;
  companyData: any = [];
  kpiData: any;
  companyPicture:any;
  kpiRed: any;
  kpiGreen: any;
  kpiYellow: any;
  tasksData: any;
  /*  reminder_date:any;
   reminder_frequency:any; */
  strObjForm: FormGroup;
  submitted = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['sr_no', 'kpi_name', 'performance_dash_name', 'action'];
  dataSource: any;
  /**
   * Constructor
    * @param {FuseSidebarService} _fuseSidebarService
   *
   */
  constructor(
    private route: ActivatedRoute,
    private router: RouterModule,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private alertService: AlertService,
    private _fuseSidebarService: FuseSidebarService,
    private _fuseConfigService: FuseConfigService
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.companyPicture = "assets/images/avatars/profile.jpg";
    this.unit_id = localStorage.getItem('currentUnitId');
    this.tabByVlue = 'all';
    this.viewKpiPerformancea();
    this.getCompanySetting();
    this.companyForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      company_id: [this.company_id, Validators.required],
      financial_year:['', Validators.required],
      reminder_date: ['', Validators.required],
      reminder_frequency: ['', Validators.required],
      company_address: ['', Validators.required],
      email: ['', Validators.required],
      image_id: [''],
      company_logo: [''],
      user_id:[''],
      company_settings_id:['']
    });
    this.strObjForm = this._formBuilder.group({
      login_access_token: [login_access_token, Validators.required],
      company_id: [this.company_id, Validators.required],
      color: [],
      // color_code:  new FormControl(this.strObjData.color_code)
    });
    this.kpiGreen = '#4caf50';
    this.kpiYellow = '#ffd933';
    this.kpiRed = '#f53a30';
  }
  getCompanySetting() {
    let login_access_token = this.currentUser.login_access_token;
    let company_id = this.company_id;
    this.userService.viewCompanySetting(login_access_token, company_id).pipe(first()).subscribe(
      (data: any) => {
        this.companyData = data.data.general_data[0];
        this.strObjData = data.data.str_obj_data;
        this.kpiData = data.data.kpi_data;
        this.tasksData = data.data.task_data;
        this.companyForm.patchValue({ financial_year: this.companyData.financial_year });
        this.companyForm.patchValue({ reminder_date: this.companyData.reminder_date });
        this.companyForm.patchValue({ reminder_frequency: this.companyData.reminder_frequency });
        this.companyForm.patchValue({ company_address: this.companyData.company_address });
        this.companyForm.patchValue({ email: this.companyData.email });
        this.companyForm.patchValue({ user_id: this.companyData.user_id });
        this.companyForm.patchValue({ company_settings_id: this.companyData.company_settings_id });
        this.companyForm.patchValue({
          company_logo: this.companyData.file_name
        });
        this.companyForm.patchValue({
          image_id: this.companyData.company_logo
        });

        //console.log(this.kpiData)
      },
      error => {
        this.alertService.error(error);
      });
  }
  comLogoSelected(event: any) {
    let reader = new FileReader();
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
        reader.readAsDataURL(file);
        // When file uploads set it to file formcontrol
        reader.onload = () => {
            this.companyForm.patchValue({
                company_logo: reader.result
            });
        }
    }
}
  companySubmit(){
    this.submitted = true;
        if (this.companyForm.invalid) {
            return;
        }
        this.userService.addCompanySetting(this.companyForm.value).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.companyForm.value.company_logo = "";
            }
            else {
              this.alertService.error(data.message, true);
          }

          },
          error => {
            this.alertService.error(error);
        });
  }
  strObjSubmit() {
    console.log('test', this.strObjForm.value)
  }
  performanceKpiOpen(element): void {
    const dialogRef = this.dialog.open(performanceKpiDialog, {
      width: 'auto',
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
        this.viewKpiPerformancea();
      }
    });
  }
  viewKpiPerformancea() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    this.userService.performanceKpiData(login_access_token, unit_id).pipe(first()).subscribe(
      (data: any) => {
        this.performanceKpi = data.data;
        this.performanceKpi.map((kpi: any, index: number) => {
          kpi.sr_no = index + 1;
        });
        this.dataSource = new MatTableDataSource<PeriodicElement>(this.performanceKpi);
      },
      error => {
        this.alertService.error(error);
      });
  }
  /**
    * Toggle the sidebar
    *
    * @param name
    */
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  toggleSidebarHide(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  /**
    * Change the filter
    *
    * @param filter
    */
  changeTab(tab): void {
    this.tabByVlue = tab;
  }
}
export interface PeriodicElement {
  sr_no: number;
  kpi_name: string;
  performance_dash_name: string;
  action: string;
}
