import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';;
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
//import * as XLSX from 'xlsx';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
//import * as d3v4 from 'd3v4';
declare let d3: any;
declare let d3pie: any;
//import { legendColor } from 'd3-svg-legend';
//import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { AlertService, UserService } from 'app/main/apps/_services';
import { LoaderService } from 'app/main/apps/loader/loader.service';
import { DataYearService } from 'app/layout/components/toolbar/year-select-data.service';
export interface DialogData {
  animal: string;
  name: string;
}
@Component({
  selector: 'kpidashboard',
  templateUrl: './kpidashboard.component.html',
  styleUrls: ['./kpidashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class KpitrackerDashboardComponent implements OnInit {
  unit_name: any;
  unit_id: any;
  currentUser: any;
  userDepartment: any;
  dataDepartment: any;
  viewKpiDashboard: any;
  viewLeadKpiDashboard: any;
  depDataBarChart: Array<any>;
  messageError: any;
  displayedColumns: string[] = ['position', 'dept_name', 'total_kpi', 'green', 'yellow', 'red', 'gray'];
  dataSource: any;
  displayedColumnsLesent: string[] = ['lesent_name', 'lesent_description'];
  dataSourceLesent = new MatTableDataSource<PeriodicElementLesent>(ELEMENT_DATA_LESENT);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  @ViewChild('content') content: ElementRef;
  @ViewChild('pieChartKPI') pieChartKPI: ElementRef;
  @ViewChild('pieChartLeadKPI') pieChartLeadKPI: ElementRef;
  companyFinancialYear: any;
  allDetailsCompany: any;
  userSelectedYear: any;
  currentYearSubscription: Subscription;
  login_access_token: any;
  total_objectives: any;
  /**
   * Constructor
   *
   *
   */
  constructor(
    // private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private dataYearService: DataYearService
  ) {
  }
  /**
   * On init
   */
  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.unit_name = localStorage.getItem('currentUnitName');
    this.unit_id = localStorage.getItem('currentUnitId');
    this.allDetailsCompany = JSON.parse(localStorage.getItem('allDetailsCompany'));
    this.login_access_token = this.currentUser.login_access_token;
    this.companyFinancialYear = this.allDetailsCompany.general_data[0].financial_year;
    this.getDepartment();
    this.currentYearSubscription = this.dataYearService.currentMessageYear.subscribe(messageYear => {
      this.userSelectedYear = messageYear;
      this.viewKpiDashboardData();
      this.viewLeadKpiDashboardData();
    });
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    // 112
    // this.currentUser.dept_id
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
  
    // this.userService.strategicDashboardView( this.login_access_token, this.unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
    //   (data: any) => {
    //    this.total_objectives = data.data;
    //    console.log("thisss", this.total_objectives);
    //    if(this.total_objectives.action_plans.total == 0){
    //      this.openWelcomeDialog();
    //     console.log("Action Plans");
        
    //     }
    //   });
  }
  ngOnDestroy(): void {
    this.currentYearSubscription.unsubscribe();
  }
  /*   applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } */

    // // startpopup
    // openWelcomeDialog() {
    //   const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    //     disableClose: true ,
    //     // width:'400px',
       
    //     data: {
    //       animal: 'panda',
    //     },
    //   });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed');
    //     // this.animal = result;
    //   });
    // } 

  getDepartment() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let dept_id = this.currentUser.dept_id;
    let role_id = this.currentUser.role_id;
    this.userService.getDepartmentUnit(login_access_token, unit_id, role_id, dept_id).pipe(first()).subscribe(
      data => {
        this.userDepartment = data;
        this.dataDepartment = this.userDepartment.data;
      },
      error => {
        this.alertService.error(error);
      });
  }
  viewKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.kpiDashboardDataView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe((data: any) => {
      this.viewKpiDashboard = data;
      console.log(this.viewKpiDashboard);

      this.viewKpiDashboard.data.map((kpi: any, index: number) => {
        kpi.sr_no = index + 1;
      });
      // kpi total for table
      this.fucnBarChart(this.viewKpiDashboard.data);
      this.processData(this.viewKpiDashboard.data);
      let KPIDATA = this.viewKpiDashboard.data;
      const KpiTotal = KPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
      const greenTotal = KPIDATA.reduce((sum, item) => sum + item.green, 0);
      const redTotal = KPIDATA.reduce((sum, item) => sum + item.red, 0);
      const yellowTotal = KPIDATA.reduce((sum, item) => sum + item.yellow, 0);
      const grayTotal = KPIDATA.reduce((sum, item) => sum + item.gray, 0);
      const KPI_DATA_TOTAL = {
        position: 0,
        dept_name: 'Total',
        total_kpi: KpiTotal,
        green: greenTotal,
        yellow: yellowTotal,
        red: redTotal,
        gray: grayTotal
      };
      const ELEMENT_DATA: PeriodicElement[] = this.viewKpiDashboard.data;
      ELEMENT_DATA.push(KPI_DATA_TOTAL);
      this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    },
      error => {
        this.alertService.error(error);
      });
  }
  viewLeadKpiDashboardData() {
    let login_access_token = this.currentUser.login_access_token;
    let unit_id = this.unit_id;
    let role_id = this.currentUser.role_id;
    let dept_id = this.currentUser.dept_id;
    let selectedYear = this.userSelectedYear;
    let financialYear = this.companyFinancialYear;
    this.userService.leadKpiDashboardView(login_access_token, unit_id, role_id, dept_id, selectedYear, financialYear).pipe(first()).subscribe(
      (data: any) => {
        this.viewLeadKpiDashboard = data;
        this.processLeadData(this.viewLeadKpiDashboard.data);
      },
      error => {
        this.alertService.error(error);
      });
  }
  filterRenderedData(deptId: any) {
    let kpiDept;
    let leadKpiDept;
    if (deptId) {
      kpiDept = this.viewKpiDashboard.data.filter((kpiDept) => {
        return kpiDept.dept_id === Number(deptId);
      });
      leadKpiDept = this.viewLeadKpiDashboard.data.filter((leadKpiDept) => {
        return leadKpiDept.dept_id === Number(deptId);
      });
      if (kpiDept[0] == null || leadKpiDept[0] == null) {
        this.messageError = 'No data for this department';
        this.alertService.error(this.messageError, true);
        return true;
      }
      else {
        this.processData(kpiDept);
        this.processLeadData(leadKpiDept);
      }
    }
    else {
      kpiDept = this.viewKpiDashboard.data.filter((kpiDept) => {
        return kpiDept.dept_name === "Total";
      });
      this.processData(kpiDept);
      /*leadKpiDept = this.viewLeadKpiDashboard.data.filter((leadKpiDept) => {
        return leadKpiDept.dept_name === "Total";
      });
      this.processLeadData(leadKpiDept);*/
      this.viewLeadKpiDashboardData();
    }
  }
  processLeadData(LeadKPIDATA: any): any {
    // kpi total for pie chart
    const leadKpiTotal = LeadKPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
    const leadGreenTotal = LeadKPIDATA.reduce((sum, item) => sum + item.green, 0);
    const leadRedTotal = LeadKPIDATA.reduce((sum, item) => sum + item.red, 0);
    const leadYellowTotal = LeadKPIDATA.reduce((sum, item) => sum + item.yellow, 0);
    const leadGrayTotal = LeadKPIDATA.reduce((sum, item) => sum + item.gray, 0);
    this.prepareLeadForChart(leadKpiTotal, leadGreenTotal, leadRedTotal, leadYellowTotal, leadGrayTotal);
  }
  prepareLeadForChart(leadKpiTotal, leadGreenTotal, leadRedTotal, leadYellowTotal, leadGrayTotal) {
    const totalLeadKPI = leadKpiTotal;
    const graphDataLeadKPI = [
      {
        "label": (leadRedTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadRedTotal,
        "color": "#f44336"
      }, {

        "label": (leadGreenTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadGreenTotal,
        "color": "#4caf50"
      }, {
        "label": (leadYellowTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadYellowTotal,
        "color": "#FFD933"
      },
      {
        "label": (leadGrayTotal * 100 / leadKpiTotal).toFixed(1) + '%',
        "value": leadGrayTotal,
        "color": "#a9b7b6"
      }
    ];
    this.fucnPieChart("pieChartLeadKPI", graphDataLeadKPI, totalLeadKPI);
  }
  processData(KPIDATA: any): any {
    // kpi total for pie chart
    const KpiTotal = KPIDATA.reduce((sum, item) => sum + item.total_kpi, 0);
    const greenTotal = KPIDATA.reduce((sum, item) => sum + item.green, 0);
    const redTotal = KPIDATA.reduce((sum, item) => sum + item.red, 0);
    const yellowTotal = KPIDATA.reduce((sum, item) => sum + item.yellow, 0);
    const grayTotal = KPIDATA.reduce((sum, item) => sum + item.gray, 0);
    this.prepareDataForChart(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal);
  }
  prepareDataForChart(KpiTotal, greenTotal, redTotal, yellowTotal, grayTotal) {
    const totalKPI = KpiTotal;
    const graphDataKPI = [
      {
        "label": (redTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": redTotal,
        "color": "#f44336"
      }, {

        "label": (greenTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": greenTotal,
        "color": "#4caf50"
      }, {
        "label": (yellowTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": yellowTotal,
        "color": "#FFD933"
      },
      {
        "label": (grayTotal * 100 / KpiTotal).toFixed(1) + '%',
        "value": grayTotal,
        "color": "#a9b7b6"
      }
    ];
    this.fucnPieChart("pieChartKPI", graphDataKPI, totalKPI);
  }
  fucnPieChart(element: string, data: Array<any>, totalText: any) {
    this[element].nativeElement.innerHTML = '';
    let redirectPage = element;
    let pie = new d3pie(element, {
      "header": {
        "title": {
          "text": totalText,
          "fontSize": 24,
          //"font": "courier",
          "fontWeight": 600,
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
        "pieOuterRadius": "83%"
      },
      "data": {
        "sortOrder": "value-desc",
        "content": data
      },
      callbacks: {
        onClickSegment: function (e) {
          const deptName = '';
          this.chartClickable(redirectPage, deptName);
        }.bind(this)
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
  fucnBarChart(barChartdata: any): any {
    const redDataKPI = {
      name: 'Red',
      data: [],
      color: '#f44336'
    };
    const yellowDataKPI = {
      name: 'Yellow',
      data: [],
      color: '#FFD933'
    };
    const greenDataKPI = {
      name: 'Green',
      data: [],
      color: '#4caf50'
    };
    const grayDataKPI = {
      name: 'Gray',
      data: [],
      color: '#a9b7b6'
    };
    const depts: Array<string> = [];
    this.depDataBarChart = [...barChartdata];
    console.log("chart", this.depDataBarChart);

    this.depDataBarChart.map((data) => {
      depts.push(data.dept_name);
      redDataKPI.data.push(data.red);
      yellowDataKPI.data.push(data.yellow);
      greenDataKPI.data.push(data.green);

      grayDataKPI.data.push(data.gray);
    });
    const seriesKPI = [greenDataKPI, yellowDataKPI, redDataKPI, grayDataKPI];
    const titleKPI = { text: '' };
    this.prepareDataForBarChart("containerKPI", seriesKPI, depts, titleKPI);
  }
  prepareDataForBarChart(element: string, data: any, categories: any, titleText: any) {
    let redirectPage = element;
    Highcharts.chart(element, {
      chart: {
        type: 'bar',
        // plotBorderWidth: 1,
        style: {
          fontFamily: 'Muli, Helvetica Neue, Arial, sans-serif'
        }
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: true,
            color: '#ffffff',
            style: {
              fontSize: '12px'
            }
          }
        },
        series: {
          cursor: 'pointer',
          point: {
            events: {
              click: function (e) {
                //const p = e.point.series.userOptions;
                const deptName = e.point.category;
                this.chartClickable(redirectPage, deptName);
              }.bind(this)
            }
          },
          dataLabels: {
            enabled: true,
            inside: true
          },
          showInLegend: false,
          stacking: 'normal'
        }
      },
      title: titleText,
      xAxis: {
        categories: categories,
        labels: {
          //rotation:0,
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: ''
        }
      },
      legend: {
        // layout: 'vertical',
        // align: 'right',
        //verticalAlign: 'top',
        // x: 0,
        //y: 5,
        //floating: true,
        // borderWidth: 1,
        //borderRadius: 2,
        // backgroundColor: '#FFFFFF',
        //shadow: true,
        //width:100,
        //itemMarginTop: 5,
        //itemMarginBottom: 5
      },
      series: data
    });
  }
  chartClickable(redirectPage, deptName) {
    if (redirectPage == "pieChartKPI") {
      this.router.navigate(['/apps/kpitrackers/addkpidata']);
    }
    else if (redirectPage == "containerKPI") {
      this.router.navigate(['/apps/kpitrackers/keyperformance/' + deptName]);
    }
    else if (redirectPage == "pieChartLeadKPI") {
      this.router.navigate(['/apps/strategic-obj/leadkpi']);
    }
    else {
      this.router.navigate(['/apps/kpitrackers/dashboard']);
    }
  }
  /*  kpiDashboardPDF() {
     //let element = document.querySelector("#capture");
     var element = document.getElementById('kpidashboard');
     html2canvas(document).then(function (canvas) {
       // Convert the canvas to blob
       canvas.toBlob(function (blob) {
         // To download directly on browser default 'downloads' location
         let link = document.createElement("a");
         link.download = "image.png";
         link.href = URL.createObjectURL(blob);
         link.click();
         // To save manually somewhere in file explorer
         window.saveAs(blob, 'image.png');
       }, 'image/png');
     });
   } */
  kpiDashboardPDF() {
    this.loaderService.show();
    var data = document.getElementById('kpidashboard');
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
      pdf.save('kpidashboard.pdf'); // Generated PDF
      this.loaderService.hide();
    });
  }
}
export interface PeriodicElement {
  sr_no?: number;
  position: number;
  dept_name: string;
  total_kpi: number;
  green: number;
  yellow: number;
  red: number;
  gray: number;
}
export interface PeriodicElementLesent {
  lesent_description: string;
  lesent_name: string;
}
const ELEMENT_DATA_LESENT: PeriodicElementLesent[] = [
  // { lesent_name: 'Green', lesent_description: 'Activity completed on time' },
  // { lesent_name: 'Yellow', lesent_description: 'Some delay / Action plan in place' },
  // { lesent_name: 'Red', lesent_description: 'Delayed / No recovery action plan' },
  // { lesent_name: 'Gray', lesent_description: 'Activity ongoing / On track' },
  { lesent_name: 'Red', lesent_description: 'Target missed' },
  { lesent_name: 'Yellow', lesent_description: 'Target missed/ marginal gap wrt to target' },
  { lesent_name: 'Green', lesent_description: 'Met the target/ Better than target' },
  { lesent_name: 'Gray', lesent_description: 'HOLD' },
];
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
  styleUrls: ['./kpidashboard.component.scss'],

})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}
 
  // onNosClick(): void {
  //   this.dialogRef.close();
  // }
  // openobj(){
  //   this.isopened =true;

  // }
  // openobjclose(){
  //   this.isopened =false;

  // }
}