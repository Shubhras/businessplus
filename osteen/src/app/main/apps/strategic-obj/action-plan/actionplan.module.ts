import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatTooltipModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ActionPlanComponent,DialogOverviewExampleDialog,UserCommentSheet} from 'app/main/apps/strategic-obj/action-plan/actionplan.component';
//import { AddActionPlanDialog} from 'app/main/apps/strategic-obj/action-plan/addactionplan.component';
import { EditActionPlanDialog} from 'app/main/apps/strategic-obj/action-plan/editactionplan.component';
import { DatePipe } from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
const routes: Routes = [
    {
        path     : '**',
        component: ActionPlanComponent,
        resolve  : {

        }
    }
];
@NgModule({
    declarations: [
        ActionPlanComponent,
        //AddActionPlanDialog,
       // AddKpiDialog,
        // EditActionPlanDialog,
        UserCommentSheet,
        DialogOverviewExampleDialog
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
        MatToolbarModule
    ],
    providers   : [
        DatePipe
    ],
   entryComponents : [UserCommentSheet,DialogOverviewExampleDialog]
})
export class ActionPlanModule
{
}

