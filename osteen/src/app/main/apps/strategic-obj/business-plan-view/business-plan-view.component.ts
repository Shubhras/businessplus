import { Component, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { SideNavService } from './side-nav.service';
import { MatSidenav } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Subscription, concat } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
import { TreelistService } from './treelist.service';
import { first } from 'rxjs/operators';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, DateAdapter, MAT_DATE_FORMATS, MAT_DIALOG_DATA } from '@angular/material';
import { VERSION, MatDialogRef, MatSnackBar } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from './dateadapter';

//import { LoaderService } from 'app/main/apps/loader/loader.service';
//import { ConfirmationDialogService } from 'app/main/apps/confirmation-dialog/confirmation-dialog.service';

import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { trigger } from '@angular/animations';
import { Selector } from 'angular-bootstrap-md/lib/modals/modal.options';





@Component({
  selector: 'app-business-plan-view',
  templateUrl: './business-plan-view.component.html',
  animations: [
    trigger('animate', [
    ])
  ],
  styleUrls: ['./business-plan-view.component.scss']
})
export class BusinessPlanViewComponent implements OnInit {
  [x: string]: any;
  nodes: any = [
    {
      name: 'Sundar Pichai',
      cssClass: 'ngx-org-ceo',
      image: '',
      title: 'Chief Executive Officer',
      childs: [
        {
          name: 'Thomas Kurian',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, Google Cloud',
        },
        {
          name: 'Susan Wojcicki',
          cssClass: 'ngx-org-ceo',
          image: 'assets/node.svg',
          title: 'CEO, YouTube',
          childs: [
            {
              name: 'Beau Avril',
              cssClass: 'ngx-org-head',
              image: 'assets/node.svg',
              title: 'Global Head of Business Operations',
              childs: []
            },
            {
              name: 'Tara Walpert Levy',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Agency and Brand Solutions',
              childs: []
            },
            {
              name: 'Ariel Bardin',
              cssClass: 'ngx-org-vp',
              image: 'assets/node.svg',
              title: 'VP, Product Management',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        },
        {
          name: 'Jeff Dean',
          cssClass: 'ngx-org-head',
          image: 'assets/node.svg',
          title: 'Head of Artificial Intelligence',
          childs: [
            {
              name: 'David Feinberg',
              cssClass: 'ngx-org-ceo',
              image: 'assets/node.svg',
              title: 'CEO, Google Health',
              childs: []
            }
          ]
        }
      ]
    },

  ];
  dataTets: any =
    {
      "name": "root",
      "children": [
        {
          "name": "Prepare new Business Planning and Strategy Mapping software for Engineering Industries",
          "description": "Production",
          "id": "1",
          "datecreated": "2021-01-07",
          "installid": "WeShipAnythingProd",

          "type": "s",
          "children": [
            {

              "name": "Prepare structure and Template and frame work for tool",
              "description": "User acceptance testing EU",
              "id": "12",
              "datecreated": "2018-7-05",

              "type": "i",
              "children": [
                {
                  "name": "Identify members and start onboarding",
                  "id": "5",
                  "description": "Development environment for EU West 1",
                  "datecreated": "2018-7-10",

                  "type": "a",
                  "children": []
                },
                {
                  "name": "action plan test2020",
                  "id": "11",
                  "description": "Development environment for EU West 2",
                  "datecreated": "2018-7-11",

                  "type": "a",
                  "children": []
                }
              ]
            },
            {
              "name": "Plan for various modules in the Business Plan software Prima Plus",
              "id": "4",
              "description": "User acceptance testing US",
              "datecreated": "2018-7-12",

              "type": "i",
              "children": [
                {
                  "name": "Dev US 1",
                  "description": "Development environment for US East",
                  "id": "5",
                  "datecreated": "2018-7-13",

                  "type": "a",
                  "children": []
                },
                {
                  "name": "Dev US 2",
                  "description": "Development environment for US West",
                  "id": "13",
                  "datecreated": "2018-7-13",

                  "type": "a",
                  "children": []
                }
              ]
            }
          ]
        },

      ]
    }
  title = 'app';

  public treeLists = [];
  public currentlySelectedTree: { id: any; }[][];
  public currentlySelectedTreeId: any;
  @ViewChild('mySideNav') public myNav: MatSidenav;
  allDetailsCompany: any;
  companyFinancialYear: any;
  deptAccorPermission: any;
  unit_id: string;
  currentUser: any;
  sub: any;
  strategicObjectivesId: any;
  userSelectedYear: any;
  // userService: any;
  renderStrategicData: any;
  test: boolean;


  constructor(private sidenav: SideNavService, private treelistsvc: TreelistService, private userService: UserService,
    private alertService: AlertService, private route: ActivatedRoute, private dataYearService: DataYearService

  ) {

    // this.sidenav.sideNavToggler$.subscribe((status) => {
    //   if (status) {
    //     this.openSideNav();
    //   }
    //   else {
    //     this.closeSideNav();
    //   }
    // });

    this.treelistsvc.treeToggler$.subscribe((status) => {

      console.log('nagar', status);
      this.currentlySelectedTree = treelistsvc.currentlySelectedTree;
      this.currentlySelectedTreeId = treelistsvc.currentlySelectedTreeId;
      this.treelistsvc.clearHiddenChildren();


      console.log('nagar', treelistsvc);
    });

    // for (const c of this.dataTets.children) {
    //   const alist = [];
    //   alist.push(c);
    //   this.treeLists.push([alist]);
    // }

    // this.treelistsvc.setCurrentlySelectedTree(this.treeLists[0]);
    // this.currentlySelectedTree = treelistsvc.currentlySelectedTree;
    // this.currentlySelectedTreeId = this.currentlySelectedTree[0][0].id;




  }
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // console.log("userr", this.currentUser);

    this.unit_id = localStorage.getItem('currentUnitId');
    this.deptAccorPermission = this.currentUser.dept_id;
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.sub = this.route.params.subscribe((params: { [x: string]: any; }) => {
      if (params['strObjId']) {
        this.strategicObjectivesId = params['strObjId'];
        //console.log('sir obj id', this.strategicObjectivesId);
      }
    });
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewSingleStrObje();
      this.viewSingleStrObje11();
      // this.disableButton();
    });


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
        // this.processData(this.strategicAllData);
      },
      error => {
        this.alertService.error(error);
      });
  }
  // dataTestDemo: any = {
  //   strategic_objectives_id: 1,
  //   target: 'Develop tool and Launch in the market',
  //   start_date: '2020-06-01',
  //   end_date: '2021-04-02',
  //   unit_id: 1,
  //   unit_name: 'ABC New Delhi (indore)',
  //   department_id: 1,
  //   dept_name: 'IT & Business Process',
  //   user_id: 1,
  //   user_name: 'Super Admin',
  //   tracking_frequency: '',
  //   description:
  //     'Prepare  new Business Planning and Strategy Mapping software for Engineering Industries',
  //   uom_name: '%',
  //   status_name: 'Yellow',
  //   percentage: '97',
  //   initiatives: [
  //     {
  //       sr_no: '1.1',
  //       initiatives_id: 1,
  //       definition: 'Prepare structure and Template and frame work for tool',
  //       s_o_id: 1,
  //       description:
  //         'Prepare  new Business Planning and Strategy Mapping software for Engineering Industries',
  //       dept_id: 1,
  //       dept_name: 'IT & Business Process',
  //       section_id: 6,
  //       section_name: 'Software Management',
  //       user_id: 2,
  //       start_date: '2020-06-01',
  //       end_date: '2020-09-30',
  //       percentage: '90',
  //       status_name: 'Yellow',
  //       action_plans: [
  //         {
  //           sr_no: '1.1.1',
  //           action_plans_id: 5,
  //           definition: 'Identify members and start onboarding ',
  //           target: 'complete onboarding',
  //           start_date: '2020-06-01',
  //           end_date: '2020-09-21',
  //           control_point: 'Monthly',
  //           co_owner: '[5]',
  //           status: 4,
  //           initiatives_id: 1,
  //           user_id: 2,
  //           co_owner_name: null,
  //           percentage: '90',
  //           status_name: 'Yellow',
  //           reminder_date: '21',
  //           kpis: []
  //         },
  //         {
  //           sr_no: '1.1.3',
  //           action_plans_id: 23,
  //           definition: 'action plan test2020',
  //           target: '23',
  //           start_date: '2020-06-01',
  //           end_date: '2020-09-16',
  //           control_point: 'Monthly',
  //           co_owner: '[2,3,6]',
  //           status: 4,
  //           initiatives_id: 1,
  //           user_id: 2,
  //           co_owner_name: null,
  //           percentage: '95',
  //           status_name: 'Yellow',
  //           reminder_date: '01',
  //           kpis: [
  //             {
  //               id: 2,
  //               kpi_name: 'it & business process.',
  //               unit_id: 1,
  //               department_id: 1,
  //               ideal_trend: 'negative',
  //               kpi_type: '',
  //               unit_of_measurement: 13,
  //               target_range_min: 0,
  //               target_range_max: '',
  //               kpi_definition: 'software kpi.',
  //               user_id: 2,
  //               deleted_at: null,
  //               created_at: '2020-12-30 15:51:16',
  //               updated_at: '2021-01-13 12:14:39',
  //               section_id: 6,
  //               lead_kpi: 1,
  //               frequency: 'Quarterly',
  //               kpi_performance: '1',
  //               s_o_id: '29',
  //               initiatives_id: '16',
  //               performance_dash: 1,
  //               target_condition: 'average',
  //               start_date: '2020-01-01',
  //               end_date: '2021-03-31'
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       sr_no: '1.2',
  //       initiatives_id: 5,
  //       definition:
  //         'Plan for various modules in the Business Plan software Prima Plus',
  //       s_o_id: 1,
  //       description:
  //         'Prepare  new Business Planning and Strategy Mapping software for Engineering Industries',
  //       dept_id: 1,
  //       dept_name: 'IT & Business Process',
  //       section_id: 6,
  //       section_name: 'Software Management',
  //       user_id: 2,
  //       start_date: '2020-12-01',
  //       end_date: '2021-02-28',
  //       percentage: '0',
  //       status_name: 'Green',
  //       action_plans: []
  //     },
  //     {
  //       sr_no: '1.3',
  //       initiatives_id: 23,
  //       definition: 'hjj',
  //       s_o_id: 1,
  //       description:
  //         'Prepare  new Business Planning and Strategy Mapping software for Engineering Industries',
  //       dept_id: 1,
  //       dept_name: 'IT & Business Process',
  //       section_id: 1,
  //       section_name: 'Hardware management',
  //       user_id: 2,
  //       start_date: '2021-01-27',
  //       end_date: '2021-01-31',
  //       percentage: '0',
  //       status_name: 'Green',
  //       action_plans: []
  //     },
  //     {
  //       sr_no: '1.4',
  //       initiatives_id: 47,
  //       definition: 'hiiii',
  //       s_o_id: 1,
  //       description:
  //         'Prepare  new Business Planning and Strategy Mapping software for Engineering Industries',
  //       dept_id: 1,
  //       dept_name: 'IT & Business Process',
  //       section_id: 1,
  //       section_name: 'Hardware management',
  //       user_id: 2,
  //       start_date: '2021-03-12',
  //       end_date: '2021-04-01',
  //       percentage: '0',
  //       status_name: 'Gray (Started)',
  //       action_plans: []
  //     }
  //   ]
  // };

  // dataDemo: any = {
  //   name: 'root',
  //   description: 'Production',
  //   id: '101',
  //   datecreated: '2010-10-10',
  //   installid: 'WeShipAnythingProd',
  //   showchildren: '1',
  //   children: []
  // };


  viewSingleStrObje11() {
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

        console.log("kkkk", this.renderStrategicData);

        let dataData =
        {
          "name": "root",
          "children": [

            {
              "id": 28,
              "strategic_objectives_id": 28,
              "target": "Identify & execute for atleast two employees in ME by end 2009.",
              "type": "s",
              "start_date": "2020-01-14",
              "end_date": "2022-01-14",
              "unit_id": 1,
              "unit_name": "ABC New Delhi (indore)",
              "department_id": 1,
              "dept_name": "IT & Business Process",
              "user_id": 1, "user_name": "Super Admin",
              "tracking_frequency": "",
              "definition": "Create a winning ME global culture focused on high performance and high engagement. ",
              "uom_name": "%",
              "status_name": "Yellow",
              "percentage": "90",
              "children": [
                {
                  "sr_no": "28.1",
                  "type": "i",
                  "id": 15,

                  "definition": "Focus on developing next generation of ME leaders across all regions.  Develop and grow benchstrengths.",
                  "s_o_id": 28,
                  "description": "Create a winning ME global culture focused on high performance and high engagement. ",
                  "dept_id": 1,
                  "dept_name": "IT & Business Process",
                  "section_id": 6, "section_name": "Software Management", "user_id": 2, "start_date": "2020-01-16",
                  "end_date": "2022-01-13",
                  "percentage": "90",
                  "status_name": "Yellow",
                  "children": [{
                    "sr_no": "28.1.1", "id": 13,
                    "type": "a",
                    "definition": "Identify and facilitate employees who need a cross-functional & or short term assignments & or ISP assignment in 2008\/09", "target": "Identify & execute for atleast two employees in ME by end 2009.", "start_date": "2020-01-20", "end_date": "2021-08-30", "control_point": "Monthly", "co_owner": "[12]", "status": 5, "initiatives_id": 15, "user_id": 2, "co_owner_name": null, "percentage": "89", "status_name": "Red", "reminder_date": "11",
                    "children": [{
                      "definition": "testtt",
                      "id": 27,
                      "children": []
                    }
                    ]

                  }]
                }, {
                  "sr_no": "28.2",
                  "id": 21,
                  "definition": "r3wrw3r",
                  "s_o_id": 28,
                  "description": "Create a winning ME global culture focused on high performance and high engagement. ",
                  "dept_id": 1,
                  "dept_name": "IT & Business Process",
                  "section_id": 1,
                  "section_name": "Hardware management",
                  "user_id": 20,
                  "start_date": "2021-01-14",
                  "end_date": "2021-01-28",
                  "percentage": "0",
                  "status_name": "Gray (Started)",
                  "children": [{
                    "definition": "testtt",
                    "id": 27,
                    "children": []
                  }]
                }]
            }

          ]
        }
        //console.log("renderr",dataData2);
        for (const c of this.renderStrategicData) {
          const alist = [];
          alist.push(c);
          this.treeLists.push([alist]);
        }

        this.treelistsvc.setCurrentlySelectedTree(this.treeLists[0]);
        this.currentlySelectedTree = this.treelistsvc.currentlySelectedTree;
        this.currentlySelectedTreeId = this.currentlySelectedTree[0][0].id;

      },
      error => {
        this.alertService.error(error);
      });
  }
  differentTreeSelected(t: any) {
    if (this.currentlySelectedTree !== t) {
      this.treelistsvc.setCurrentlySelectedTree(t);
      this.closeSideNav();
      this.sidenav.clearFocusNode(null, null);
    }

  }

  openSideNav() {
    this.myNav.open();
  }

  closeSideNav() {
    this.myNav.close();
  }

}


