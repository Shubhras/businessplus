import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatToolbarModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { BusinessObjectiveComponent} from 'app/main/apps/strategic-obj/business-objective/objective.component';
import { AddObjective} from 'app/main/apps/strategic-obj/business-objective/addobjective.component';
import { EditObjective} from 'app/main/apps/strategic-obj/business-objective/editobjective.component';
const routes: Routes = [
    {
        path     : '**',
        component: BusinessObjectiveComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        BusinessObjectiveComponent,
        AddObjective,
        EditObjective
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
        MatToolbarModule
    ],
    providers   : [
    ],
   entryComponents : [AddObjective,EditObjective]
})
export class BusinessObjectiveModule
{
}

