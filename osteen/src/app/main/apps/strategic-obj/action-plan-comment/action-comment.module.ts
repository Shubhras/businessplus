import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatButtonToggleModule, MatToolbar, MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { ActionCommentComponent,ChangeReview} from 'app/main/apps/strategic-obj/action-plan-comment/action-comment.component';
import { ComboChartComponent } from './Charts/combochart.component'
import { LineChartComponent } from './Charts/linechart.component'
import { GoogleComboChartService } from './google-combo-chart.service';
import { GoogleLineChartService } from './google-line-chart.service';
import { addActualDialod } from '../../kpitrackers/addkpidata/addactual.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

//import { targetActualDialod} from '../../common-dialog/kpi-actual/target-actual.component';
const routes: Routes = [
    {
        path     : '**',
        component: ActionCommentComponent,
        resolve  : {

        }
    }
];
@NgModule({
    declarations: [
        ActionCommentComponent,
        ComboChartComponent,
        // addActualDialod,
        LineChartComponent,
        ChangeReview
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
        MatToolbarModule,
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
        MatButtonToggleModule,
        NgMultiSelectDropDownModule.forRoot()
        
    ],
    providers   : [
        GoogleComboChartService,
        GoogleLineChartService,
        
    ],
     entryComponents : [ChangeReview]
})   
export class ActionCommentModule
{
}

