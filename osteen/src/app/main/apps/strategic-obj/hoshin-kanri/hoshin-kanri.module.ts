import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule, MatTableModule, MatPaginatorModule ,MatInputModule, MatDialogModule,MatDatepickerModule,MatCheckboxModule,MatTooltipModule,MatCardModule} from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { HoshinKanriComponent} from 'app/main/apps/strategic-obj/hoshin-kanri/hoshin-kanri.component';
import { AddHoshin} from 'app/main/apps/strategic-obj/hoshin-kanri/addhoshin.component';
import { EditHoshin} from 'app/main/apps/strategic-obj/hoshin-kanri/edithoshin.component';
import { DatePipe } from '@angular/common';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
const routes: Routes = [
    {
        path     : '**',
        component: HoshinKanriComponent,
        resolve  : {
        }
    }
];
@NgModule({
    declarations: [
        HoshinKanriComponent,
        AddHoshin,
        EditHoshin
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
        MatCardModule
    ],
    providers   : [
        //ActionPlanService,
        DatePipe
    ],
   entryComponents : [AddHoshin, EditHoshin]
})
export class HoshinKanriModule
{
}