@Component({
  selector: 'confirmation-dialog',
  templateUrl: 'confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ],
})
export class ConfirmationDialog {
  direction = 'row';
  currentUser: any;
  company_id: number;
  unit_id: any; getStrOjeData: any;
  LoginUserDetails: any;
  userrole: any;
  date = false;
  startDate2: any;
  endDate2: any;
  definition: any;
  description: any;
  currentYearSubscription: Subscription;
  userSelectedYear: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  private _unsubscribeAll: Subject<any>;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    private dataYearService: DataYearService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {

    this.getStrOjeData = this.data;
    this.definition = this.getStrOjeData.definition;
    this.description = this.getStrOjeData.description;
    this.endDate2 = this.getStrOjeData.end_date;
    this.startDate2 = this.getStrOjeData.start_date;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let login_access_token = this.currentUser.login_access_token;
    this.company_id = this.currentUser.data.company_id;
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
    let user_id = this.LoginUserDetails.id;
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
    });
  }
}


@Component({
  selector: 'initiative-details',
  templateUrl: 'initiative-detail.component.html',
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class InitiativeDetail {
  direction = 'row';
  description: any;

  currentUser: any;
  login_access_token: string;
  unit_id: any;
  LoginUserDetails: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  userSelectedYear: any;
  startDate2: any;
  endDate2: any;
  currentYearSubscription: Subscription;
  // linkedKPI:any;
  // Private
  private _unsubscribeAll: Subject<any>;
  getInitData: any;
  currentYear: number;
  company_id: any;
  user_id: any;
  testt = false;
  testini: any;
  constructor(
    public dialogRef: MatDialogRef<InitiativeDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private dataYearService: DataYearService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    this.getInitData = this.data;
    console.log("iniii", this.getInitData);
    this.testini = this.getInitData.definition;
    this.description = this.getInitData.description;
    this.startDate2 = this.getInitData.start_date;
    this.endDate2 = this.getInitData.end_date;
    console.log(this.testini);

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.user_id = this.currentUser.data.id
    this.unit_id = localStorage.getItem('currentUnitId');
    this.company_id = this.currentUser.data.company_id;

    this.currentYear = new Date().getFullYear();


  }

}

@Component({
  selector: 'action-plan-dialog',
  templateUrl: 'action-plan-detail.component.html',
  providers: [
    {
      provide: DateAdapter, useClass: AppDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
  ]
})
export class ActionPlanDetail {
  direction = 'row';
  currentUser: any;
  login_access_token: string;
  unit_id: any;
  LoginUserDetails: any;
  allDetailsCompany: any;
  companyFinancialYear: any;
  userSelectedYear: any;
  startDate2: any;
  endDate2: any;
  definition: any;
  currentYearSubscription: Subscription;
  private _unsubscribeAll: Subject<any>;
  getInitData: any;
  currentYear: number;
  company_id: any;
  user_id: any;
  start_date2: any;
  description: any;
  testt = false;
  constructor(
    public dialogRef: MatDialogRef<ActionPlanDetail>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    private userService: UserService,
    private alertService: AlertService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private dataYearService: DataYearService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  ngOnInit(): void {

    this.getInitData = this.data;
    this.definition = this.getInitData.definition;
    this.start_date2 = this.getInitData.start_date;
    this.endDate2 = this.getInitData.end_date;
    this.description = this.getInitData.description;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.login_access_token = this.currentUser.login_access_token;
    this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.user_id = this.currentUser.data.id
    this.unit_id = localStorage.getItem('currentUnitId');
    this.company_id = this.currentUser.data.company_id;

    // this.departmentGetUnit();
    // this.unitOfMeasurementGet();
    this.currentYear = new Date().getFullYear();

  }
}

// @Component({
//   selector: 'kpi-detail-dialog',
//   templateUrl: 'kpi-detail.component.html',
//   providers: [
//     {
//       provide: DateAdapter, useClass: AppDateAdapter
//     },
//     {
//       provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
//     }
//   ]
// })
// export class KpiDetail {
//   direction = 'row';
//   currentUser: any;
//   login_access_token: string;
//   unit_id: any;
//   LoginUserDetails: any;
//   allDetailsCompany: any;
//   companyFinancialYear: any;
//   userSelectedYear: any;
//   startDate2: any;
//   endDate2: any;
//   definition: any;
//   currentYearSubscription: Subscription;
//   private _unsubscribeAll: Subject<any>;
//   getInitData: any;
//   currentYear: number;
//   company_id: any;
//   user_id: any;
//   start_date2: any;
//   description: any;
//   testt = false;
//   department_id: any;
//   constructor(
//     public dialogRef: MatDialogRef<KpiDetail>,
//     @Inject(MAT_DIALOG_DATA) public data: any,

//     private userService: UserService,
//     private alertService: AlertService,
//     public datepipe: DatePipe,
//     public dialog: MatDialog,
//     private dataYearService: DataYearService
//   ) {
//     // Set the private defaults
//     this._unsubscribeAll = new Subject();
//   }


//   ngOnInit(): void {

//     // this.getInitData = this.data;
//     // this.definition = this.getInitData.definition;
//     // this.department_id = this.getInitData.department_id;
//     // this.endDate2 = this.getInitData.end_date;
//     // this.description = this.getInitData.description;
//     // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
//     // this.login_access_token = this.currentUser.login_access_token;
//     // this.LoginUserDetails = JSON.parse(localStorage.getItem('LoginUserDetails'));
//     // this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
//     // this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
//     // this.user_id = this.currentUser.data.id
//     // this.unit_id = localStorage.getItem('currentUnitId');
//     // this.company_id = this.currentUser.data.company_id;

//     // // this.departmentGetUnit();
//     // // this.unitOfMeasurementGet();
//     // this.currentYear = new Date().getFullYear();

//   }
// }




