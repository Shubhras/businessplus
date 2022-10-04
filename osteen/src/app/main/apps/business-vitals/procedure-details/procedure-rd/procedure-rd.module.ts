import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { LightboxModule } from 'ngx-lightbox';
import { ProcedureRdComponent} from './procedure-rd.component';
import { GoogleComboChartComponent } from "./google-combo-chart.component";
import { GoogleChartsModule } from 'angular-google-charts';  
const routes: Routes = [
    {
        path     : '**',
        component: ProcedureRdComponent,
        resolve  : {

        }
    }
];

@NgModule({
    declarations: [
        ProcedureRdComponent,
        GoogleComboChartComponent
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
        GoogleChartsModule,
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
        LightboxModule
    ],
    providers   : [
    ]
})
export class ProcedureRdModule
{
}