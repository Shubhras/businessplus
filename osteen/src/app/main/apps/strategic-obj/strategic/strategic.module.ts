import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatTooltipModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { StrategicComponent,UserCommentSheet} from 'app/main/apps/strategic-obj/strategic/strategic.component';
// import { AddStrategicDialog,PerformanceDialog} from 'app/main/apps/strategic-obj/strategic/addstrategic.component';

import { PerformanceEditDialog} from 'app/main/apps/strategic-obj/strategic/editstrategic.component';
import { DatePipe } from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatGridListModule} from '@angular/material/grid-list';
import { PerformanceDialog } from './addstrategic.component';
import { StrategicGroupByComponent } from './strategic-group-by/strategic-group-by.component';
// import { LeadkpiperformanceComponent } from './leadkpiperformance/leadkpiperformance.component';

const routes: Routes = [
    {
        path     : '**',
        component: StrategicComponent,
        resolve  : {

        }
    }
];

@NgModule({
    declarations: [
        StrategicComponent,
        //AddStrategicDialog,
        // EditStrategicDialog,
        UserCommentSheet,
        PerformanceDialog,
        PerformanceEditDialog,
        StrategicGroupByComponent,
        // LeadkpiperformanceComponent,
        
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
        MatTooltipModule,
        MatBottomSheetModule,
        MatGridListModule,
        MatToolbarModule
    ],
    providers   : [
        DatePipe
    ],
   entryComponents : [ UserCommentSheet,PerformanceDialog,PerformanceEditDialog,StrategicGroupByComponent]
})
export class StrategicModule
{
}

