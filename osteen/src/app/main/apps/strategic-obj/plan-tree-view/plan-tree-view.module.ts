import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule, MatInputModule, MatDialogModule, MatDatepickerModule, MatCheckboxModule, MatButtonToggleModule, MatToolbarModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { IndicatorsModule } from '@progress/kendo-angular-indicators';
// import { NgxLoaderModule } from '@tusharghoshbd/ngx-loader';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { InitiativeComponent, } from 'app/main/apps/strategic-obj/initiative/initiative.component';
//import { EditStrategicDialog} from 'app/main/apps/strategic-obj/strategic/editstrategic.component';
//import { EditInitiativeDialog } from 'app/main/apps/strategic-obj/initiative-data/editinitiative.component';
import { InitiativeService } from 'app/main/apps/strategic-obj/initiative/initiative.service';
//import { EditActionPlanDialog } from 'app/main/apps/strategic-obj/action-plan/editactionplan.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatePipe } from '@angular/common';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { OrderModule } from  'ngx-order-pipe';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DialogOverviewExampleDialog, PlanTreeViewComponent} from './plan-tree-view.component';
const routes: Routes = [
    {
        path: '',
        component: PlanTreeViewComponent,
        resolve: {

        }
    }
];
@NgModule({
    declarations: [
        PlanTreeViewComponent,
        DialogOverviewExampleDialog
        //EditStrategicDialog,
        //EditInitiativeDialog,
        // EditActionPlanDialog
        
       
    ],
    imports: [
        CommonModule,
        MatTooltipModule,
        // NgxLoaderModule,
        // IndicatorsModule,
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatInputModule,
        MatDialogModule,
        OrderModule,
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
        MatExpansionModule,
        MatBottomSheetModule,
        MatButtonToggleModule,
        MatToolbarModule,
        //EditStrategicDialog
    ],
    providers: [
        InitiativeService,
        DatePipe
    ],
    entryComponents: [DialogOverviewExampleDialog ]
})
export class PlanTreeViewModule {
}

