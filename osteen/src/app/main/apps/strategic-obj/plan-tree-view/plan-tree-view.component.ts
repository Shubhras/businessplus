import { Component, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { InitiativeService } from 'app/main/apps/strategic-obj/initiative/initiative.service';
import { AddActionPlanDialog } from 'app/main/apps/strategic-obj/action-plan-add/addactionplan.component';
import { FormControl } from '@angular/forms';
import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { first } from 'rxjs/operators';
import { AddInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-add/addinitiative.component';
import { Subscription } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
import { FuseConfigService } from '@fuse/services/config.service';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import * as _ from 'lodash';
import * as moment from 'moment';
import { AddKpiDialog } from 'app/main/apps/kpitrackers/keyperformance/addkpi.component';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { DialogData } from '../../business-vitals/governance/add-governance.component';
import { AddStrategicDialog } from '../strategic/addstrategic.component';
import { EditKpiDialog } from 'app/main/apps/kpitrackers/keyperformance/editkpi.component';
import { EditStrategicDialog } from 'app/main/apps/strategic-obj/strategic/editstrategic.component';
import { EditInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-data/editinitiative.component';
// import { EditActionPlanDialog} from 'app/main/apps/strategic-obj/action-plan/editactionplan.component';
@Component({
  selector: 'app-plan-tree-view',
  templateUrl: './plan-tree-view.component.html',
  styleUrls: ['./plan-tree-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PlanTreeViewComponent implements OnInit {
  currentUser: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  selectedyearint: any;
  unit_id: any;
  name: string;
  ViewStrategicAllData: any;
  dataDepartment: any;
  status_code: any;
  StraSuccess: any;
  MessageSuccess: any;
  MessageError: any;
  StraError: any;
  strategic_objectives_id: number;
  user_id: number;
  strategicAllData: any;
  currentMonth: any;
  currentYear: any;
  selectYear: any;
  userModulePermission: any;
  deptAccorPermission: any;
  initiDataPermission: any;
  allExpandState: any;
  userDataComment: any;
  strObjActionData: any;
  selectedYearVal: any;
  userrole: any;
  straObjStatus: any;
  start_date: any;
  end_date: any;
  empty = false;
  end_taerget_date: any;
  companyCreateData: any;
  counter3 = 1;
  renderStrategicData: Array<any>;
  filter: any = { department_id: '', status_name: '', end_date: '' };
  action_plans = { def: null, action_plan_id: null };
  filteredData: any;
  currentYearSubscription: Subscription;
  userSelectedYear: number;
  strObjPermission: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  action_plan_id: number;
  initiatives_id: number;
  kpi_id: number;
  total_objectives: any;
  show = false;
  fullScreen = true;
  template = ``;
  login_access_token: any;
  initiativesPermission: any;
  actionPlanPermission: any;
  kpiPermission: any;
  /**
   * Constructor
   *
   * @param {InitiativeService} _initiativeService
   */
  constructor(
    private confirmationDialogService: ConfirmationDialogService,
    private _initiativeService: InitiativeService,
    public dialog: MatDialog,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService,
    private _fuseConfigService: FuseConfigService,
  ) {

  }
  dept_nameFilter = new FormControl();
  end_dateFilter = new FormControl();
  status_nameFilter = new FormControl();
  ngOnInit(): void {
    this.loaderService.showtime();
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_id = localStorage.getItem('currentUnitId');
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.login_access_token = this.currentUser.login_access_token;
    this.companyCreateData = this.allDetailsCompany ? this.allDetailsCompany.general_data[0].company_created_date : null;
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.getDepartment();
    this.strObjStatusGet();
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewStrategicObjectives();
    });

    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;

    this.userService.strategicDashboardView(this.login_access_token, this.unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.total_objectives = data.data;
        if (this.total_objectives.strategic_objectives.total == 0) {
          this.openWelcomeDialog();
        }
      });
    let now = new Date();
    this.currentMonth = moment(new Date()).format("MM");
    this.currentYear = moment(now, 'YYYY-MM-DD').format('YYYY');
    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      // if (this.userModulePermission[i].module_name == "Initiative_datas") {
      //   this.initiDataPermission = this.userModulePermission[i];
      // }
      if (this.userModulePermission[i].module_name == "Initiatives") {
        this.initiativesPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Strategic_objectives") {
        this.strObjPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Action_plans") {
        this.actionPlanPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Add_kpis") {
        this.kpiPermission = this.userModulePermission[i];
      }
    }
    this.selectedYearVal = this.currentYear;
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  ngAfterContentInit(): void {
    this.loaderService.hide();
  }
  // permissionMenu() {
  //   if ((this.initiativesPermission.acc_create == 1) && (this.strObjPermission.acc_edit == 1) && (this.strObjPermission.acc_delete == 1)) {
  //     alert('You don`t have permission');
  //   }
  // }
  // pop
  openWelcomeDialog() {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      disableClose: true,
      data: {
        animal: 'panda',
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.animal = result;
    });
  }
  AddStrategicPopupOpen(): void {
    const dialogRef = this.dialog.open(AddStrategicDialog, {
      // panelClass: 'startegic-dial'
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
        this.viewStrategicObjectives();
      }
    });
  }
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.dataDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe(
      (data: any) => {
        this.userrole = data;
        this.straObjStatus = this.userrole.data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  viewStrategicObjectives() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.strategicObjectivesData(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {

        this.strategicAllData = data.data;
        console.log('this.strategicAllData', this.strategicAllData);

        console.log('herllo', this.strategicAllData.length);
        for (var i = 0; i <= this.strategicAllData.length; i++) {
          // if (this.strategicAllData[i] > 0) {
          this.processData(this.strategicAllData);
          // }
          // else {
          //   this.empty = true;
          // }
        }
        // this.processData(this.strategicAllData);

        // for (var i = 0; i <= this.strategicAllData.length; i++) {
        //   if (this.strategicAllData[i].strategic_objectives.length == 0) {
        //     this.empty = true;
        //   }
        //   else {
        //     this.processData(this.strategicAllData);
        //   }
        // }
      },
      error => {
        this.alertService.error(error);
      });
  }
  DeleteStrategicData(strategic_objectives_id, user_id) {
    let login_access_token = this.currentUser.login_access_token;
    this.strategic_objectives_id = strategic_objectives_id;
    this.user_id = user_id;
    const confirmResult = this.confirmationDialogService.confirm('strategic objective');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.StrategicDataDelete(login_access_token, strategic_objectives_id, user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.viewStrategicObjectives();
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

  EditStrategicPopupOpen(element): void {
    console.log('tree strategic', element)

    const dialogRef = this.dialog.open(EditStrategicDialog, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewStrategicObjectives();
      }
    });
  }
  editInitiativeOpen(element): void {
    // console.log('tree initiative', element)
    const dialogRef = this.dialog.open(EditInitiativeDialog, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewStrategicObjectives();
      }
    });
  }
  // editActionPlanOpen(element): void {
  //   console.log('tree action', element)
  //   // return
  //   const dialogRef = this.dialog.open(EditActionPlanDialog, {
  //     data: element
  //   });
  //   console.log("test", element);

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == "YesSubmit") {
  //       this.viewStrategicObjectives();
  //     }
  //   });
  //  }
  kpieditdial(element) {

    // console.log('mitushhh', element)
    const dialogRef = this.dialog.open(EditKpiDialog, {
      data: element
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
        this.viewStrategicObjectives();
      }
    });
  }
  // Editkpidial(element: any) {
  //   const dialogRef = this.dialog.open(EditKpiDialog, {
  //     data: element
  //   });
  //   this._fuseConfigService.config = {
  //     layout: {
  //       navbar: {
  //         hidden: true
  //       },
  //       sidepanel: {
  //         hidden: true
  //       }
  //     }
  //   };
  //   dialogRef.afterClosed().subscribe(result => {
  //     this._fuseConfigService.config = {
  //       layout: {
  //         navbar: {
  //           hidden: false
  //         },
  //       }
  //     };
  //     if (result == "YesSubmit") {
  //       this.viewStrategicObjectives();
  //     }
  //   });
  // }

  addInitiativeOpen(element): void {

    const dialogRef = this.dialog.open(AddInitiativeDialog, {
      panelClass: 'startegic-dial',
      data: element
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
        this.viewStrategicObjectives();
      }
    });
  }
  deleteInitiative(initiatives_id, user_id) {
    let login_access_token = this.currentUser.login_access_token;
    this.initiatives_id = initiatives_id;
    this.user_id = user_id;
    const confirmResult = this.confirmationDialogService.confirm('initiative');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.initiativeDelete(login_access_token, initiatives_id, user_id).pipe(first()).subscribe(
          data => {
            this.status_code = data;
            if (this.status_code.status_code == 200) {
              this.MessageSuccess = data;
              this.alertService.success(this.MessageSuccess.message, true);
              this.viewStrategicObjectives();
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
  addActionOpen(element): void {
    const dialogRef = this.dialog.open(AddActionPlanDialog, {
      panelClass: 'startegic-dial',
      data: element
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
        this.viewStrategicObjectives();
      }
    });
  }

  deleteActionPlan(action_plan_id, user_id) {
    let login_access_token = this.currentUser.login_access_token;
    this.action_plan_id = action_plan_id;
    this.user_id = user_id;
    const confirmResult = this.confirmationDialogService.confirm('action plan');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.actionPlanDelete(login_access_token, action_plan_id, user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.viewStrategicObjectives();
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

  addKpiOpen(dept_id, section_id, s_o_id, initiatives_id, action_plans_id): void {
    const element = {
      "dept_id": dept_id,
      "section_id": section_id,
      "s_o_id": s_o_id,
      "initiatives_id": initiatives_id,
      "actionPlansData": [{ action_plan_id: action_plans_id }],
    }

    const dialogRef = this.dialog.open(AddKpiDialog, {
      panelClass: 'startegic-dial',
      data: element
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
        this.viewStrategicObjectives();
      }
    });
  }
  DeleteKpiData(kpi_id, user_id) {
    this.kpi_id = kpi_id;
    this.user_id = user_id;
    let login_access_token = this.currentUser.login_access_token;
    const confirmResult = this.confirmationDialogService.confirm('kpi');
    confirmResult.afterClosed().subscribe((result) => {
      if (result == true) {
        this.userService.KpiDataDelete(login_access_token, kpi_id, user_id).pipe(first()).subscribe(
          (data: any) => {
            if (data.status_code == 200) {
              this.alertService.success(data.message, true);
              this.viewStrategicObjectives();
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
  filterRenderedData(key: string, value: any) {
    if (key === "end_date") {
      this.filter[key] = moment(value).format('YYYY-MM-DD').toLowerCase();
    }

    else {
      this.filter[key] = value;
    }
    let filteredData: any;
    filteredData = this.strategicAllData.map((dept: any) => {

      let str = dept.strategic_objectives.filter((so: any) => {
        let d = this.filter.department_id !== '' ? so.department_id === Number(this.filter.department_id) : true;
        let s = this.filter.status_name !== '' ? so.status_name === this.filter.status_name : true;
        let e_date = this.filter.end_date !== '' ? so.end_date <= this.filter.end_date : true;

        return (d && s && e_date);
      });
      return {
        ...dept,
        'strategic_objectives': [...str]
      }
    });
    this.processData(filteredData);
  }
  resetOptions() {
    this.dept_nameFilter.reset('');
    this.status_nameFilter.reset('');
    this.end_dateFilter.reset('');
    this.viewStrategicObjectives();
  }

  actionDataFiilter(deptId, strObjId, initiativeId, actionPlanId, selectYear) {
    let department;

    if (deptId) {
      this.renderStrategicData.map((d: any) => {
        if (d.id === deptId) {
          d.strategic_objectives.map((s: any) => {
            if (s.strategic_objectives_id === strObjId) {
              s.initiatives.map((i: any) => {
                if (i.initiatives_id === initiativeId) {
                  i.action_plans.map((a: any) => {
                    if (a.action_plans_id === actionPlanId) {
                      a.datasource = this.strObjActionData[0].datasource;
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  }
  processData(initalldata: any): any {
    // let tempstr = [];
    this.renderStrategicData = initalldata;
    console.log('this.renderStrategicData111', this.renderStrategicData.length);

    // let temp_renderStrategicData = this.renderStrategicData;
    // let dot = '.';
    // let counter = 1;
    this.renderStrategicData.map((depts: any) => {
      const strategies = [...depts.strategic_objectives];
      if (_.isArray(strategies) && !_.isEmpty(strategies)) {

        strategies.map((strategy: any) => {
          // strategy['srno'] = counter;
          // let tcounter = counter;
          // counter = counter + 1;
          // tempstr.push(strategy);
          const initiatives = [...strategy.initiatives];
          if (_.isArray(initiatives) && !_.isEmpty(initiatives)) {
            // let counter1 = 1;
            initiatives.map((initiative: any) => {
              // initiative['sr_no'] = tcounter + dot + counter1;
              // counter1 = counter1 + 1;
              const actionPlans = [...initiative.action_plans];
              // let counter2 = 1;
              // actionPlans.map((actionPlan: any) => {
              //   // actionPlan['sr_no'] = initiative['sr_no'] + dot + counter2;
              //   // counter2 = counter2 + 1;
              //   // actionPlan.kpis.forEach(kpis_row => {
              //   //   if (actionPlan.action_plans_id == kpis_row.action_plan_id) {
              //   //     let taction_plans = [{ def:actionPlan.definition, action_plan_id: actionPlan.action_plans_id }];
              //   //     this.action_plans['def'] = taction_plans[0].def;
              //   //     this.action_plans['action_plan_id'] = taction_plans[0].action_plan_id;
              //   //     kpis_row['action_plans'] = this.action_plans;
              //   //   }

              //   // });
              //   // console.log('oooo', actionPlan);
              // })
              if (_.isArray(actionPlans) && !_.isEmpty(actionPlans)) {

                this.selectYear = Number(this.currentYear);
                this.actionPlanSaprate(actionPlans, this.selectYear);
              }
            })
          }
        });
      }
      else { }
    })
    // console.log('tempstr', tempstr);
    // console.log('this.renderStrategicData', this.renderStrategicData);
    // for (let index = 0; index < temp_renderStrategicData.length; index++) {
    //   if (temp_renderStrategicData[index].strategic_objectives.length != 0) {
    //     temp_renderStrategicData[index]['s_no'] = temp_renderStrategicData[index].strategic_objectives[0].so_sno;
    //   }
    // }
    // console.log('temp_renderStrategicData', temp_renderStrategicData);

  }

  actionPlanSaprate(actionPlans: any, selectYear) {
    this.selectYear = selectYear;
    const todayDate = new Date().getDate();
    const currentMonth = moment().format('MM');
    const currentnum = Number(currentMonth);
    const currentnumprevious = currentnum - 1;
    const currentDate = moment().format('DD');
  }
  initiativeDataPDF() {
    this.loaderService.show();
    this.allExpandState = true;
    setTimeout(() => {
      var data = document.getElementById('initiative-data');
      html2canvas(data).then(canvas => {
        var imgWidth = 208;
        var pageHeight = 295;
        var imgHeight = canvas.height * imgWidth / canvas.width;
        var heightLeft = imgHeight;
        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jspdf('p', 'mm', 'a4');
        var position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('masterActionPlan.pdf');
        this.loaderService.hide();
        this.allExpandState = false;
      });
    }, 50);
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./dialog-overview-example-dialog.scss'],
  // styleUrls: ['./welcome-screen.component.scss']
})
export class DialogOverviewExampleDialog {
  isopened = false;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  openobj() {
    this.isopened = true;

  }
  openobjclose() {
    this.isopened = false;

  }
}