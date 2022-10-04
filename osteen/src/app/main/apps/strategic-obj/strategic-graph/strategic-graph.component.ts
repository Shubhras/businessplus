import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatExpansionPanelActionRow } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { AlertService, AuthenticationService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import * as d3v4 from 'd3v4';
//declare let d3: any;
//declare let d3pie: any;
import { legendColor } from 'd3-svg-legend';
import { Chart } from 'angular-highcharts';
import "dhtmlx-gantt";
import { Subscription } from 'rxjs';
import 'dhtmlx-gantt/codebase/ext/dhtmlxgantt_marker.js'
import * as _ from 'lodash';
import * as moment from 'moment';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
@Component({
  selector: 'graph',
  templateUrl: './strategic-graph.component.html',
  styleUrls: ['./strategic-graph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class StrategicGraphComponent implements OnInit {
  isLoading: any
  currentUser: any;
  unit_id: any;
  unit_name: any;
  viewStrategicGraphData: any;
  straObjStatus: any;
  lesentGreen: any;
  lesentYellow: any;
  lesentRed: any;
  activePrintClass: any
  strdata: any[];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild("gantt_here") ganttContainer: ElementRef;
  currentYearSubscription: Subscription;
  userSelectedYear: number;
  allDetailsCompany: any;
  companyFinancialYear: any;
  // public chartType: string = 'doughnut';
  /**
   * Constructor
   *
   *
   */
  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) { }
  /**
   * On init
   */
  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_name = localStorage.getItem('currentUnitName');
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.strObjStatusGet();
    this.activePrintClass = 0;

    // this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
    //   this.userSelectedYear = messageYear;
    //   this.viewStrategicGraph();
    // });
    // this.viewStrategicGraph();
    this.selectedyearservice();

  }

  ngOnDestroy() {
    gantt.clearAll();
  }

  selectedyearservice() {
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewStrategicGraph();
    });
  }


  viewStrategicGraph() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;

    this.userService.strategicGraphView(login_access_token, this.userSelectedYear, this.companyFinancialYear, unit_id, role_id, dept_id).pipe(first()).subscribe(
      (data: any) => {

        this.viewStrategicGraphData = data.data;
        let t_strdata = [];
        let t_inidata = [];
        let t_actiondata = [];


        this.viewStrategicGraphData.data.forEach(str_row => {
          if (str_row.so_id) {
            t_strdata.push(str_row);
          }
          if (str_row.so_init_id) {
            t_inidata.push(str_row);
          }
          if (str_row.action_init_id) {
            t_actiondata.push(str_row);
          }
        });

        // let scount = 0;
        // this.viewStrategicGraphData.data.forEach(srow => {
        //   if (srow.so_id) {
        //     scount = scount + 1;
        //     let icount = 0;

        //     t_inidata.forEach(initrow => {
        //       if (initrow.so_init_id == srow.so_id) {
        //         icount = icount + 1;
        //         initrow.text = scount + '.' + icount + '.' + initrow.text;

        //         let acount = 0;

        //         t_actiondata.forEach(actionrow => {
        //           if (actionrow.action_init_id == initrow.init_id) {
        //             acount = acount + 1;
        //             actionrow.text = scount + '.' + icount + '.' + acount + '.' + actionrow.text;
        //             //  console.log('actionrow',actionrow);  
        //           }
        //         });
        //       }
        //     });
        //   }
        // });

        this.strategicGraph();
      },
      error => {
        this.alertService.error(error);
      });
  }
  openCloseTasks(event) {
    this.loaderService.show();
    let tasks = this.viewStrategicGraphData.data;
    setTimeout(() => {
      tasks.forEach(task => {
        if (event == 2) {  // open all task
          gantt.open(task.id);
        }
        else if (event == 0) { // close all task
          gantt.close(task.id);
        }
        else {
          let testVlaue = String(task.id).split(".");
          if (testVlaue.length == event) { // open one level all task
            gantt.open(task.id);
          }
          else {
            gantt.close(task.id);
          }
        }
      });
      this.loaderService.hide();
    }, 30);
  }
  strategicGraph() {
    gantt.config.columns = [
      { name: "text", label: "Name", tree: true, width: "270" },
      { name: "start_date", label: "start_date", width: "60" },
      { name: "end_date", label: "end_date", width: "60" }
    ];
    gantt.config.date_grid = "%d-%m-%Y";
    gantt.config.scale_unit = "year";
    gantt.config.date_scale = "%Y";
    gantt.config.details_on_create = true;
    gantt.config.details_on_dblclick = true;
    gantt.config.drag_move = false;
    gantt.config.drag_progress = false;
    gantt.config.min_column_width = 23;
    gantt.config.row_height = 38;
    gantt.config.scale_height = 50;
    //gantt.config.scroll_on_click= false;
    //gantt.config.show_markers = true;
    gantt.addMarker({
      css: 'today-marker',
      id: 'today',
      //text: "today",
      start_date: new Date(),
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
              var status_name: any = '<img class="status-red-icon" src="assets/icons/status-red-icon.png" style="margin-top: 5px;">';
              return status_name;
            }
            else if (status_name.status_name == "Yellow") {
              var status_name: any = '<img class="status-yellow-icon" src="assets/icons/status-yellow-icon.png" style="margin-top: 5px;">';
              return status_name;
            }
            else if (status_name.status_name == "Green") {
              var status_name: any = '<img class="status-green-icon" src="assets/icons/status-green-icon.png" style="margin-top: 5px;">';
              return status_name;
            }
            else if (status_name.status_name == "Gray (Started)") {
              var status_name: any = '<img class="status-gray-icon" src="assets/icons/status-gray-icon.png" style="margin-top: 5px;">';
              return status_name;
            }
            else if (status_name.status_name == "Blue (Hold)") {
              var status_name: any = '<img class="status-blue-icon" src="assets/icons/status-blue-icon.png" style="margin-top: 5px;">';
              return status_name;
            }
          }
        }
      ]
    };

    console.log('secondGridColumns',secondGridColumns);
    
    gantt.attachEvent("onMouseMove", function (id, e) {
      // console.log('lll');
    });
    // popup button
    gantt.attachEvent("onGanttReady", function () {
      // console.log('kkkkk');

      gantt.config.buttons_left = ["gantt_save_btn"];
      gantt.config.buttons_right = ["gantt_cancel_btn"];
    });
    let myEvent;
    //when click tree button  than hide popup
    gantt.attachEvent("onTaskClick", function (id, e) {
      //any custom logic here
      // console.log('ssssss');

      if (myEvent) {
        gantt.detachEvent(myEvent);
      }
      if (e.target.className === 'gantt_tree_icon gantt_close' || e.target.className === 'gantt_tree_icon gantt_open') {
        myEvent = gantt.attachEvent("onBeforeLightbox", function (id) {
          return false;
        });
      }
      return true;
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
    gantt.init(this.ganttContainer.nativeElement);
    console.log('this.viewStrategicGraphData',this.ganttContainer);
    
    gantt.parse(this.viewStrategicGraphData);
  }
  strObjStatusGet() {
    let login_access_token = this.currentUser.login_access_token;
    this.userService.getStrObjStatus(login_access_token).pipe(first()).subscribe((data: any) => {
      this.straObjStatus = data.data.str_obj_statuses;
      this.lesentGreen = this.straObjStatus[2].accuracy_percentage;
      this.lesentYellow = this.straObjStatus[3].accuracy_percentage;
      this.lesentRed = this.straObjStatus[4].accuracy_percentage;
    },
      error => {
        this.alertService.error(error);
      });
  }
  strObjeGraphPDF() {
    this.activePrintClass = 1;
    this.loaderService.show();
    let tasks = this.viewStrategicGraphData.data;
    setTimeout(() => {
      tasks.forEach(task => {
        gantt.open(task.id);
      });
      const data = document.getElementById('strategic-graph');
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
        pdf.save('strObjGraph.pdf');
        this.loaderService.hide();
      });
      this.activePrintClass = 0;
    }, 50);
  }
}

