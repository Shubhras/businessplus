/* import { Component, ElementRef, OnInit, ViewEncapsulation, ViewChild } from '@angular/core'; */
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, EventEmitter, HostListener, Output } from '@angular/core';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
declare let d3pie: any;
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DayPilot, DayPilotGanttComponent } from "daypilot-pro-angular";
@Component({
    selector: 'project-dashboard',
    templateUrl: './project-dashboard.html',
    styleUrls: ['./project-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProjectDashboard implements OnInit {
    displayedColumnsBudget: string[] = ['sr_no', 'dept_name', 'allocation_dstrbt_vl'];
    displayedColumsMilestone: string[] = ['sr_no', 'milestone_name', 'symbol', 'mile_stone_date', 'actual_date', 'milestone_status', 'comments'];
    dataSourceMileStone: any;
    displayedColumnsDeliverable: string[] = ['position', 'dept_name', 'total', 'green', 'yellow', 'red'];
    dataSourceDeliverable: any;
    displayedColumnsIssuePriority: string[] = ['name_priority', 'total', 'green', 'yellow', 'red', 'gray', 'blue'];
    dataSourceIssuePriority: any;
    userModulePermission: any;
    proFilesPermission: any;
    currentUser: any;
    sub: any;
    project_id: any;
    project_name: any;
    company_id: any;
    unit_id: string;
    dummyPicture: string;
    proAllDetails: any = {};
    proCompanyUser: any;
    proExternalUser: any;
    proMilestone: any;
    givenDate: any;
    proGoverances: any;
    currentDate: any;
    nameOfLeader: any;
    nameOfCoLeader: any;
    //coChairPerson: any;
    projectDuration: string;
    @ViewChild('pieChartObj') pieChartObj: ElementRef;
    // @ViewChild('pieChartAction') pieChartAction: ElementRef;
    @ViewChild('pieChartIssueStatus') pieChartIssueStatus: ElementRef;
    //dataChart: { name: string; marker: { symbol: string; }; data: (number | { marker: { symbol: string; }; })[]; }[];
    viewDeliverableData: any;
    @Output() mainDashToMileClickEvent = new EventEmitter<number>();
    @Output() mainDashToDeviationsClickEvent = new EventEmitter<number>();
    @Output() mainDashToIssuesClickEvent = new EventEmitter<number>();
    @ViewChild('gantt') gantt: DayPilotGanttComponent;
    config: any;
    constructor(
        private route: ActivatedRoute,
        //private router: RouterModule,
        private router: Router,
        public dialog: MatDialog,
        private userService: UserService,
        private alertService: AlertService,
        private datepipe: DatePipe,
        private loaderService: LoaderService,
    ) { }

    ngOnInit(): void {
        this.userModulePermission = JSON.parse(localStorage.getItem('userModulePermission'));
        for (let i = 0; i < this.userModulePermission.length; i++) {
            if (this.userModulePermission[i].module_name == "Projects") {
                this.proFilesPermission = this.userModulePermission[i];
            }
        }
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.sub = this.route.params.subscribe(params => {
            this.project_id = +params['id'];
            this.singleViewProjects();
            this.viewProDashboardData();
        });
        let login_access_token = this.currentUser.login_access_token;
        this.company_id = this.currentUser.data.company_id;
        this.unit_id = localStorage.getItem('currentUnitId');
        this.dummyPicture = "assets/images/avatars/profile.jpg";
        this.config = {
            cellWidthSpec: "Fixed",
            cellWidth: 20,
            startDate: "2020-10-01",
            //days: new DayPilot.Date("2021-12-01").daysInMonth(),
            days: new DayPilot.Date("2021-12-01").daysInYear(),
            // startDate: new DayPilot.Date("2021-12-01").firstDayOfYear(),
            //cellWidthSpec: "Auto",
            taskHeight: 30,
            height: 300,
            rowMoveHandling: "Disabled",
            rowCreateHandling: "Disabled",
            linkCreateHandling: "Disabled",
            columns: [
                { title: "Name", width: 50, property: "text" }
            ],
            tasks: [
                { "id": 1, "start": "2020-10-04", "type": "Milestone", "text": "Milestone 1", "end": "2020-10-04" },
                {
                    "id": 2, "text": "Activity 1", "complete": 35,
                    "children": [
                        { "id": 2.3, "start": "2020-10-04", "end": "2020-10-11", "text": "Sub Activity 1", "complete": 60 },
                        { "id": 2.4, "start": "2020-10-11", "end": "2020-10-20", "text": "Sub Activity 2", "complete": 0 },
                    ],
                    "start": "2020-10-04",
                    "end": "2020-10-16"
                },
                {
                    "id": 3, "text": "Activity 2", "complete": 35, "start": "2020-10-04",
                    "end": "2020-10-30"
                }
            ],
            links: [
                { "from": 1, "to": 2, "type": "FinishToStart" },
                { "from": 1, "to": 3, "type": "FinishToStart" },
            ]
        };
    }

    mainDashToMile() {
        this.mainDashToMileClickEvent.emit();
    }
    mainDashToDeviations() {
        this.mainDashToDeviationsClickEvent.emit();
    }
    mainDashToIssues() {
        this.mainDashToIssuesClickEvent.emit();
    }
    singleViewProjects() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let project_id = this.project_id;
        this.currentDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        this.userService.singleProjectsView(login_access_token, unit_id, project_id).pipe(first()).subscribe(
            (data: any) => {
                //let proStartDate = data.data.projectData[0].start_date
                //this.IssueStatusChart();
                this.proAllDetails = data.data.projectData[0];
                this.project_name = this.proAllDetails.project_name;
                this.proCompanyUser = data.data.project_member_data;
                for (let i = 0; i < data.data.project_member_data.length; i++) {
                    if (this.proCompanyUser[i].project_leader == 1) {
                        this.nameOfLeader = this.proCompanyUser[i].name;
                    }
                    else if (this.proCompanyUser[i].project_leader == 2) {
                        this.nameOfCoLeader = this.proCompanyUser[i].name;
                    }
                }
                this.proMilestone = data.data.project_milestone_data;
                this.proMilestone.map((stone: any, index: number) => {
                    stone.sr_no = index + 1;
                });
                this.proMilestone.forEach(proMileStoneData => {
                    proMileStoneData.mile_stone_date = moment(proMileStoneData.mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');

                });
                // this.givenDate = moment(this.proMilestone[0].mile_stone_date, "DD-MM-YYYY").format('YYYY-MM-DD');
                let end = new Date(this.proAllDetails.end_date);
                this.calcDateDuration(this.currentDate, end)
                /* this.proMilestone.map((stone: any) => {
                    if (this.givenDate > this.currentDate) {
                        stone.status = 'green';
                        stone.cmnt = 'Good'
                    }
                    else if (this.givenDate == this.currentDate) {
                        stone.status = 'orange';
                        stone.cmnt = 'Ok'
                    }
                    else if (this.givenDate < this.currentDate) {
                        stone.status = 'red';
                        stone.cmnt = 'Worst'
                    }
                }) */
                this.dataSourceMileStone = new MatTableDataSource<PeriodicElementMileStone>(this.proMilestone);
                this.proGoverances = data.data.project_goverances;
                /* this.coChairPerson = this.proGoverances[0].co_chair_person_name ? this.proGoverances[0].co_chair_person_name : ''; */

                //Current Mile Stone and Next Mile Stone
                /* var array = [
                    { title: "a", mile_stone_date: "30-07-2020" },
                    { title: "b", mile_stone_date: "26-10-2020" },
                    { title: "c", mile_stone_date: "18-10-2020	" },
                  ]
                let currentMonth = new Date().getMonth() + 1;
                let currentMileStone = array.filter(e => {
                    var [_, month] = e.mile_stone_date.split('-'); // Or, var month = e.date.split('-')[1];
                    return currentMonth === +month;
                });
                console.log('DADHAGSJ', currentMileStone); */

            },
            error => {
                this.alertService.error(error);
            });
    }

    calcDateDuration(start, end) {
        // console.log('d1', start, "d2", end);
        let start_date = start.split('-');
        var end_date = end;
        var year = end_date.getFullYear();
        var month = end_date.getMonth() + 1;
        var day = end_date.getDate();
        var yy = parseInt(start_date[0]);
        var mm = parseInt(start_date[1]);
        var dd = parseInt(start_date[2]);
        var years, months, days;
        // months
        months = month - mm;
        if (day < dd) {
            months = months - 1;
        }
        // years
        years = year - yy;
        if (month * 100 + day < mm * 100 + dd) {
            years = years - 1;
            months = months + 12;
        }
        // days
        days = Math.floor((end_date.getTime() - (new Date(yy + years, mm + months - 1, dd)).getTime()) / (24 * 60 * 60 * 1000));
        this.projectDuration = years + ' ' + 'Year' + ' ' + months + ' ' + 'Month' + ' ' + days + ' ' + 'Days';
        //return { years: years, months: months, days: days };
    }
    viewProDashboardData() {
        let login_access_token = this.currentUser.login_access_token;
        let unit_id = this.unit_id;
        let company_id = this.currentUser.data.company_id;
        let project_id = this.project_id;
        let user_id = '';
        this.userService.allProDashboardData(company_id, login_access_token, unit_id, project_id, user_id).pipe(first()).subscribe((data: any) => {
            //for Project Deliverable data
            this.viewDeliverableData = data.data.projectDeliverable;
            this.viewDeliverableData.map((kpi: any, index: number) => {
                kpi.sr_no = index + 1;
            });
            const ELEMENT_DATA: PeriodicElementDeliverable[] = this.viewDeliverableData;
            this.dataSourceDeliverable = new MatTableDataSource<PeriodicElementDeliverable>(ELEMENT_DATA);
            const KpiTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.total, 0);
            const greenTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Green, 0);
            const redTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Red, 0);
            const yellowTotal = this.viewDeliverableData.reduce((sum, item) => sum + item.Yellow, 0);
            this.prepareDataForCharts(KpiTotal, greenTotal, yellowTotal, redTotal);
            //for Project Issues data
            let getAllDataGraph = data.data.issueRemarkGraph;
            this.prepareDataForPieChartIssue(getAllDataGraph);
            this.preparePriorityData(getAllDataGraph);
        },
            error => {
                this.alertService.error(error);
            });
    }
    prepareDataForCharts(KpiTotal, greenTotal, yellowTotal, redTotal) {
        const totalStr = KpiTotal;
        const graphDataStr = [
            {
                "label": (greenTotal * 100 / totalStr).toFixed(1) + '%',
                "value": greenTotal,
                "color": "#4caf50"
            }, {
                "label": (yellowTotal * 100 / totalStr).toFixed(1) + '%',
                "value": yellowTotal,
                "color": "#FFD933"
            }, {
                "label": (redTotal * 100 / totalStr).toFixed(1) + '%',
                "value": redTotal,
                "color": "#f44336"
            }
        ];
        this.fucnPieChart("pieChartObj", graphDataStr, totalStr);
    }
    /*     IssueStatusChart() {
            let company_id = this.currentUser.data.company_id;
            let login_access_token = this.currentUser.login_access_token;
            let unit_id = this.unit_id;
            let project_id = this.project_id;
            // let project_start_date = proStartDate;
            let user_id = '';
            this.userService.allProDashboardData(company_id, login_access_token, unit_id, project_id, user_id).pipe(first()).subscribe(
                (data: any) => {
                      let getAllDataGraph = data.data.issueRemarkGraph;
                      this.prepareDataForPieChartIssue(getAllDataGraph);
                      this.preparePriorityData(getAllDataGraph);
                },
                error => {
                    this.alertService.error(error);
                });
        } */
    preparePriorityData(getAllDataGraph) {
        const ELEMENT_DATA: PeriodicElementIssuePriority[] = [];
        const highData = {
            "name_priority": 'High',
            "total": getAllDataGraph.high.phtotal,
            "green": getAllDataGraph.high.phclosed,
            "yellow": getAllDataGraph.high.phopen,
            "red": getAllDataGraph.high.phdelayed,
            "gray": getAllDataGraph.high.phcwd,
            "blue": getAllDataGraph.high.phhold
        }
        const mediumData = {
            "name_priority": 'Medium',
            "total": getAllDataGraph.medium.pmtotal,
            "green": getAllDataGraph.medium.pmclosed,
            "yellow": getAllDataGraph.medium.pmopen,
            "red": getAllDataGraph.medium.pmdelayed,
            "gray": getAllDataGraph.medium.pmcwd,
            "blue": getAllDataGraph.medium.pmhold
        }
        const lowData = {
            "name_priority": 'Low',
            "total": getAllDataGraph.low.pltotal,
            "green": getAllDataGraph.low.plclosed,
            "yellow": getAllDataGraph.low.plopen,
            "red": getAllDataGraph.low.pldelayed,
            "gray": getAllDataGraph.low.plcwd,
            "blue": getAllDataGraph.low.plhold
        }
        ELEMENT_DATA.push(highData);
        ELEMENT_DATA.push(mediumData);
        ELEMENT_DATA.push(lowData);
        this.dataSourceIssuePriority = new MatTableDataSource<PeriodicElementIssuePriority>(ELEMENT_DATA);
    }
    prepareDataForPieChartIssue(totalTaskData: any) {
        const totalTask = (totalTaskData.total_issue).slice(-1)[0];
        const closedTask = (totalTaskData.Closed).slice(-1)[0];
        const delayedTask = (totalTaskData.Delayed).slice(-1)[0];
        const closedWithDelayTask = (totalTaskData.Closed_With_Delay).slice(-1)[0];
        const onHoldTask = (totalTaskData.On_Hold).slice(-1)[0];
        const openTask = (totalTaskData.Open).slice(-1)[0];
        const graphDataTASK = [
            {
                "label": (closedTask * 100 / totalTask).toFixed(1) + '%',
                "value": closedTask,
                "color": "#4caf50"
            }, {
                "label": (openTask * 100 / totalTask).toFixed(1) + '%',
                "value": openTask,
                "color": "#FFD933"
            }, {
                "label": (delayedTask * 100 / totalTask).toFixed(1) + '%',
                "value": delayedTask,
                "color": "#ef5350"
            }, {
                "label": (closedWithDelayTask * 100 / totalTask).toFixed(1) + '%',
                "value": closedWithDelayTask,
                "color": "#a9b7b6"
            }, {
                "label": (onHoldTask * 100 / totalTask).toFixed(1) + '%',
                "value": onHoldTask,
                "color": "#039cfd"
            }
        ];
        this.fucnPieChart("pieChartIssueStatus", graphDataTASK, totalTask);
    }
    fucnPieChart(element: string, data: Array<any>, totalText: any) {
        this[element].nativeElement.innerHTML = '';
        let pie = new d3pie(element, {
            "header": {
                "title": {
                    "text": totalText,
                    "fontSize": 24,
                    //"font": "courier",
                    "fontWeight": 600
                },
                "location": "pie-center",
                "titleSubtitlePadding": 10
            },
            "footer": {
                "color": "#999999",
                "fontSize": 10,
                "font": "open sans",
                "location": "bottom-left"
            },
            "size": {
                "canvasHeight": 220,
                "canvasWidth": 265,
                "pieInnerRadius": "50%",
                "pieOuterRadius": "80%"
            },
            "data": {
                "sortOrder": "value-desc",
                "content": data
            },
            "labels": {
                "outer": {
                    "pieDistance": 5
                },
                "inner": {
                    "format": "value",
                    "hideWhenLessThanPercentage": 2
                },
                "mainLabel": {
                    "fontSize": 12
                },
                "percentage": {
                    "color": "#ffffff",
                    "decimalPlaces": 1
                },
                "value": {
                    "color": "#333333",
                    "fontSize": 12
                },
                "lines": {
                    "enabled": true
                },
                "truncation": {
                    "enabled": true
                }
            },
            "tooltips": {
                "enabled": true,
                "type": "placeholder",
                // "string": "{label}: {value},{percentage}%"
                "string": "{percentage}%"
            },
            "effects": {
                "pullOutSegmentOnClick": {
                    "effect": "linear",
                    "speed": 400,
                    "size": 8
                }
            }/*,
              "misc": {
                "gradient": {
                  "enabled": true,
                  "percentage": 100
                }
              }*/
        });
    }
    projectDashboardPDF() {
        this.loaderService.show();
        setTimeout(() => {
            var data = document.getElementById('project-dashboard');
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
                pdf.save('project-dashboard.pdf');
                this.loaderService.hide();
            });
        }, 50);
    }
}

export interface PeriodicElementMileStone {
    sr_no: any;
    milestone_name: string;
    mile_stone_date: string;
    actual_date: string;
    milestone_status: any;
    symbol: string;
    comments: string;
    // Status: string;
}
export interface PeriodicElementDeliverable {
    sr_no?: number;
    position: number;
    dept_name: string;
    total: number;
    green: number;
    yellow: number;
    red: number;
    //gray: number;
}
export interface PeriodicElementIssuePriority {
    name_priority: string;
    green: string;
    yellow: string;
    red: string;
    gray: string;
    blue: string;
    total: string;
}