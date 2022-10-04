import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatListModule,MatToolbarModule, MatTooltipModule,} from '@angular/material';
import { ColorPickerModule } from 'ngx-color-picker';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import {FuseSidebarModule } from '@fuse/components';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { BusinessSettingComponent} from 'app/main/apps/module-roles/business-setting/business-setting.component';
import { performanceKpiDialog} from 'app/main/apps/module-roles/business-setting/performance-kpi.component';
//import {MatRadioModule} from '@angular/material/radio';
const routes: Routes = [
    {
        path     : '**',
        component: BusinessSettingComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        BusinessSettingComponent,
        performanceKpiDialog
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
        MatListModule,
        FuseSidebarModule,
        MatToolbarModule,
        MatTooltipModule,
        ColorPickerModule
    ],
    providers   : [
    ],
    entryComponents : [performanceKpiDialog]
})
export class BusinessSettingModule
{
}

