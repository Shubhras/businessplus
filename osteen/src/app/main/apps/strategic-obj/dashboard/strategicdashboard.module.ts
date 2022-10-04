import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { StrategicDashboardComponent } from 'app/main/apps/strategic-obj/dashboard/strategicdashboard.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
//import { GoogleChartsModule } from 'angular-google-charts';
import { ChartModule } from 'angular-highcharts';
import { jqxChartComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxchart';
const routes: Routes = [
    {
        path     : '**',
        component: StrategicDashboardComponent,
        resolve  : {

        }
    }
];

@NgModule({
    declarations: [
        StrategicDashboardComponent, jqxChartComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule ,
        MDBBootstrapModule.forRoot(),
        //GoogleChartsModule.forRoot(),
        ChartModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
         ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule
    ],
    providers   : [
    ]
})
export class StrategicDashboardModule
{
}

