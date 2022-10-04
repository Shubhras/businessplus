import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatListModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { SwotAnalysisComponent} from 'app/main/apps/strategic-obj/swot-analysis/swot-analysis.component';
import { AddStrengths} from 'app/main/apps/strategic-obj/swot-analysis/addstrengths.component';
import { EditStrengths} from 'app/main/apps/strategic-obj/swot-analysis/editstrengths.component';
import { AddWeakness} from 'app/main/apps/strategic-obj/swot-analysis/addweaknesses.component';
import { EditWeakness} from 'app/main/apps/strategic-obj/swot-analysis/editweaknesses.component';
import { AddOpportunities} from 'app/main/apps/strategic-obj/swot-analysis/addopportunities.component';
import { EditOpportunities} from 'app/main/apps/strategic-obj/swot-analysis/editopportunities.component';
import { AddThreats} from 'app/main/apps/strategic-obj/swot-analysis/addthreats.component';
import { EditThreats} from 'app/main/apps/strategic-obj/swot-analysis/editthreats.component';
const routes: Routes = [
    {
        path     : '**',
        component: SwotAnalysisComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        SwotAnalysisComponent,
        // AddStrengths,
        // EditStrengths,
        // AddWeakness,
        // EditWeakness,
        // AddOpportunities,
        // EditOpportunities,
        // AddThreats,
        // EditThreats
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
        MatListModule,
        MatToolbarModule
    ],
    providers   : [
    ],
   entryComponents : [
            // AddWeakness,
            // EditWeakness,
            // AddStrengths,
            // EditStrengths,
            // AddOpportunities,
            // EditOpportunities,
            // AddThreats,
            // EditThreats
   ]
})
export class SwotAnalysisModule
{
}

