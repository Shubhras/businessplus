import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule, MatTooltipModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { KpidatagraphComponent} from 'app/main/apps/kpitrackers/kpidata-graph/kpidatagraph.component';
//import { targetActualDialod} from '../../common-dialog/kpi-actual/target-actual.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ComboChartComponent } from './Charts/combochart.component'
import { LineChartComponent } from './Charts/linechart.component'
import { GoogleComboChartService } from './google-combo-chart.service';
import { GoogleLineChartService } from './google-line-chart.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
const routes: Routes = [
    {
        path     : '**',
        component: KpidatagraphComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        KpidatagraphComponent,
       // KpiDefinitionDialog,
        ComboChartComponent,
        LineChartComponent,
        //targetActualDialod
    ],
    imports     : [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule ,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        FuseWidgetModule,
        MatTableModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatCheckboxModule,
       MDBBootstrapModule.forRoot(),
       MatTooltipModule,
       MatSidenavModule,
       MatToolbarModule,
       MatButtonToggleModule
    ],
    providers   : [
        GoogleComboChartService,
        GoogleLineChartService
    ],
   // entryComponents : [KpiDefinitionDialog]
})
export class KpidatagraphModule
{
}
