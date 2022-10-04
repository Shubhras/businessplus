import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import "dhtmlx-gantt";
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js'
import * as _ from 'lodash';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectDetailPopupComponent } from '../majar-activity/majar-activity-popup/project-detail-popup.component';
import { MatDialog } from '@angular/material';
import { SubActivityProjectComponent } from '../project-sub-activity/sub-activity-popup/sub-activity-popup';
import { MilestoneAddComponent } from '../project-milestone/milestone-add/milestone-add.component';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'pro-gantt-chart',
  styleUrls: ['./pro-gantt-chart.component.scss'],
  templateUrl: './pro-gantt-chart.component.html',
})

export class ProjectGanttChartComponent implements OnInit {
  @ViewChild("project_gantt_here") projectGanttContainer: ElementRef;
  sub: any;
  currentUser: any;
  unit_id: any;
  project_id: any;
  getAllDataGraph: any;
  getAllDataGraph2: any;
  taskCreateEvent: any;
  taskClickEvent: any;
  myEvent: any;
  popupButtonHide: any;
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private userService: UserService,
    private alertService: AlertService,
    public dialog: MatDialog,
  ) {

  }
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sub = this.route.params.subscribe(params => {
      this.project_id = +params['id'] // (+) converts string 'id' to a number
      this.proGanttChartData();
      //this.viewsingleproject();
    });
    //gantt = Gantt.getGanttInstance();
  }
  ngOnDestroy() {
    gantt.clearAll();
    this.clearAllAttachEvent();
  }
  clearAllAttachEvent() {
    gantt.detachEvent(this.taskCreateEvent);
    gantt.detachEvent(this.taskClickEvent);
    gantt.detachEvent(this.myEvent);
    gantt.detachEvent(this.popupButtonHide);
  }
  openDialogMilestone() {
    const dialogref = this.dialog.open(MilestoneAddComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.clearAllAttachEvent();
        this.proGanttChartData();
        //this.viewsingleproject();
      }
    });
  }
  openDialogActivity() {
    const dialogref = this.dialog.open(ProjectDetailPopupComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.clearAllAttachEvent();
        this.proGanttChartData();
        //this.viewsingleproject();

      }
    });
  }
  openDialogSubActivity() {
    const dialogref = this.dialog.open(SubActivityProjectComponent, {
      width: 'auto',
      data: this.project_id
    });
    dialogref.afterClosed().subscribe(result => {
      if (result == "YesSubmit") {
        this.clearAllAttachEvent();
        this.proGanttChartData();
        //this.viewsingleproject();
      }
    });
  }
  openCloseTasks(event) {
    this.loaderService.show();
    let tasks = this.getAllDataGraph.data;
    setTimeout(() => {
      tasks.forEach(task => {
        if (event == 1) {  // open all task
          gantt.open(task.id);
        }
        else {
          gantt.close(task.id);
        }
      });
      this.loaderService.hide();
    }, 30);
  }
  proGanttChartData() {
    let company_id = this.currentUser.data.company_id;
    let login_access_token = this.currentUser.login_access_token;
    this.unit_id = localStorage.getItem('currentUnitId');
    let project_id = this.project_id;
    this.userService.projectChartView(login_access_token, project_id).pipe(first()).subscribe(
      (data: any) => {
        this.getAllDataGraph = data.data;
        console.log("char data", this.getAllDataGraph);

        this.prepareProGanttChartData();
      },
      error => {
        this.alertService.error(error);
      });
  }
  // viewsingleproject() {
  //   let company_id = this.currentUser.data.company_id;
  //   let login_access_token = this.currentUser.login_access_token;
  //   this.unit_id = localStorage.getItem('currentUnitId');
  //   let project_id = this.project_id;
  //   this.userService.singleProjectsView(login_access_token, this.unit_id, project_id).pipe(first()).subscribe(
  //     (data: any) => {
  //       this.getAllDataGraph2 = data.data.project_majr_activity_data[0];
  //       console.log("char data", this.getAllDataGraph2);

  //       this.prepareProGanttChartData();
  //     },
  //     error => {
  //       this.alertService.error(error);
  //     });
  // }
  prepareProGanttChartData() {
    gantt.config.columns = [
      {
        name: "text", label: "Name", tree: true, width: "100",
      },
      { name: "start_date", label: "Start Date", align: "center", width: 75 },
      { name: "end_date", label: "end_date", align: "center", width: 75 },
      { name: "responsibility", label: "responsibile_person", width: 100 },

      { name: "add", width: 20 }
    ];
    gantt.config.date_grid = "%d-%m-%Y";
    gantt.config.scale_unit = "year";
    gantt.config.date_scale = "%Y";
    gantt.config.details_on_create = true;
    gantt.config.details_on_dblclick = true;
    gantt.config.drag_move = false;
    gantt.config.drag_progress = false;
    gantt.config.min_column_width = 5;
    gantt.config.row_height = 38;
    gantt.config.scale_height = 50;
    //gantt.config.scroll_on_click= false;
    //gantt.config.show_markers = true;
    let sD = this.getAllDataGraph.projectData[0].start_date; //YYYY-MM-DD

    console.log("ed", sD);
    // let rP = this.getAllDataGraph2.responsibility_person;
    // console.log("rp", rP);
    let eD = this.getAllDataGraph.projectData[0].end_date; //YYYY-MM-DD
    console.log("ed", eD);

    gantt.config.start_date = new Date(sD);
    gantt.config.end_date = new Date(eD);
    // gantt.config.responsibility_person =
    //gantt.config.autoscroll = false;
    /*  gantt.config.autosize = "x";
      gantt.config.autosize_min_width = 1200;
       gantt.config.autoscroll = true; */
    /*gantt.config.autoscroll_speed = 50; */

    gantt.templates.rightside_text = function (start, end, task) {
      if (task.type == "milestone") {
        // return '<div style="width:15px;height:15px !important;background:#6497b1;;transform: rotate(45deg); margin-top: 8px;position: relative;right: 10px;"></div>';
        return '<div style="margin-top: 6px;position: relative;right: 10px;"><mat-icon class="mat-icon material-icons">' + task.symbol + '</mat-icon></div>';
      }
      return '';
    };
    gantt.addMarker({
      css: 'today-marker',
      id: 'today',
      //text: "today",
      start_date: new Date(),
      // end_date: new Date(),
    });
    // set Q1 Q2 Q3 Q4
    function quaterScale(q) {
      let month = moment(q, 'YYYY-MM-DD').format('MM');
      if (month == "01") {
        let Q = "Q1";
        return Q;
      }
      else if (month == "04") {
        let Q = "Q2";
        return Q;
      }
      else if (month == "07") {
        let Q = "Q3";
        return Q;
      }
      else {
        let Q = "Q4";
        return Q;
      }
    }
    //gantt.config.open_tree_initially = true; //open all task
    gantt.config.subscales = [
      { unit: "quarter", step: 1, template: quaterScale },
      { unit: "month", step: 1, date: "%M" }
    ];
    var secondGridColumns = {
      columns: [
        {
          name: "status_name", label: "Status", width: 37, align: "center",
          template: function (status_name) {
            if (status_name.status_name == "Red") {
              return '<img class="status-red-icon" src="assets/icons/status-red-icon.png" style="margin-top: 5px;">';;
            }
            else if (status_name.status_name == "Yellow") {
              return '<img class="status-yellow-icon" src="assets/icons/status-yellow-icon.png" style="margin-top: 5px;">';;
            }
            else if (status_name.status_name == "Green") {
              return '<img class="status-green-icon" src="assets/icons/status-green-icon.png" style="margin-top: 5px;">';;
            }
            return '';
          }
        }
      ]
    };
    // popup button
    this.popupButtonHide = gantt.attachEvent("onGanttReady", function () {
      gantt.config.buttons_left = ["gantt_save_btn"];
      gantt.config.buttons_right = ["gantt_cancel_btn"];
    });
    //let myEvent;
    //when click tree button  than hide popup
    this.taskClickEvent = gantt.attachEvent("onTaskClick", (id, e) => {
      //any custom logic here
      if (this.myEvent) {
        gantt.detachEvent(this.myEvent);
      }
      //when click tree button and add button than hide popup
      if (e.target.className === 'gantt_tree_icon gantt_close' || e.target.className === 'gantt_tree_icon gantt_open' || e.target.className === 'gantt_add') {
        this.myEvent = gantt.attachEvent("onBeforeLightbox", (id) => {
          let taskObj = gantt.getTask(id);
          if (taskObj.type == "milestone" && e.target.className === 'gantt_add') {
            this.openDialogActivity();
          }
          else if (taskObj.type == "activity" && e.target.className === 'gantt_add') {
            this.openDialogSubActivity();
          }
          else if (taskObj.type == "subactivity" && e.target.className === 'gantt_add') {
            // alert('subactivity');
          }
          return false;
        });
      }
      return true;
    });
    this.taskCreateEvent = gantt.attachEvent("onTaskCreated", (e) => {
      console.log('onTaskCreated', e);
      //when add button than hide popup
      if (e.parent) {
        return false;
      } else {
        this.openDialogMilestone();
        return false;
      }
      // return true;
    });
    gantt.config.layout = {
      css: "gantt_container",
      rows: [
        {
          cols: [
            { view: "grid", id: "grid", width: 32, scrollY: "scrollVer" },
            { resizer: true, width: 1 },
            { view: "timeline", id: "timeline", scrollX: "scrollHor", scrollY: "scrollVer" },
            { resizer: true, width: 1 },
            {
              view: "grid", width: 37, bind: "task",
              scrollY: "scrollVer", config: secondGridColumns
            },
            { view: "scrollbar", scroll: "y", id: "scrollVer" }
          ]
        },
        { view: "scrollbar", id: "scrollHor", height: 20 }
      ]
    };
    gantt.init(this.projectGanttContainer.nativeElement);
    gantt.parse(this.getAllDataGraph);
  }
  proGanttChartPDF() {
    // this.activePrintClass = 1;
    this.loaderService.show();
    let tasks = this.getAllDataGraph.data;
    setTimeout(() => {
      tasks.forEach(task => {
        gantt.open(task.id);
      });
      const data = document.getElementById('project-gantt-chart-view');
      html2canvas(data).then(canvas => {
        var imgWidth = 210;
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
        pdf.save('project_gantt_chart.pdf');
        this.loaderService.hide();
      });
      // this.activePrintClass = 0;
    }, 50);
  }
}