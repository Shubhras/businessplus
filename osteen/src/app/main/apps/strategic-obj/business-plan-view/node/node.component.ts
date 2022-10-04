import { Component, OnInit, Input, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
// import { SideNavService} from '../side-nav.service';
import { TreelistService } from '../treelist.service';
import { AddInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-add/addinitiative.component';
import { AddActionPlanDialog } from 'app/main/apps/strategic-obj/action-plan-add/addactionplan.component';
import { AddKpiDialog } from 'app/main/apps/kpitrackers/keyperformance/addkpi.component';
import { VERSION, MatDialogRef, MatSnackBar } from '@angular/material';
// import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';
import { FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Subscription, concat } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
//import { LoaderService } from 'app/main/apps/loader/loader.service';
//import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { ConfirmationDialog } from 'app/main/apps/strategic-obj/business-plan-view/business-plan-view.component';
import { InitiativeDetail, ActionPlanDetail } from 'app/main/apps/strategic-obj/business-plan-view/business-plan-view.component';
import { FuseConfigService } from '@fuse/services/config.service';
import { EditInitiativeDialog } from '../../initiative-data/editinitiative.component';
import { EditActionPlanDialog } from '../../action-plan/editactionplan.component';
import { EditStrategicDialog } from '../../strategic/editstrategic.component';
import { KpidetailsComponent } from '../kpidetails/kpidetails.component';
// import {Subscription} from 'rxjs';
// import {timer} from 'rxjs';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',

  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit {


  @Input() node;
  selectedNodeID: string;
  nodeId: string;
  ticks = 0;
  public hideChildrenList;
  mouseDownX: string;
  mouseDownY: string;
  start_date: any;
  currentlyHoveringId: string;
  currentUser: any;
  unit_id: string;
  deptAccorPermission: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  sub: any;
  strategicObjectivesId: any;
  userSelectedYear: any;
  strategicAllData: any;
  renderStrategicData: any;
  currentUrl: any
  userModulePermission: any;
  strObjPermission: any;
  initiativesPermission: any;
  actionPlanPermission: any;
  kpiPermission: any;

  constructor(private router: Router, private treelistsvc: TreelistService, private userService: UserService,
    private alertService: AlertService, private snackBar: MatSnackBar, public dialog: MatDialog, private route: ActivatedRoute, private _fuseConfigService: FuseConfigService
  ) {

    this.treelistsvc.hideChilrenToggler$.subscribe((status) => {
      this.hideChildrenList = treelistsvc.hideChildrenOfIds;
    });
    this.treelistsvc.hoverNodeToggler$.subscribe((status) => {
      this.currentlyHoveringId = treelistsvc.currentlyHoveringId;
    });
    this.hideChildrenList = [];
  }


  ngOnInit() {
    // console.log('node', this.node);

    // this.node = Array.of(this.node); 
    this.currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
    for (let i = 0; i < this.userModulePermission.length; i++) {
      // console.log('userModulePermission',this.userModulePermission);

      if (this.userModulePermission[i].module_name == "Strategic_objectives") {
        this.strObjPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Initiatives") {
        this.initiativesPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Action_plans") {
        this.actionPlanPermission = this.userModulePermission[i];
      }
      if (this.userModulePermission[i].module_name == "Add_kpis") {
        this.kpiPermission = this.userModulePermission[i];
      }
    }
    this.unit_id = localStorage.getItem('currentUnitId');
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;

    // this.viewSingleStrObje();
    // this.viewSingleStrObje12();
    // this.getDepartment();
    this.userSelectedYear = this.currentUser.userSelectedYear;
    this.strategicObjectivesId = this.node.id;
    // this.viewSingleStrObje11();
  }

  viewSingleStrObje() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;

    this.userService.strObjeSingleStrData(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.strategicAllData = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewSingleStrObje12() {
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let s_o_id = this.strategicObjectivesId;
    let unit_id = this.unit_id;
    this.userService.strObjeSingleStrDataFlow(login_access_token, s_o_id, selectedYear, unit_id).pipe(first()).subscribe(
      (data: any) => {
        this.renderStrategicData = data.children;
        let dataData2 = {
          "name": "root",
          "children": data.children
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

  viewSingleStrObje11() {
    let login_access_token = this.currentUser.login_access_token;
    let selectedYear = this.userSelectedYear;
    let s_o_id = this.strategicObjectivesId;
    let unit_id = this.unit_id;

    this.userService.strObjeSingleStrData11(login_access_token, s_o_id, selectedYear, unit_id).pipe(first()).subscribe(
      (data: any) => {
        this.renderStrategicData = data.data;
        // this.node.children = this.renderStrategicData[0];    
      },
      error => {
        this.alertService.error(error);
      });
  }
  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {
        this.getDepartment = data.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  shouldShowPopup(id) {
    return this.currentlyHoveringId === id;
  }

  hideChilren(id) {
    this.treelistsvc.hideNodeChilren(id);
  }

  mouseDown(nodeID: string, selectedNode, event) {
    // console.log('mouse down: ' + this.ticks);
    if (event.target.id !== 'expandbutton') {
      this.mouseDownX = event.clientX;
      this.mouseDownY = event.clientY;
    }
  }



  getSelectedNodeID() {
    // return this.sidenav.getFocusNodeId();
  }

  mouseEnter(id) {
    this.treelistsvc.setCurrentlyHoveringId(id);
  }

  mouseLeave(id, event) {
    this.treelistsvc.setCurrentlyHoveringId('');
  }

  // nodeClicked(nodeID: string, selectedNode, event) {
  // }
  addInitiativeOpen(element): void {
    if (element.type == 's') {
      if (this.initiativesPermission.acc_edit == 1) {
        const dialogRef = this.dialog.open(AddInitiativeDialog, {
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
            // this.viewSingleStrObje();
            //   this.viewSingleStrObje12();
            this.router.navigate([this.currentUrl]);
            this.viewSingleStrObje11();
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }
    else if (element.type == 'i') {
      if (this.actionPlanPermission.acc_create == 1) {
        const dialogRef = this.dialog.open(AddActionPlanDialog, {
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
            this.viewSingleStrObje12();
            this.viewSingleStrObje11();
            this.router.navigate([this.currentUrl]);
            // this.router.navigate(["./business-plan-view.component.ts"]);
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }

    else if (element.type == 'a') {
      if (this.kpiPermission.acc_create == 1) {
        const dialogRef = this.dialog.open(AddKpiDialog, {
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
            this.viewSingleStrObje11();
            this.router.navigate([this.currentUrl]);
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }
    else {
      // console.log('element', element.type);
    }

  }
  editInitiativeOpen(element): void {
    element['description'] = element.definition;
    if (element.type == 's') {
      if (this.strObjPermission.acc_edit == 1) {
        const dialogRef = this.dialog.open(EditStrategicDialog, {
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
            // this.viewSingleStrObje();
            //   this.viewSingleStrObje12();
            this.router.navigate([this.currentUrl]);
            this.viewSingleStrObje11();
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }
    else if (element.type == 'i') {
      if (this.initiativesPermission.acc_edit == 1) {
        const dialogRef = this.dialog.open(EditInitiativeDialog, {
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
            this.viewSingleStrObje12();
            this.viewSingleStrObje11();
            this.router.navigate([this.currentUrl]);
            // this.router.navigate(["./business-plan-view.component.ts"]);
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }

    else if (element.type == 'a') {
      // console.log('element action', element);
      if (this.actionPlanPermission.acc_edit == 1) {
        element['action_plan_definition'] = element.definition;
        element['action_plan_id'] = element.action_plans_id;
        element.children.map((kpi: any) => {
          kpi['kpi_id'] = kpi.id;
          kpi['kpi_name'] = kpi.definition;
        });
        if (element.children.length == 0) {
          let kpit = [{ kpi_id: null, kpi_name: null }];
          element['kpi_data'] = kpit;
        }
        else {
          element['kpi_data'] = element.children;
        }
        const dialogRef = this.dialog.open(EditActionPlanDialog, {
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
            this.viewSingleStrObje11();
            this.router.navigate([this.currentUrl]);
          }
        });
      }
      else {
        alert('You don`t have permission');
      }
    }
    else {
      // console.log('element', element.type);
    }

  }

  addInitiativeforKpiOpen(dept_id, section_id, s_o_id, initiatives_id, action_plans_id): void {
    const element = {
      "dept_id": dept_id,
      "section_id": section_id,
      "s_o_id": s_o_id,
      "initiatives_id": initiatives_id,
      "actionPlansData": [{ action_plan_id: action_plans_id }],
    }
    const dialogRef = this.dialog.open(AddKpiDialog, {
      data: element
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.viewSingleStrObje11();
        this.router.navigate([this.currentUrl]);
      }
    });
  }

  openDialog(element): void {
    if (element.type == 's') {
      const dialogRef = this.dialog.open(ConfirmationDialog, {
        data: element,
      });
    }
    if (element.type == 'i' && element.type != 's') {
      const dialogRef = this.dialog.open(InitiativeDetail, {
        data: element
      });
    }
    if (element.type == 'a' && element.type != 's' && element.type != 'i') {
      const dialogRef = this.dialog.open(ActionPlanDetail, {
        data: element
      });
    }
    if (element.type == 'k' && element.type != 'a' && element.type != 's' && element.type != 'i') {
      // console.log('kpii',element);

      const dialogRef = this.dialog.open(KpidetailsComponent, {
        data: element
      });
    }

    // if (element.type == 'k' && element.type != 'a' && element.type != 's' && element.type != 'i') {
    //   const dialogRef = this.dialog.open(KpiDetail, {
    //     // data: element
    //   });
    // }
    // else{
    //   const dialogRef = this.dialog.open(KpiDetail, {
    //     data: element
    //   });
    // }

    // else {
    //   console.log('element', element.type);
    // }
  }

  shouldHideChildren(id) {
    return this.treelistsvc.hideChildrenOfIds.includes(id);
  }

  // addChild(id) {
  //   return
  //   // console.log('add child to ' + id);
  //   this.treelistsvc.addChild(id);
  // }
}
