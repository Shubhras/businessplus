import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, NativeDateAdapter, DateAdapter, MAT_DATE_FORMATS, MatTooltipModule, MatToolbarModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { StrategicInitiativeHelpComponent } from 'app/main/apps/strategic-obj/strategic-initiative-help/strategic-initiative-help.component';
// import { ComboChartComponent } from './Charts/combochart.component'
// import { LineChartComponent } from './Charts/linechart.component'
// import { GoogleComboChartService } from './google-combo-chart.service';
// import { GoogleLineChartService } from './google-line-chart.service';
const routes: Routes = [
    {
        path: '**',
        component: StrategicInitiativeHelpComponent,
        resolve: {
        }
    }
];
@NgModule({
    declarations: [
        StrategicInitiativeHelpComponent,
        // ComboChartComponent,
        // LineChartComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule,
        MatListModule,
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
        MatTooltipModule,
        MatToolbarModule
    ],
    // providers   : [
    //     GoogleComboChartService,
    //     GoogleLineChartService
    // ],
})
export class StrategicInitiativeHelpModule {
}

